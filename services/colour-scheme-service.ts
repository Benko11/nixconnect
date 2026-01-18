import { colourSchemeTable } from "@/db";
import { db } from "@/db/db";
import { eq } from "drizzle-orm";

export async function getAll() {
  return await db
    .select()
    .from(colourSchemeTable)
    .orderBy(colourSchemeTable.id);
}

export async function getById(id: number) {
  const result = await db
    .select()
    .from(colourSchemeTable)
    .where(eq(colourSchemeTable.id, id))
    .limit(1);
  return result[0] ?? null;
}

export async function getByAuthUser() {}

export async function setByAuthUser() {}
