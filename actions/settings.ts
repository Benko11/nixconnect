import UserDataClient from "@/types/UserDataClient";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

export async function updateAuthUserInfo(data: UserDataClient) {
  const supabase = await createClient();
  const authUser = await supabase.auth.getUser();
  const id = authUser.data.user?.id;

  if (authUser == null || id == null) {
    throw new Error("Insufficent permissions to edit user data");
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

  const { error } = await supabase
    .from("users")
    .update({ email, avatar_url: avatarUrl })
    .eq("id", id);

  if (error) {
    throw new Error("Something went wrong with your request");
  }
}
