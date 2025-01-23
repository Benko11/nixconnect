import { db } from "@vercel/postgres";

const client = await db.connect();

export async function GET() {
  try {
    await seedGenders();
    await seedColourSchemes();
    await seedPronouns();

    return Response.json({ message: "Data seeded successfully" });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}

async function seedGenders() {
  await client.sql`INSERT INTO genders(name, description) VALUES
    ('Male', 'Men or men-presenting individuals'),
    ('Female', 'Women or women-presenting individuals'),
    ('Non-binary', 'Being on the spectrum between male and female or being outside it');`;
}

async function seedColourSchemes() {
  await client.sql`INSERT INTO colour_schemes(name,primary_colour,secondary_colour,accent_colour,neutral_colour,error_colour,dark_colour,light_colour,background_colour) VALUES
  ('Default', 'hsl(220, 70%, 70%)', 'hsl(12, 80%, 27%)', 'hsl(300, 80%, 30%)', 'hsl(0, 0%, 20%)', 'hsl(60, 100%, 50%)', 'hsl(220, 5%, 10%)', 'hsl(220, 5%, 90%)', '#0B0C0E'),
  ('Synthwave', '#C724B1', '#642F6C', '#58A7AF', 'hsl(300, 5%, 20%)', '#71DBD4', '#3A3A59', '#F3E9F4', '#0b0c0e'),
  ('Alpine', '#75eef0', '#005E57', '#203F21', '#22242a', '#668EAB', '#2c352c', '#ccfeff', '#0b0c0e2')`;
}

async function seedPronouns() {
  await client.sql`INSERT INTO pronouns(word,master_pronoun) VALUES
  ('he', NULL),
  ('him', 1),
  ('she', NULL),
  ('her', 3),
  ('they', NULL),
  ('them', 5)`;
}
