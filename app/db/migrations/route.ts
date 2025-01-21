import { db } from "@vercel/postgres";

const client = await db.connect();

export async function GET() {
  try {
    await deleteAll();
    await createGendersTable();
    await createPronounsTable();
    await createUsersTable();
    await createUserPronounsTable();
    await createPreferencesTable();
    await createUserPreferencesTable();
    await createColourSchemesTable();
    await createPostsTable();

    return Response.json({ message: "Database migrated successfully" });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}

async function createUsersTable() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      nickname VARCHAR NOT NULL UNIQUE,
      email VARCHAR NOT NULL UNIQUE,
      password TEXT NOT NULL,
      gender_id INTEGER REFERENCES genders(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      deleted_at TIMESTAMP
    );`;
}

async function createGendersTable() {
  await client.sql`CREATE TABLE IF NOT EXISTS genders (
      id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      name VARCHAR NOT NULL,
      description VARCHAR
    );`;
}

async function createPronounsTable() {
  await client.sql`CREATE TABLE IF NOT EXISTS pronouns (
          id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
          word VARCHAR NOT NULL,
          master_pronoun INTEGER REFERENCES pronouns(id) ON DELETE SET NULL
      );`;
}

async function createUserPronounsTable() {
  await client.sql`CREATE TABLE IF NOT EXISTS user_pronouns (
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      pronoun_id INTEGER REFERENCES pronouns(id) ON DELETE CASCADE,
      PRIMARY KEY (user_id, pronoun_id)
    )`;
}

async function createPreferencesTable() {
  await client.sql`CREATE TABLE IF NOT EXISTS preferences (
      id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      title VARCHAR NOT NULL,
      identifier VARCHAR UNIQUE NOT NULL,
      default_value BIGINT NOT NULL
    );`;
}

async function createUserPreferencesTable() {
  await client.sql`CREATE TABLE IF NOT EXISTS user_preferences (
      preference_id INTEGER REFERENCES preferences(id) NOT NULL, 
      user_id UUID REFERENCES users(id) NOT NULL,
      value BIGINT,
      PRIMARY KEY (preference_id, user_id)
    )`;
}

async function createColourSchemesTable() {
  await client.sql`CREATE TABLE IF NOT EXISTS colour_schemes (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR UNIQUE NOT NULL,
        primary_colour VARCHAR NOT NULL,
        secondary_colour VARCHAR NOT NULL,
        accent_colour VARCHAR NOT NULL,
        neutral_colour VARCHAR NOT NULL,
        error_colour VARCHAR NOT NULL,
        dark_colour VARCHAR NOT NULL,
        light_colour VARCHAR NOT NULL,
        background_colour VARCHAR NOT NULL
      );`;
}

async function createPostsTable() {
  await client.sql`CREATE TABLE IF NOT EXISTS posts (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          contents TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
          deleted_at TIMESTAMP
      );`;
}

async function deleteAll() {
  await client.sql`DROP TABLE IF EXISTS user_preferences, user_pronouns, genders, pronouns, users, preferences, colour_schemes, posts;`;
}
