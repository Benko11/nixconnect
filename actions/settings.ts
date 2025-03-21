import UserDataClient from "@/types/UserDataClient";
import { createClient } from "@/utils/supabase/server";

export async function updateAuthUserInfo(data: UserDataClient) {
  const supabase = await createClient();
  const authUser = await supabase.auth.getUser();
  const id = authUser.data.user?.id;

  if (authUser == null || id == null) {
    throw new Error("Insufficent permissions to edit user data");
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
