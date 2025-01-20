import { db } from "@vercel/postgres";

const client = await db.connect();

export async function GET() {
  try {
    await seedGenders();
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}

async function seedGenders() {
  await client.sql`INSERT INTO genders()`;
}
