-- ==== SETUP ================================================

-- Create clubs table
CREATE TABLE IF NOT EXISTS "clubs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar NOT NULL,
	"area" varchar NOT NULL,
	"district" varchar NOT NULL,
	"division" varchar NOT NULL,
	"region" varchar NOT NULL,
	"number" varchar NOT NULL UNIQUE,
	"president" uuid,
	"vp_education" uuid,
	"vp_membership" uuid,
	"vp_pr" uuid,
	"secretary" uuid,
	"treasurer" uuid,
	"sergeant_at_arms" uuid,
	"past_president" uuid,
	"created_at" timestamptz NOT NULL DEFAULT NOW(),
	"updated_at" timestamptz NOT NULL DEFAULT NOW()
);

-- Create paths table
CREATE TABLE IF NOT EXISTS "paths" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar NOT NULL UNIQUE,
	"description" varchar NOT NULL UNIQUE,
	"logo_url" varchar NOT NULL UNIQUE,
	"is_legacy" boolean NOT NULL DEFAULT FALSE,
	"created_at" timestamptz NOT NULL DEFAULT NOW(),
	"updated_at" timestamptz NOT NULL DEFAULT NOW()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	-- indexed
	"path_id" uuid NOT NULL REFERENCES "paths"("id") ON DELETE CASCADE,
	"level" int NOT NULL,
	"title" varchar NOT NULL,
	"is_elective" boolean NOT NULL,
	"created_at" timestamptz NOT NULL DEFAULT NOW(),
	"updated_at" timestamptz NOT NULL DEFAULT NOW()
);

-- Index projects by path_id, because we'll be looking that up a lot
CREATE INDEX IF NOT EXISTS idx_projects_path_id
ON projects (path_id);

-- Create user_role enum type
CREATE TYPE user_role AS ENUM ('admin', 'user', 'officer');

-- Create users table
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"role" user_role DEFAULT 'user',
	"public_user_id" uuid NOT NULL UNIQUE DEFAULT gen_random_uuid(),
	"first_name" varchar NOT NULL,
	"last_name" varchar NOT NULL,
	-- indexed
	"username" varchar NOT NULL UNIQUE,
	-- indexed
	"email" varchar NOT NULL UNIQUE,
	"phone" varchar UNIQUE,
	"member_number" varchar UNIQUE,
	"hashed_salted_password" bytea NOT NULL,
	"salt" bytea NOT NULL,
	"password_updated_at" timestamptz NOT NULL DEFAULT NOW(),
	"verification_code" varchar(6) NOT NULL CHECK (length(verification_code) = 6),
	"is_verified" timestamptz,
	"photo_url" varchar,
	"bio" varchar,
	"created_at" timestamptz NOT NULL DEFAULT NOW(),
	"updated_at" timestamptz NOT NULL DEFAULT NOW()
);

-- Index users by username, because we'll be looking that up a lot
CREATE INDEX IF NOT EXISTS idx_users_user_name
ON users (username);

-- Index users by email, because we'll be looking that up a lot
CREATE INDEX IF NOT EXISTS idx_users_email
ON users (email);

CREATE TABLE IF NOT EXISTS "users_clubs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
	"club_id" uuid NOT NULL REFERENCES "clubs"("id") ON DELETE CASCADE,
	"created_at" timestamptz NOT NULL DEFAULT NOW(),
	"updated_at" timestamptz NOT NULL DEFAULT NOW()
);

-- Create speeches table
CREATE TABLE IF NOT EXISTS "speeches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	-- indexed
	"user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
	"project_id" uuid REFERENCES "projects"("id") ON DELETE SET NULL,
	"title" varchar NOT NULL,
	"Intro" varchar NOT NULL,
	"delivery_date" date NOT NULL,
	"created_at" timestamptz NOT NULL DEFAULT NOW(),
	"updated_at" timestamptz NOT NULL DEFAULT NOW()
);

-- Index speeches by user_id, because we'll be looking that up a lot
CREATE INDEX IF NOT EXISTS idx_speeches_user_id
ON speeches (user_id);

-- Create standard evaluations table
CREATE TABLE IF NOT EXISTS "evals_standard" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	-- indexed
	"evaluator_id" uuid REFERENCES "users"("id") ON DELETE CASCADE,
	"evaluator_name" varchar,
	-- indexed
	"speech_id" uuid NOT NULL REFERENCES "speeches"("id") ON DELETE CASCADE,
	"excelled" varchar,
	"opportunities" varchar,
	"challenge" varchar,
	"other" varchar,
	"clarity" int CHECK ("clarity" < 6),
	"vocal_variety" int CHECK ("vocal_variety" < 6),
	"eye_contact" int CHECK ("eye_contact" < 6),
	"gestures" int CHECK ("gestures" < 6),
	"audience_awareness" int CHECK ("audience_awareness" < 6),
	"comfort_level" int CHECK ("comfort_level" < 6),
	"interest" int CHECK ("interest" < 6),
	"speech_content" int CHECK ("interest" < 6),
	"created_at" timestamptz NOT NULL DEFAULT NOW(),
	"updated_at" timestamptz NOT NULL DEFAULT NOW(),
	-- Require Either evaluator_id or evaluator_name
	constraint "chk_evaluator" check (("evaluator_id" is not null) or ("evaluator_name" is not null))
);

-- Index standard evaluations by evaluator_id, because we'll be looking that up a lot
CREATE INDEX IF NOT EXISTS idx_evals_standard_evaluator_id
ON evals_standard (evaluator_id);

-- Index standard evaluations by speech_id, because we'll be looking that up a lot
CREATE INDEX IF NOT EXISTS idx_evals_standard_speech_id
ON evals_standard (speech_id);

-- Create simple evaluations table
CREATE TABLE IF NOT EXISTS "evals_simple" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	-- indexed
	"evaluator_id" uuid REFERENCES "users"("id") ON DELETE CASCADE,
	"evaluator_name" varchar,
	-- indexed
	"speech_id" uuid NOT NULL REFERENCES "speeches"("id") ON DELETE CASCADE,
	"seen" text,
	"heard" text,
	"other" text,
	"created_at" timestamptz NOT NULL DEFAULT NOW(),
	"updated_at" timestamptz NOT NULL DEFAULT NOW(),
	-- Require Either evaluator_id or evaluator_name
	constraint "chk_evaluator" check (("evaluator_id" is not null) or ("evaluator_name" is not null))
);

-- Index simple evaluations by evaluator_id, because we'll be looking that up a lot
CREATE INDEX IF NOT EXISTS idx_evals_simple_evaluator_id
ON evals_simple (evaluator_id);

-- Index simple evaluations by speech_id, because we'll be looking that up a lot
CREATE INDEX IF NOT EXISTS idx_evals_simple_speech_id
ON evals_simple (speech_id);

-- Create custom evaluations table
CREATE TABLE IF NOT EXISTS "evals_custom" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	-- indexed
	"evaluator_id" uuid REFERENCES "users"("id") ON DELETE CASCADE,
	"evaluator_name" varchar,
	-- indexed
	"speech_id" uuid NOT NULL REFERENCES "speeches"("id") ON DELETE CASCADE,
	"answer_1" text,
	"answer_2" text,
	"answer_3" text,
	"other" text,
	"created_at" timestamptz NOT NULL DEFAULT NOW(),
	"updated_at" timestamptz NOT NULL DEFAULT NOW(),
	-- Require Either evaluator_id or evaluator_name
	constraint "chk_evaluator" check (("evaluator_id" is not null) or ("evaluator_name" is not null))
);

-- Index custom evaluations by evaluator_id, because we'll be looking that up a lot
CREATE INDEX IF NOT EXISTS idx_evals_custom_evaluator_id
ON evals_custom (evaluator_id);

-- Index custom evaluations by speech_id, because we'll be looking that up a lot
CREATE INDEX IF NOT EXISTS idx_evals_custom_speech_id
ON evals_custom (speech_id);

-- Create users_paths table
CREATE TABLE IF NOT EXISTS "users_paths" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	-- indexed
	"user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
	"path_id" uuid NOT NULL REFERENCES "paths"("id") ON DELETE CASCADE
);

-- Index users_paths by user_id, because we'll be looking that up a lot
CREATE INDEX IF NOT EXISTS idx_users_paths_user_id
ON users_paths (user_id);

-- ==== CONSTRAINTS ================================================

ALTER TABLE "clubs"
ADD CONSTRAINT "fk_president"
FOREIGN KEY ("president")
REFERENCES "users"("id")
ON DELETE SET NULL;

ALTER TABLE "clubs"
ADD CONSTRAINT "fk_vp_education"
FOREIGN KEY ("vp_education")
REFERENCES "users"("id")
ON DELETE SET NULL;

ALTER TABLE "clubs"
ADD CONSTRAINT "fk_vp_membership"
FOREIGN KEY ("vp_membership")
REFERENCES "users"("id")
ON DELETE SET NULL;

ALTER TABLE "clubs"
ADD CONSTRAINT "fk_vp_pr"
FOREIGN KEY ("vp_pr")
REFERENCES "users"("id")
ON DELETE SET NULL;

ALTER TABLE "clubs"
ADD CONSTRAINT "fk_secretary"
FOREIGN KEY ("secretary")
REFERENCES "users"("id")
ON DELETE SET NULL;

ALTER TABLE "clubs"
ADD CONSTRAINT "fk_treasurer"
FOREIGN KEY ("treasurer")
REFERENCES "users"("id")
ON DELETE SET NULL;

ALTER TABLE "clubs"
ADD CONSTRAINT "fk_sergeant_at_arms"
FOREIGN KEY ("sergeant_at_arms")
REFERENCES "users"("id")
ON DELETE SET NULL;

ALTER TABLE "clubs"
ADD CONSTRAINT "fk_past_president"
FOREIGN KEY ("past_president")
REFERENCES "users"("id")
ON DELETE SET NULL;

-- ==== TEARDOWN ================================================

DROP TABLE "evals_standard";
DROP TABLE "evals_simple";
DROP TABLE "evals_custom";
DROP TABLE "speeches";
DROP TABLE "users_paths";
DROP TABLE "projects";
DROP TABLE "paths";
DROP TABLE "users_clubs";
DROP TABLE "clubs";
DROP TABLE "users";
DROP TYPE "user_role";
