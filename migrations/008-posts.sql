CREATE TABLE IF NOT EXISTS post_pings(
    user_id UUID NOT NULL,
    post_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    PRIMARY KEY("user_id", "post_id")
);

ALTER TABLE post_pings ADD CONSTRAINT post_pings_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE post_pings ADD CONSTRAINT post_pings_post_id_fkey FOREIGN KEY (post_id) REFERENCES posts(id);

ALTER TABLE post_pings ADD COLUMN deleted_at TIMESTAMP NULL;