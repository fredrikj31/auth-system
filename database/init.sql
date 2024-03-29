CREATE TABLE IF NOT EXISTS users (
  id varchar(255) NOT NULL UNIQUE PRIMARY KEY,
  username varchar(255) NOT NULL,
  password varchar(255) NOT NULL,
  salt varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  birth_date date NOT NULL
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id varchar(255) NOT NULL UNIQUE PRIMARY KEY,
  user_id varchar(255) REFERENCES users(id),
  expires_at timestamp NOT NULL
);