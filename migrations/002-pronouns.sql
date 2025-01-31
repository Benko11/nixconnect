CREATE TABLE pronouns (
    id SMALLSERIAL NOT NULL,
    word VARCHAR NOT NULL,
    master_pronoun_id INTEGER,

    CONSTRAINT "Pronoun_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Master_pronoun_id_key" FOREIGN KEY (master_pronoun_id) REFERENCES pronouns(id)
);

CREATE UNIQUE INDEX "pronouns_word_key" ON pronouns(word);

INSERT INTO pronouns(id,word,master_pronoun_id) VALUES
(1, 'he', NULL),
(2, 'him', 1),
(3, 'she', NULL),
(4, 'her', 3),
(5, 'they', NULL),
(6, 'them', 5);
