CREATE TABLE user_details (
    id UUID NOT NULL,
    nickname VARCHAR UNIQUE NOT NULL,
    gender_id INT NULL,

    CONSTRAINT "user_details_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "user_details_gender_id_fkey" FOREIGN KEY ("gender_id") REFERENCES genders("id") ON DELETE SET NULL
);

CREATE TABLE user_preferences (
    preference_id INT NOT NULL,
    user_id UUID NOT NULL,
    value BIGINT NOT NULL,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("preference_id","user_id"),
    CONSTRAINT "user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES auth.users("id") ON DELETE SET NULL
);

CREATE TABLE user_pronouns (
    id SERIAL NOT NULL,
    user_id UUID NOT NULL,
    pronoun_id INT NOT NULL,

    CONSTRAINT "user_pronouns_pkey" PRIMARY KEY ("user_id","pronoun_id"),
    CONSTRAINT "user_pronouns_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES auth.users("id") ON DELETE SET NULL
);