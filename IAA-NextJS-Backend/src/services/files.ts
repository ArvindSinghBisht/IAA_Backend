import * as repository from "@/repositories/files.repository";
import { readBytes } from "@/lib/request-body";
import { createHash, randomUUID } from "node:crypto";
import { z } from "zod";
import { unitOfWork as transaction } from "@/infrastructure/database/unit-of-work";
import { isGlobal, projectAccess, type Actor } from "@/lib/auth";
import { admin, audit } from "@/lib/governance";
import { ApiError, uuid } from "@/lib/http";
const allowed = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "application/json",
  "text/csv",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);

export async function upload(a: Actor, req: Request) {
  const mime = req.headers.get("content-type")?.split(";")[0] ?? "";
  if (!allowed.has(mime))
    throw new ApiError(
      415,
      "FILE_TYPE",
      "PDF, PNG, JPEG, XLSX, CSV or JSON required",
    );
  const name = z.string().min(1).max(200).parse(req.headers.get("x-file-name"));
  if (/[\r\n/\\]/.test(name))
    throw new ApiError(400, "FILENAME", "Provide a plain filename");
  const bytes = await readBytes(req, 5242880);
  if (!bytes.length) throw new ApiError(400, "EMPTY_FILE", "File is empty");
  if (
    (mime === "application/pdf" &&
      !bytes.subarray(0, 5).equals(Buffer.from("%PDF-"))) ||
    (mime === "image/png" &&
      !bytes
        .subarray(0, 8)
        .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) ||
    (mime === "image/jpeg" && !(bytes[0] === 255 && bytes[1] === 216)) ||
    (mime.includes("spreadsheetml") && bytes.subarray(0, 2).toString() !== "PK")
  )
    throw new ApiError(
      415,
      "FILE_SIGNATURE",
      "File bytes do not match declared type",
    );
  return transaction(async (c) => {
    const f = (
      await repository.insertDataFiles(
        [
          "database/" + randomUUID(),
          name,
          mime,
          bytes.length,
          createHash("sha256").update(bytes).digest("hex"),
          a.id,
        ],
        c,
      )
    ).rows[0];
    await repository.insertDataFilePayloads([f.id, bytes], c);
    await audit(c, a, "data.files", f.id, "file_uploaded");
    return f;
  });
}
export async function reviewFile(a: Actor, id: string, input: unknown) {
  admin(a);
  uuid.parse(id);
  const p = z
    .object({
      status: z.enum(["clean", "rejected"]),
      reason: z.string().trim().min(1).max(2000),
    })
    .strict()
    .parse(input);
  return transaction(async (c) => {
    const f = (await repository.updateDataFiles([id, p.status], c)).rows[0];
    if (!f)
      throw new ApiError(409, "FILE_STATE", "Review requires a pending file");
    await audit(c, a, "data.files", id, "file_reviewed", {
      status: p.status,
      reason: p.reason,
    });
    return f;
  });
}
export async function download(a: Actor, id: string) {
  uuid.parse(id);
  const f = (await repository.selectDataFiles([id], undefined)).rows[0];
  if (!f) throw new ApiError(404, "NOT_FOUND", "File not found");
  let permitted = isGlobal(a) || f.uploaded_by === a.id;
  if (!permitted) {
    const links = (await repository.selectProjectDocuments([id], undefined))
      .rows;
    for (const link of links) {
      try {
        await projectAccess(a, link.project_id, "read");
        permitted = true;
        break;
      } catch (e) {
        if (!(e instanceof ApiError) || e.status !== 403) throw e;
      }
    }
  }
  if (!permitted)
    throw new ApiError(
      403,
      "FILE_ACCESS",
      "File is outside your permitted projects",
    );
  if (f.scan_status !== "clean" && !isGlobal(a))
    throw new ApiError(423, "QUARANTINED", "File has not passed review");
  return new Response(new Uint8Array(f.content), {
    headers: {
      "Content-Type": f.mime_type,
      "Content-Disposition": `attachment; filename="download-${f.id}"`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store",
    },
  });
}
export async function publicDownload(id: string) {
  uuid.parse(id);
  const f = (await repository.selectDataFiles2([id], undefined)).rows[0];
  if (!f) throw new ApiError(404, "NOT_FOUND", "No published file");
  return new Response(new Uint8Array(f.content), {
    headers: {
      "Content-Type": f.mime_type,
      "Content-Disposition": `attachment; filename="iaa-${f.id}"`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-store",
    },
  });
}
