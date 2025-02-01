CREATE TABLE IF NOT EXISTS colour_schemes (
    id SMALLSERIAL NOT NULL,
    name VARCHAR UNIQUE NOT NULL,
    primary_colour VARCHAR NOT NULL,
    secondary_colour VARCHAR NOT NULL,
    accent_colour VARCHAR NOT NULL,
    error_colour VARCHAR NOT NULL,
    neutral_colour VARCHAR NOT NULL,
    light_colour VARCHAR NOT NULL,
    dark_colour VARCHAR NOT NULL,
    background_colour VARCHAR NOT NULL,

    CONSTRAINT "colour_schemes_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "ColourScheme_name_key" ON "colour_schemes"("name");

INSERT INTO colour_schemes(id,"name",primary_colour,secondary_colour,accent_colour,error_colour,neutral_colour,light_colour,dark_colour,background_colour) VALUES
(1, 'Default', 'hsl(220, 70%, 70%)', 'hsl(12, 80%, 27%)', 'hsl(300, 80%, 30%)', 'hsl(60, 100%, 50%)', 'hsl(0, 0%, 20%)', 'hsl(220, 5%, 90%)', 'hsl(220, 5%, 10%)', '#0B0C0E'),
(2, 'Synthwave', '#C724B1', '#642F6C', '#58A7AF', '#71DBD4', 'hsl(300, 5%, 20%)', '#F3E9F4', '#3A3A59', '#0B0C0E'),
(3, 'Alpine', '#75eef0', '#005E57', '#203F21', '#668EAB', '#22242a', '#ccfeff', '#2c352c', '#0B0C0E')
ON CONFLICT (id) DO NOTHING;