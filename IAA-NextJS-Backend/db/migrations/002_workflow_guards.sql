-- Apply AFTER 01_schema.sql. These guards enforce record state, not user permissions.
-- API service must enforce role/project scope; no general-purpose table write API.
BEGIN;
CREATE FUNCTION mon.guard_payload_fact() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE parent_id uuid; parent_status text;
BEGIN
  IF TG_OP='DELETE' THEN parent_id:=OLD.submission_version_id; ELSE parent_id:=NEW.submission_version_id; END IF;
  IF TG_OP='UPDATE' AND NEW.submission_version_id<>OLD.submission_version_id THEN
    RAISE EXCEPTION 'Payload record cannot move between revisions';
  END IF;
  SELECT status INTO parent_status FROM mon.submission_versions WHERE id=parent_id FOR UPDATE;
  IF parent_status IS DISTINCT FROM 'draft' THEN RAISE EXCEPTION 'Submitted payload is immutable; create a correction revision'; END IF;
  IF TG_OP='DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
END $$;
DO $$ DECLARE n text; BEGIN
 FOREACH n IN ARRAY ARRAY['indicator_values','energy_records','harvest_records','participation_records',
  'inclusion_totals','income_records','land_records','practice_records','scheme_linkages','progress_records','evidence'] LOOP
  EXECUTE format('CREATE TRIGGER protect_payload BEFORE INSERT OR UPDATE OR DELETE ON mon.%I FOR EACH ROW EXECUTE FUNCTION mon.guard_payload_fact()',n);
 END LOOP;
END $$;
CREATE FUNCTION mon.guard_version_transition() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF TG_OP='DELETE' THEN RAISE EXCEPTION 'Submission revisions cannot be deleted'; END IF;
 IF TG_OP='INSERT' THEN
  IF NEW.status<>'draft' THEN RAISE EXCEPTION 'A new revision must begin as draft'; END IF;
  RETURN NEW;
 END IF;
 IF NEW.submission_id<>OLD.submission_id OR NEW.project_id<>OLD.project_id OR NEW.revision<>OLD.revision THEN
  RAISE EXCEPTION 'Submission identity cannot change';
 END IF;
 IF OLD.status<>'draft' AND
    (to_jsonb(NEW)-ARRAY['status','approved_by','approved_at']) IS DISTINCT FROM
    (to_jsonb(OLD)-ARRAY['status','approved_by','approved_at']) THEN
  RAISE EXCEPTION 'Submitted revision fields are immutable';
 END IF;
 IF NEW.status<>OLD.status AND NOT (
   (OLD.status='draft' AND NEW.status='submitted') OR
   (OLD.status='submitted' AND NEW.status IN ('returned','approved','rejected')) OR
   (OLD.status='approved' AND NEW.status='superseded')) THEN
  RAISE EXCEPTION 'Invalid submission transition: % to %',OLD.status,NEW.status;
 END IF;
 IF NEW.status='submitted' AND NEW.validation_status<>'passed' THEN RAISE EXCEPTION 'Validation must pass before submission'; END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER protect_version BEFORE INSERT OR UPDATE OR DELETE ON mon.submission_versions
FOR EACH ROW EXECUTE FUNCTION mon.guard_version_transition();
CREATE FUNCTION mon.guard_release() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE v mon.submission_versions;
BEGIN
 SELECT * INTO v FROM mon.submission_versions WHERE id=NEW.submission_version_id FOR UPDATE;
 IF v.status<>'approved' OR v.validation_status<>'passed' THEN RAISE EXCEPTION 'Only approved validated revisions can be released'; END IF;
 IF EXISTS(SELECT 1 FROM project.projects WHERE id=v.project_id AND is_demo) THEN RAISE EXCEPTION 'Demo records cannot be released'; END IF;
 IF jsonb_typeof(NEW.field_whitelist)<>'array' THEN RAISE EXCEPTION 'Release fields must be an explicit array'; END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER check_release BEFORE INSERT ON mon.releases FOR EACH ROW EXECUTE FUNCTION mon.guard_release();
CREATE FUNCTION project.guard_publication() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE v project.versions;
BEGIN
 SELECT * INTO v FROM project.versions WHERE id=NEW.project_version_id FOR UPDATE;
 IF v.review_status<>'approved' THEN RAISE EXCEPTION 'Project version requires approval'; END IF;
 IF EXISTS(SELECT 1 FROM project.projects WHERE id=v.project_id AND is_demo) THEN RAISE EXCEPTION 'Demo records cannot be published'; END IF;
 IF jsonb_typeof(NEW.public_fields)<>'array' THEN RAISE EXCEPTION 'Public fields must be an explicit array'; END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER check_publication BEFORE INSERT ON project.publications FOR EACH ROW EXECUTE FUNCTION project.guard_publication();
CREATE FUNCTION ops.append_only() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN RAISE EXCEPTION 'Append-only history cannot be changed or removed'; END $$;
CREATE TRIGGER protect_audit BEFORE UPDATE OR DELETE ON ops.audit_events FOR EACH ROW EXECUTE FUNCTION ops.append_only();
CREATE TRIGGER protect_review BEFORE UPDATE OR DELETE ON mon.review_events FOR EACH ROW EXECUTE FUNCTION ops.append_only();
-- Correction reasons must be present, not only non-empty when supplied.
ALTER TABLE mon.review_events ADD CHECK(action NOT IN ('return','reject','revoke') OR (reason IS NOT NULL AND length(trim(reason))>0));
COMMIT;
