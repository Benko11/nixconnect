import { createClient } from "@/utils/supabase/server";
import getPronounsForUser from "./get-pronouns";
import { getGenderByUser } from "./get-gender";

export async function getUserByNickname(nickname: string) {
  const supabase = await createClient();
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .ilike("nickname", nickname.toLowerCase())
    .maybeSingle();
  const pronouns = await getPronounsForUser(user.id);
  const gender = await getGenderByUser(user.id);

  return { ...user, pronouns, gender };
}
