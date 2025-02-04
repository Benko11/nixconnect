CREATE TABLE IF NOT EXISTS public.users (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  email VARCHAR NOT NULL,
  nickname VARCHAR NOT NULL,
  gender_id INT NULL,

  CONSTRAINT "users_gender_id_fkey" FOREIGN KEY ("gender_id") REFERENCES genders("id") ON DELETE SET NULL,

  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS user_preferences (
    preference_id INT NOT NULL,
    user_id UUID NOT NULL,
    value BIGINT NOT NULL,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("preference_id","user_id"),
    CONSTRAINT "user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES auth.users("id") ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS user_pronouns (
    id BIGSERIAL NOT NULL,
    user_id UUID NOT NULL,
    pronoun_id INT NOT NULL,

    CONSTRAINT "user_pronouns_pkey" PRIMARY KEY ("user_id","pronoun_id"),
    CONSTRAINT "user_pronouns_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES auth.users("id") ON DELETE SET NULL
);

CREATE OR REPLACE FUNCTION prevent_last_pronoun_deletion()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM user_pronouns WHERE user_id = OLD.user_id) <= 1 THEN
    RAISE EXCEPTION 'Each user must have at least one pronoun.';
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_last_pronoun_deletion_trigger
BEFORE DELETE ON user_pronouns
FOR EACH ROW
EXECUTE FUNCTION prevent_last_pronoun_deletion();

CREATE OR REPLACE FUNCTION enforce_pronoun_insertion()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM user_pronouns WHERE user_id = NEW.id) THEN
    RAISE EXCEPTION 'Each user must have at least one pronoun.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_pronoun_insertion_trigger
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION enforce_pronoun_insertion();