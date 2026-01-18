import { pronounsTable } from "@/db/schemas/pronouns";
import { db } from "@/db/db";
import { sql } from "drizzle-orm";

type NewPronoun = typeof pronounsTable.$inferInsert;

const data: NewPronoun[] = [
  {
    id: 1,
    word: "he",
    group: 0,
    order: 0,
  },
  {
    id: 2,
    word: "him",
    group: 0,
    order: 1,
  },
  {
    id: 3,
    word: "she",
    group: 1,
    order: 0,
  },
  {
    id: 4,
    word: "her",
    group: 1,
    order: 1,
  },
  {
    id: 5,
    word: "they",
    group: 2,
    order: 0,
  },
  {
    id: 6,
    word: "them",
    group: 2,
    order: 1,
  },
];

export async function seed() {
  try {
    await db
      .insert(pronounsTable)
      .values(data)
      .onConflictDoUpdate({
        target: pronounsTable.id,
        set: {
          word: sql`excluded.word`,
          group: sql`excluded.group`,
          order: sql`excluded.order`,
        },
      });
    console.log("Pronouns table seeded");
  } catch (err) {
    console.error("Could not seed pronouns table", err);
  }
}
