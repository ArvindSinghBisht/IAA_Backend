BEGIN;
-- API outputs are explicitly indicative until partner-approved methods are installed.
CREATE TABLE plan.api_run_summaries (
 run_id uuid PRIMARY KEY REFERENCES plan.runs(id),
 output jsonb NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS assessment_token_lookup ON plan.assessments(access_token_hash) WHERE access_token_hash IS NOT NULL;
COMMIT;
