import { db } from "@/db/db";
import { gendersTable } from "@/db/schemas/genders";
import { sql } from "drizzle-orm";

type NewGender = typeof gendersTable.$inferInsert;

const data: NewGender[] = [
  {
    id: 1,
    name: "Male",
    description: "Men or men-presenting individuals",
  },
  {
    id: 2,
    name: "Female",
    description: "Women or women-presenting individuals",
  },
  {
    id: 3,
    name: "Non-binary",
    description:
      "Being on the spectrum between male and female or being outside it",
  },
];

export async function seed() {
  try {
    await db
      .insert(gendersTable)
      .values(data)
      .onConflictDoUpdate({
        target: gendersTable.id,
        set: {
          name: sql`excluded.name`,
          description: sql`excluded.description`,
        },
      });
    console.log("Genders table seeded");
  } catch (err) {
    console.error("Could not seed genders table", err);
  }
}
