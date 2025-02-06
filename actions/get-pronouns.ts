import { createClient } from "@/utils/supabase/server";

export default async function getPronounsForUser(id: string) {
  const supabase = await createClient();

  const { data: pronounIds } = await supabase
    .from("user_pronouns")
    .select("pronoun_id")
    .eq("user_id", id);

  if (pronounIds == null) return [];

  const pronounIdArray = pronounIds.map((p) => p.pronoun_id);
  const { data: pronouns } = await supabase
    .from("pronouns")
    .select("word")
    .order("id", { ascending: true })
    .in("id", pronounIdArray);
  if (pronouns == null) return [];

  if (pronouns.length === 1) {
    const { data: subPronouns, error } = await supabase
      .from("pronouns")
      .select("word")
      .eq("master_pronoun_id", pronounIdArray[0]);
    if (error) {
      throw new Error("Pronoun single retrieval failed");
    }

    return [pronouns[0].word, ...subPronouns.map((p) => p.word)];
  }

  if (pronouns.length === 2) {
    return pronouns.map((p) => p.word);
  }

  return ["any"];
}
