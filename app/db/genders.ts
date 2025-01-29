import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAllGenders() {
  try {
    const genders = await prisma.gender.findMany({ orderBy: { id: "asc" } });
    if (genders == null) throw new Error("Something happened");

    return genders;
  } catch (err) {
    console.error("Gender error:", err);
  }
}
