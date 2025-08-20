ALTER TABLE users
    ADD email VARCHAR(255);

ALTER TABLE users
    DROP COLUMN refresh_token_expires_at;