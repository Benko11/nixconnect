import { createClient } from "@/utils/supabase/server";

export async function getUserByNickname(nickname: string) {
  const supabase = await createClient();
  const { data: userDetails } = await supabase
    .from("users")
    .select("*")
    .eq("nickname", nickname.substring(1))
    .maybeSingle();
  return userDetails;
}
