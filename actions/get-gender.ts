import { createClient } from "@/utils/supabase/server";

export async function getGenderById(id: number) {
  const supabase = await createClient();
  const { data: gender } = await supabase
    .from("genders")
    .select("name")
    .eq("id", id)
    .maybeSingle();
  if (gender == null) return null;
  return gender.name;
}
