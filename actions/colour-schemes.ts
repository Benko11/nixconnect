import { createClient } from "@/utils/supabase/server";
import { getDefaultValueForPreference } from "./preferences";

export async function getColourSchemes() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("colour_schemes")
    .select("*")
    .order("id");

  if (error) {
    throw new Error("Could not retrieve colour schemes");
  }

  const colourSchemes = data.map((item) => {
    return {
      id: item.id,
      name: item.name,
      primaryColour: item.primary_colour,
      secondaryColour: item.secondary_colour,
      accentColour: item.accent_colour,
      errorColour: item.error_colour,
      neutralColour: item.neutral_colour,
      darkColour: item.dark_colour,
      lightColour: item.light_colour,
      backgroundColour: item.background_colour,
    };
  });

  return colourSchemes;
}

export async function getColourSchemeById(id: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("colour_schemes")
    .select("*")
    .eq("id", +id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return {
    id: data.id,
    name: data.name,
    primaryColour: data.primary_colour,
    secondaryColour: data.secondary_colour,
    accentColour: data.accent_colour,
    errorColour: data.error_colour,
    neutralColour: data.neutral_colour,
    lightColour: data.light_colour,
    darkColour: data.dark_colour,
    backgroundColour: data.background_colour,
  };
}

export async function getAuthUserColourScheme() {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  if (user == null || user.data.user == null) {
    const { defaultvalue: defaultColourScheme } =
      await getDefaultValueForPreference("colour-scheme");

    return { colourScheme: defaultColourScheme };
  }

  const userId = user.data.user.id;

  const { data: colourSchemeMaybe, error } = await supabase
    .from("user_preferences")
    .select("value")
    .match({ user_id: userId, preference_identifier: "colour-scheme" })
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  let colourScheme;
  colourScheme = { colourScheme: colourSchemeMaybe?.value };
  if (colourSchemeMaybe == null) {
    const { data: colourSchemeDefinitely, error } = await supabase
      .from("preferences")
      .select("defaultvalue")
      .eq("identifier", "colour-scheme")
      .single();

    if (error) throw new Error(error.message);
    colourScheme = { colourScheme: colourSchemeDefinitely.defaultvalue };
  }

  return colourScheme;
}

export async function setColourSchemeForAuthUser(id: number) {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  const userId = user.data.user?.id;
  if (userId == null) throw new Error("Unauthorized access");

  const { error } = await supabase.from("user_preferences").upsert({
    user_id: userId,
    preference_identifier: "colour-scheme",
    value: id,
    updated_at: "now()",
  });
  if (error) throw new Error(error.message);
}
