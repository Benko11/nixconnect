import { createClient } from "@/utils/supabase/server";
import getPronounsForUser from "./get-pronouns";
import { getGenderByUser } from "./get-gender";

export async function getUserById(id: string) {
  const supabase = await createClient();
  const { data: user, error: userError } = await supabase
    .from("users")
    .select()
    .eq("id", id)
    .maybeSingle();
  if (userError) throw new Error(userError.message);
  if (user == null) return { ...user };

  let gender;
  try {
    gender = await getGenderByUser(id);
  } catch {}
  const pronouns = await getPronounsForUser(id);

  return { ...user, pronouns, gender };
}

export async function getAuthUser() {
  const supabase = await createClient();
  const auth = await supabase.auth.getUser();
  const user = auth.data.user;
  if (user == null) throw new Error("Empty user");

  return getUserById(user.id);
}
