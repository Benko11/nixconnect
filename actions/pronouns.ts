import { Pronoun } from "@/types/Pronoun";
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

export const getAllPronouns = async () => {
  const supabase = await createClient();

  const { data: masterPronounsData, error: masterError } = await supabase
    .from("pronouns")
    .select("id, word")
    .is("master_pronoun_id", null)
    .order("id");

  if (masterError) {
    console.error("Error fetching master pronouns:", masterError);
    return [];
  }

  if (!masterPronounsData || masterPronounsData.length === 0) {
    return [];
  }

  const allPronouns: Pronoun[][] = await Promise.all(
    masterPronounsData.map(async (masterPronoun) => {
      const { data: subPronounsData, error: subError } = await supabase
        .from("pronouns")
        .select("id,word")
        .eq("master_pronoun_id", masterPronoun.id);

      if (subError) {
        console.error(
          `Error fetching sub-pronouns for master_pronoun_id ${masterPronoun.id}:`,
          subError
        );
        return [masterPronoun.word];
      }

      return [masterPronoun, ...subPronounsData];
    })
  );

  return allPronouns;
};
