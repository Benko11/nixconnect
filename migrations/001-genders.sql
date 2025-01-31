CREATE TABLE genders (
    id SMALLSERIAL NOT NULL,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,

    CONSTRAINT "Gender_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "gender_name_key" ON genders(name);

INSERT INTO genders(id, name, description) VALUES
(1, 'Male', 'Men or men-presenting individuals'),
(2, 'Female', 'Women or women-presenting individuals'),
(3, 'Non-binary', 'Being on the spectrum between male and female or being outside it');
