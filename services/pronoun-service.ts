import { pronounsTable } from "@/db";
import { db } from "@/db/db";

export async function getAll() {
  return await db.select().from(pronounsTable);
}

export async function getAllForUser(userId: string) {}
