import { db } from "@vercel/postgres";

const client = await db.connect();

export interface Gender {
  id: number;
  name: string;
  description: string;
}

export async function GET() {
  try {
    const genders = await getGenders();

    return Response.json(genders);
  } catch (error) {
    return Response.json(error, { status: 500 });
  }
}

async function getGenders() {
  const data = await client.sql<
    Gender[]
  >`SELECT id,name,description FROM genders ORDER BY id ASC;`;

  return [...data.rows];
}
