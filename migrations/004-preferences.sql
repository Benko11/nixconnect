CREATE TABLE IF NOT EXISTS preferences (
    title VARCHAR UNIQUE NOT NULL,
    identifier VARCHAR UNIQUE NOT NULL,
    defaultValue BIGINT NOT NULL,

    CONSTRAINT "preferences_pkey" PRIMARY KEY (identifier)
);
