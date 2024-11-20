-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  public_user_id uuid NOT NULL DEFAULT gen_random_uuid(),
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  user_name VARCHAR NOT NULL,
  -- indexed
  email VARCHAR NOT NULL unique,
  phone VARCHAR,
  hashed_salted_password bytea NOT NULL,
  salt bytea NOT NULL,
  password_updated_at timestamptz NOT NULL DEFAULT NOW(),
  photo_url VARCHAR unique,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

-- Index users by email, because we'll be looking that up a lot
CREATE INDEX IF NOT EXISTS idx_users_email
ON users (email);

-- Index users by user_name, because we'll be looking that up a lot
CREATE INDEX IF NOT EXISTS idx_users_user_name
ON users (user_name);
