import { createClient } from "@/utils/supabase/server";
import getPronounsForUser from "./pronouns";
import { getGenderByUser } from "./genders";
import { getAuthUserColourScheme } from "./colour-schemes";

export async function getUserById(id: string) {
  const supabase = await createClient();
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id,nickname,avatar_url")
    .eq("id", id)
    .maybeSingle();
  if (userError) throw new Error(userError.message);
  if (user == null) return null;

  let gender;
  try {
    gender = await getGenderByUser(id);
  } catch {}
  const pronouns = await getPronounsForUser(id);

  return {
    id: user.id,
    nickname: user.nickname,
    avatarUrl: user.avatar_url,
    pronouns,
    gender,
  };
}

export async function getAuthUser() {
  const supabase = await createClient();
  const auth = await supabase.auth.getUser();
  const user = auth.data.user;
  const colourScheme = await getAuthUserColourScheme();

  if (user == null) throw new Error("Empty user");

  return { ...(await getUserById(user.id)), preferences: { ...colourScheme } };
}

export async function getUserByNickname(nickname: string) {
  const supabase = await createClient();
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .ilike("nickname", nickname.toLowerCase())
    .maybeSingle();
  user.avatarUrl = user.avatar_url;
  user.avatar_url = undefined;

  const pronouns = await getPronounsForUser(user.id);
  const gender = await getGenderByUser(user.id);

  return { ...user, pronouns, gender };
}
