import { sql } from "drizzle-orm";
import { db } from "@/db/db";
import { colourSchemeTable } from "@/db/schemas/colour-schemes";

type NewColourScheme = typeof colourSchemeTable.$inferInsert;

const data: NewColourScheme[] = [
  {
    id: 1,
    name: "Default",
    description: "Standard colour identity for *NixConnect",
    primary: "hsl(220, 70%, 70%)",
    secondary: "hsl(12, 80%, 27%)",
    accent: "hsl(300, 80%, 30%)",
    error: "hsl(60, 100%, 50%)",
    neutral: "hsl(0, 0%, 20%)",
    foreground: "hsl(220, 5%, 90%)",
  },
  {
    id: 2,
    name: "Neon",
    description: "Experience the look of the 80s",
    primary: "#C724B1",
    secondary: "#642F6C",
    accent: "#58A7AF",
    error: "#CE1F2F",
    neutral: "hsl(220, 10%, 15%)",
    foreground: "#bfdff2",
  },
  {
    id: 3,
    name: "Alpine",
    description: "Set course for the high mountains",
    primary: "#668EAB",
    secondary: "#005E57",
    accent: "#203F21",
    error: "#68cfd1",
    neutral: "#22242a",
    foreground: "#f4e4d4",
  },
  {
    id: 4,
    name: "Tropical",
    description: "Rich look of tropical fruits and biomes",
    primary: "#F65275",
    secondary: "#4F3C7C",
    accent: "#b55908",
    error: "#E8E186",
    neutral: "#282524",
    foreground: "#c4edcb",
  },
];

export async function seed() {
  try {
    await db
      .insert(colourSchemeTable)
      .values(data)
      .onConflictDoUpdate({
        target: colourSchemeTable.id,
        set: {
          name: sql`excluded.name`,
          description: sql`excluded.description`,
          primary: sql`excluded.primary`,
          secondary: sql`excluded.secondary`,
          accent: sql`excluded.accent`,
          error: sql`excluded.error`,
          foreground: sql`excluded.foreground`,
          neutral: sql`excluded.neutral`,
        },
      });
    console.log("Colour schemes table seeded");
  } catch (err) {
    console.error("Could not seed colour schemes table", err);
  }
}
