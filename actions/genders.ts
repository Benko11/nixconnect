import { createClient } from "@/utils/supabase/server";

export async function getGenderById(id: number) {
  const supabase = await createClient();
  const { data: gender } = await supabase
    .from("genders")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (gender == null) return null;
  return gender;
}

export async function getGenderByUser(userId: string) {
  const supabase = await createClient();
  const { data: genderId, error: genderIdError } = await supabase
    .from("users")
    .select("gender_id")
    .eq("id", userId)
    .maybeSingle();

  if (genderIdError) throw new Error(genderIdError.message);
  if (genderId?.gender_id == null) throw new Error("Gender id is null");

  const { data: gender, error: genderError } = await supabase
    .from("genders")
    .select("*")
    .eq("id", genderId.gender_id)
    .maybeSingle();

  if (genderError) throw new Error(genderError.message);
  if (gender == null) throw new Error("Gender is null");

  return gender;
}

export async function getAllGenders() {
  const supabase = await createClient();
  const { data: genders, error } = await supabase
    .from("genders")
    .select()
    .order("id");
  if (error) throw new Error("Gender error");
  return genders;
}
