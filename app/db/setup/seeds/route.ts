import { createClient } from "@vercel/postgres";
import { PrismaClient } from "@prisma/client";

const client = createClient();
await client.connect();

const prisma = new PrismaClient();

export async function GET() {
  try {
    await seedGenders();
    await seedColourSchemes();
    await seedPronouns();

    return Response.json({ message: "Data seeded successfully" });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

async function seedGenders() {
  const newGenders = await prisma.gender.createMany({
    data: [
      {
        name: "Male",
        description: "Men or men-presenting individuals",
      },
      {
        name: "Female",
        description: "Women or women-presenting individuals",
      },
      {
        name: "Non-binary",
        description:
          "Being on the spectrum between male and female or being outside it",
      },
    ],
    skipDuplicates: true,
  });

  console.log(newGenders);
}

async function seedColourSchemes() {
  const newColourSchemes = await prisma.colourScheme.createMany({
    data: [
      {
        name: "Default",
        primaryColour: "hsl(220, 70%, 70%)",
        secondaryColour: "hsl(12, 80%, 27%)",
        accentColour: "hsl(300, 80%, 30%)",
        errorColour: "hsl(60, 100%, 50%)",
        neutralColour: "hsl(0, 0%, 20%)",
        lightColour: "hsl(220, 5%, 90%)",
        darkColour: "hsl(220, 5%, 10%)",
        backgroundColour: "#0B0C0E",
      },
      {
        name: "Synthwave",
        primaryColour: "#C724B1",
        secondaryColour: "#642F6C",
        accentColour: "#58A7AF",
        errorColour: "#71DBD4",
        neutralColour: "hsl(300, 5%, 20%)",
        lightColour: "#F3E9F4",
        darkColour: "#3A3A59",
        backgroundColour: "#0B0C0E",
      },
      {
        name: "Alpine",
        primaryColour: "#75eef0",
        secondaryColour: "#005E57",
        accentColour: "#203F21",
        errorColour: "#668EAB",
        neutralColour: "22242a",
        lightColour: "#ccfeff",
        darkColour: "#2c352c",
        backgroundColour: "#0B0C0E",
      },
    ],
    skipDuplicates: true,
  });

  console.log(newColourSchemes);
}

async function seedPronouns() {
  const newPronouns = await prisma.pronoun.createMany({
    data: [
      { word: "he" },
      { word: "him", masterPronounId: 1 },
      { word: "she" },
      { word: "her", masterPronounId: 3 },
      { word: "they" },
      { word: "them", masterPronounId: 5 },
    ],
    skipDuplicates: true,
  });
  console.log(newPronouns);
}
