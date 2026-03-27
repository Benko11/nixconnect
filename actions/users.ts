import { db } from "@/db/db";
import { usersTable } from "@/db/schemas/users";
import { eq, ilike } from "drizzle-orm";
import { auth } from "@/auth";
import { getAuthUserColourScheme } from "./colour-schemes";

export async function getUserById(id: string) {
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, id),
    with: {
      gender: true,
      pronouns: {
        with: {
          pronoun: true,
        },
      },
    },
  });

  if (!user) return null;

  return {
    id: user.id,
    nickname: user.nickname,
    avatarUrl: (user as any).avatar_url, // Assuming standard naming check
    pronouns: user.pronouns.map(p => p.pronoun.word),
    gender: user.gender?.name,
  };
}

export async function getRawAuthUser() {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) throw new Error("Unauthorized access");

  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, id),
    with: {
      gender: true,
      pronouns: {
        with: {
          pronoun: true,
        },
      },
    },
  });

  if (!user) return null;

  return {
    id: user.id,
    nickname: user.nickname,
    email: user.email,
    avatarUrl: (user as any).avatar_url,
    pronouns: user.pronouns.map(p => p.pronoun.word),
    gender: user.gender?.name,
  };
}

export async function getAuthUser() {
  const session = await auth();
  const user = session?.user;
  if (!user) throw new Error("Empty user");

  const colourScheme = await getAuthUserColourScheme();
  const userAdditionalData = await getRawAuthUser();

  if (!userAdditionalData) return null;

  return {
    id: user.id,
    nickname: userAdditionalData.nickname,
    email: userAdditionalData.email,
    gender: userAdditionalData.gender,
    pronouns: userAdditionalData.pronouns,
    avatarUrl: userAdditionalData.avatarUrl,
    preferences: { ...colourScheme },
  };
}

export async function getUserByNickname(nickname: string) {
  const user = await db.query.usersTable.findFirst({
    where: ilike(usersTable.nickname, nickname.toLowerCase()),
    with: {
      gender: true,
      pronouns: {
        with: {
          pronoun: true,
        },
      },
    },
  });

  if (!user) return null;

  return {
    id: user.id,
    nickname: user.nickname,
    email: user.email,
    avatarUrl: (user as any).avatar_url,
    pronouns: user.pronouns.map(p => p.pronoun.word),
    gender: user.gender?.name,
  };
}
