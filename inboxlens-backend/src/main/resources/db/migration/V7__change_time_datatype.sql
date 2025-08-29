ALTER TABLE users
    DROP COLUMN preferred_time;

ALTER TABLE users
    ADD preferred_time VARCHAR(255);