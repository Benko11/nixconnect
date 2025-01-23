import { db } from "@vercel/postgres";
import { Gender } from "../types/gender";

const client = await db.connect();

export async function getAllGenders() {
  const data =
    await client.sql`SELECT id,name,description FROM genders ORDER BY id`;
  return [...data.rows] as Gender[];
}
