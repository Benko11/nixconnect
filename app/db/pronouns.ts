import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAllPronouns() {
  try {
    const pronouns = await prisma.pronoun.findMany({
      select: {
        id: true,
        word: true,
        masterPronoun: { select: { word: true } },
      },
      orderBy: { id: "asc" },
    });

    const returnPronouns: string[][] = [];
    let addingPronouns: string[] = [];
    pronouns.map((pronoun) => {
      if (pronoun.masterPronoun == null) {
        if (addingPronouns.length > 0) {
          returnPronouns.push(addingPronouns);
          addingPronouns = [];
        }
      }
      addingPronouns.push(pronoun.word);
    });
    returnPronouns.push(addingPronouns);

    return returnPronouns;
  } catch (error) {
    console.error("Pronouns error", error);
    throw new Error("Something happened");
  }

  return [];
}
