BEGIN;
ALTER TABLE project.versions ADD COLUMN submitted_by uuid REFERENCES iaa_auth.users(id);
ALTER TABLE project.versions ADD COLUMN submitted_at timestamptz;
CREATE TABLE project.review_events (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 project_version_id uuid NOT NULL REFERENCES project.versions(id),
 actor_id uuid NOT NULL REFERENCES iaa_auth.users(id),
 action text NOT NULL CHECK(action IN ('submit','return','approve','reject','revise','publish','revoke')),
 reason text,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER append_project_review BEFORE UPDATE OR DELETE ON project.review_events FOR EACH ROW EXECUTE FUNCTION ops.append_only();
CREATE TABLE data.version_events (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),version_id uuid NOT NULL REFERENCES data.dataset_versions(id),
 actor_id uuid NOT NULL REFERENCES iaa_auth.users(id),action text NOT NULL,reason text NOT NULL,created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER append_dataset_review BEFORE UPDATE OR DELETE ON data.version_events FOR EACH ROW EXECUTE FUNCTION ops.append_only();
CREATE TABLE mon.api_metrics (
 submission_version_id uuid PRIMARY KEY REFERENCES mon.submission_versions(id),
 payload_hash text NOT NULL,method_version text NOT NULL,output jsonb NOT NULL,created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE data.file_payloads (
 file_id uuid PRIMARY KEY REFERENCES data.files(id),
 content bytea NOT NULL CHECK(octet_length(content)<=5242880),
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE ops.api_rate_limits (
 bucket text PRIMARY KEY,window_start timestamptz NOT NULL DEFAULT now(),requests integer NOT NULL DEFAULT 1
);
CREATE FUNCTION project.guard_profile_child() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE parent uuid; state text;
BEGIN
 IF TG_OP='DELETE' THEN parent:=OLD.project_version_id; ELSE parent:=NEW.project_version_id; END IF;
 IF TG_OP='UPDATE' AND NEW.project_version_id<>OLD.project_version_id THEN RAISE EXCEPTION 'Parent cannot change'; END IF;
 SELECT review_status INTO state FROM project.versions WHERE id=parent FOR UPDATE;
 IF state IS DISTINCT FROM 'draft' THEN RAISE EXCEPTION 'Only draft profiles are editable'; END IF;
 IF TG_OP='DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
END $$;
DO $$ DECLARE t text; BEGIN
 FOREACH t IN ARRAY ARRAY['partners','land_uses','designs','grid_connections','crop_plans','profile_notes','documents'] LOOP
 EXECUTE format('CREATE TRIGGER protect_profile BEFORE INSERT OR UPDATE OR DELETE ON project.%I FOR EACH ROW EXECUTE FUNCTION project.guard_profile_child()',t);
 END LOOP;
END $$;
-- Publication is explicit and revocable; one active release per profile.
CREATE UNIQUE INDEX IF NOT EXISTS one_active_project_publication ON project.publications(project_version_id) WHERE revoked_at IS NULL;
CREATE UNIQUE INDEX one_current_approved_dataset ON data.dataset_versions(dataset_id) WHERE status='approved' AND is_current;
COMMIT;
