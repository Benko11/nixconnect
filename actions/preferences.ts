import { createClient } from "@/utils/supabase/server";

export async function getDefaultValueForPreference(identifier: string) {
  const supabase = await createClient();
  const { data: defaultValue, error } = await supabase
    .from("preferences")
    .select("defaultvalue")
    .eq("identifier", identifier)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return defaultValue.defaultvalue;
}

export async function getValueForAuthUser(identifier: string) {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  const authUser = user.data.user;
  if (authUser == null) {
    throw new Error("Not authorized");
  }

  const { data, error } = await supabase
    .from("user_preferences")
    .select("value")
    .match({ user_id: authUser.id, preference_identifier: identifier })
    .maybeSingle();
  if (error) throw new Error(error.message);

  if (data != null) return data.value;

  return await getDefaultValueForPreference(identifier);
}

export async function getValueForUser(identifier: string, userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_preferences")
    .select("value")
    .match({ user_id: userId, preference_identifier: identifier })
    .maybeSingle();
  if (error) throw new Error(error.message);

  if (data != null) return data.value;
  return await getDefaultValueForPreference(identifier);
}
