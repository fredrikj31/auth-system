--- gender enum
CREATE TYPE gender AS ENUM (
  'MALE',
  'FEMALE',
  'PREFER_NOT_TO_SAY'
);

--- account table
CREATE TABLE IF NOT EXISTS account (
  user_id uuid NOT NULL,
  email varchar(255) NOT NULL,
  password varchar(255) NOT NULL,
  password_salt varchar(255) NOT NULL,
  is_two_factor_authentication_enabled boolean,
  created_at timestamp NOT NULL,
  updated_at timestamp,
  deleted_at timestamp
);

ALTER TABLE ONLY account ADD CONSTRAINT account_user_id_primary_key PRIMARY KEY (user_id);
ALTER TABLE ONLY account ADD CONSTRAINT account_email_unique_key UNIQUE (email);
---

--- profile table
CREATE TABLE IF NOT EXISTS profile (
  user_id uuid NOT NULL,
  username varchar(255) NOT NULL,
  first_name varchar(255) NOT NULL,
  last_name varchar(255) NOT NULL,
  birth_date varchar(255) NOT NULL,
  gender gender NOT NULL,
  created_at timestamp NOT NULL,
  updated_at timestamp,
  deleted_at timestamp
);

ALTER TABLE ONLY profile ADD CONSTRAINT profile_user_id_primary_key PRIMARY KEY (user_id);
ALTER TABLE ONLY profile ADD CONSTRAINT profile_username_unique_key UNIQUE (username);
ALTER TABLE ONLY profile ADD CONSTRAINT profile_user_id_references FOREIGN KEY(user_id) REFERENCES account(user_id);
---

--- refresh_token table
CREATE TABLE IF NOT EXISTS refresh_token (
  id uuid NOT NULL,
  user_id uuid NOT NULL,
  expires_at timestamp NOT NULL
);

ALTER TABLE ONLY refresh_token ADD CONSTRAINT refresh_token_id_primary_key PRIMARY KEY (id);
ALTER TABLE ONLY refresh_token ADD CONSTRAINT refresh_token_id_unique_key UNIQUE (id);
ALTER TABLE ONLY refresh_token ADD CONSTRAINT refresh_token_user_id_references FOREIGN KEY(user_id) REFERENCES account(user_id);
---