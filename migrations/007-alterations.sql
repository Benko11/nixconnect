ALTER TABLE user_pronouns DROP CONSTRAINT IF EXISTS user_pronouns_pronoun_id_fkey;
ALTER TABLE user_pronouns
ADD CONSTRAINT user_pronouns_pronoun_id_fkey
FOREIGN KEY (pronoun_id)
REFERENCES pronouns(id)
ON DELETE CASCADE;

ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url VARCHAR NULL;
