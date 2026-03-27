import { db } from "@/db/db";
import { usersTable } from "@/db/schemas/users";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/auth";

export async function updateAuthUserInfo(data: { email: string; avatarUrl: string }) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!session || !userId) {
    throw new Error("Insufficient permissions to edit user data");
  }

  const formSchema = z.object({
    email: z
      .string()
      .trim()
      .email({ message: "Please use valid email address" }),
    avatarUrl: z.union([
      z.literal(""),
      z
        .string()
        .trim()
        .url({ message: "Please add a valid URL for the avatar" }),
    ]),
  });

  const result = formSchema.safeParse(data);
  if (!result.success) {
    const errors = result.error.format();
    return { errors };
  }

  const { email, avatarUrl } = data;

  await db
    .update(usersTable)
    .set({ email, avatarUrl })
    .where(eq(usersTable.id, userId));

  return { success: true };
}
