import type { PoolClient } from "pg";
import { execute } from "@/infrastructure/database/connection";

export function selectIaaAuthUsers(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "SELECT id,email,display_name,organisation_id,is_active FROM iaa_auth.users ORDER BY display_name,id LIMIT 200",
    values,
    tx,
  );
}

export function insertIaaAuthUsers(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "INSERT INTO iaa_auth.users(identity_subject,email,display_name,organisation_id) VALUES($1,$2,$3,$4) ON CONFLICT(identity_subject) DO UPDATE SET email=excluded.email,display_name=excluded.display_name RETURNING id",
    values,
    tx,
  );
}

export function insertIaaAuthUserRoles(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "INSERT INTO iaa_auth.user_roles(user_id,role_id,organisation_id) SELECT $1,id,$2 FROM iaa_auth.roles WHERE code=$3 ON CONFLICT DO NOTHING",
    values,
    tx,
  );
}

export function updateIaaAuthUsers(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "UPDATE iaa_auth.users SET is_active=false WHERE id=$1 RETURNING id",
    values,
    tx,
  );
}

export function selectOpsNotifications(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "SELECT id,template_code,payload,scheduled_at,status FROM ops.notifications WHERE recipient_id=$1 AND channel='in_app' AND scheduled_at<=now() ORDER BY scheduled_at DESC LIMIT 100",
    values,
    tx,
  );
}

export function updateOpsNotifications(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "UPDATE ops.notifications SET status='read' WHERE id=$1 AND recipient_id=$2 AND channel='in_app' RETURNING id",
    values,
    tx,
  );
}

export function insertOpsNotifications(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    `INSERT INTO ops.notifications(recipient_id,obligation_id,channel,template_code,payload,scheduled_at,dedupe_key) SELECT o.assigned_to,o.id,'in_app','return_due',jsonb_build_object('obligationId',o.id,'dueAt',o.due_at),now(),'due:'||o.id::text||':'||current_date::text FROM mon.obligations o WHERE o.assigned_to IS NOT NULL AND o.waived_at IS NULL AND o.due_at<=now()+interval '7 days' AND NOT EXISTS(SELECT 1 FROM mon.submissions s JOIN mon.submission_versions v ON v.submission_id=s.id WHERE s.obligation_id=o.id AND v.status='approved') ON CONFLICT(dedupe_key) DO NOTHING RETURNING id`,
    values,
    tx,
  );
}

export function insertProjectMemberships(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "INSERT INTO project.memberships(project_id,user_id,role_id,valid_until) SELECT $1,$2,id,$4 FROM iaa_auth.roles WHERE code=$3 ON CONFLICT(project_id,user_id,role_id) DO UPDATE SET valid_until=excluded.valid_until RETURNING id",
    values,
    tx,
  );
}
