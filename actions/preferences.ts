import { db } from "@/db/db";
import { preferencesTable } from "@/db/schemas/preferences";
import { userPreferenceTable } from "@/db/schemas/user-preference";
import { eq, and } from "drizzle-orm";
import { auth } from "@/auth";

export async function getDefaultValueForPreference(identifier: string) {
  const pref = await db.query.preferencesTable.findFirst({
    where: eq(preferencesTable.identifier, identifier),
    columns: {
      defaultValue: true,
    },
  });

  return pref?.defaultValue || null;
}

export async function getValueForAuthUser(identifier: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("Not authorized");
  }

  const userPref = await db.query.userPreferenceTable.findFirst({
    where: and(
      eq(userPreferenceTable.userId, userId),
      eq(userPreferenceTable.preferenceId, identifier) // Assuming identifier is used as ID or linked
    ),
  });

  if (userPref) return userPref.value;

  return await getDefaultValueForPreference(identifier);
}

export async function getValueForUser(identifier: string, userId: string) {
  const userPref = await db.query.userPreferenceTable.findFirst({
    where: and(
      eq(userPreferenceTable.userId, userId),
      eq(userPreferenceTable.preferenceId, identifier)
    ),
  });

  if (userPref) return userPref.value;

  return await getDefaultValueForPreference(identifier);
}
