import { gendersTable } from "@/db";
import { db } from "@/db/db";
import { eq } from "drizzle-orm";

export async function getAll() {
  return await db.select().from(gendersTable);
}

export async function getById(id: number) {
  const result = await db
    .select()
    .from(gendersTable)
    .where(eq(gendersTable.id, id))
    .limit(1);
  return result[0] ?? null;
}
