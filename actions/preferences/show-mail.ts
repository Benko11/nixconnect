import { createClient } from "@/utils/supabase/server";
import { getValueForAuthUser } from "../preferences";

export async function setShowPublicMailForAuthUser(activate: boolean) {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  const userId = user.data.user?.id;
  if (userId == null) throw new Error("Unauthorized access");

  const { error } = await supabase.from("user_preferences").upsert({
    user_id: userId,
    preference_identifier: "show-mail",
    value: activate ? 1 : 0,
    updated_at: "now()",
  });
  if (error) throw new Error(error.message);
}
