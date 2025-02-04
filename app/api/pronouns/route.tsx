import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(await getAllPronouns());
}

export const getAllPronouns = async (): Promise<string[][]> => {
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

  const allPronouns: string[][] = await Promise.all(
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
