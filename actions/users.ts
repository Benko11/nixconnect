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

export async function getRawAuthUser() {
  const supabase = await createClient();
  const authUser = await supabase.auth.getUser();
  if (authUser == null) throw new Error("Unauthorized access");

  const id = authUser.data.user?.id;
  if (id == null) throw new Error("Unauthorized access");

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (userError) throw new Error(userError.message);
  if (user == null) return null;

  const gender = await getGenderByUser(id);
  const pronouns = await getPronounsForUser(id);

  return {
    id: user.id,
    nickname: user.nickname,
    email: user.email,
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

  const userAdditionalData = await getRawAuthUser();

  const userObject = {
    id: user.id,
    nickname: userAdditionalData?.nickname,
    email: userAdditionalData?.email,
    gender: userAdditionalData?.gender,
    pronouns: userAdditionalData?.pronouns,
    avatarUrl: userAdditionalData?.avatarUrl,
    preferences: { ...colourScheme },
  };

  return userObject;
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
