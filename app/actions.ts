"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Pronoun } from "@/types/Pronoun";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required"
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/register", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/register",
      "Thanks for signing up! Please check your email for a verification link."
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/login", error.message);
  }

  return redirect("/feed");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password."
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match"
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed"
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const getAllGenders = async () => {
  const supabase = await createClient();
  const { data: genders, error } = await supabase
    .from("genders")
    .select()
    .order("id");
  if (error) throw new Error("Gender error");
  return genders;
};

export async function confirmInformation(formData: FormData) {
  const supabase = await createClient();
  const { data: userObject } = await supabase.auth.getUser();
  const userId = userObject.user?.id;
  const { data: gender } = await supabase
    .from("genders")
    .select("id")
    .eq("name", formData.get("gender"))
    .single();
  if (gender == null) return;

  await supabase.from("users").insert({
    id: userId,
    nickname: formData.get("nickname"),
    gender_id: gender.id,
    avatar_url: userObject.user?.user_metadata.avatar_url,
  });

  const getPronounId = async (pronounWord: string) => {
    const { data, error } = await supabase
      .from("pronouns")
      .select("id")
      .eq("word", pronounWord)
      .single(); // Use .single() to get one record

    if (error) {
      console.error(`Error fetching pronoun ID for "${pronounWord}":`, error);
      return null;
    }

    return data?.id;
  };

  // Function to add a user-pronoun relationship
  const addUserPronoun = async (userId: string, pronounWord: string) => {
    // Step 1: Get the pronoun_id for the given pronoun word
    const pronounId = await getPronounId(pronounWord);

    if (!pronounId) {
      console.error(`Pronoun "${pronounWord}" not found.`);
      return null;
    }

    // Step 2: Upsert into the pivot table
    const { data, error } = await supabase
      .from("user_pronouns")
      .upsert([{ user_id: userId, pronoun_id: pronounId }], {
        onConflict: "user_id,pronoun_id", // Handle duplicates
      });

    if (error) {
      console.error("Error upserting user-pronoun relationship:", error);
      return null;
    }

    console.log("User-pronoun relationship upserted successfully:", data);
    return data;
  };

  const selectedPronouns = formData.get("selectedPronouns");
  if (selectedPronouns == null || userId == null) return;
  const insertPronouns = selectedPronouns.toString().split(",");
  insertPronouns.map((p) => addUserPronoun(userId, p));

  return redirect("/feed");
}

export async function makePost(formData: FormData) {
  const supabase = await createClient();
  const userId = (await supabase.auth.getUser()).data.user?.id;
  if (userId == null) return;

  await supabase.from("posts").insert({
    author_id: userId,
    content: formData.get("post"),
  });

  return redirect("/feed");
}

export async function createAccount(formData: FormData) {
  const nickname = formData.get("nickname")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const passwordAgain = formData.get("password_again")?.toString();
  const gender = formData.get("genders")?.toString();
  const selectedPronouns = formData.get("selectedPronouns")?.toString();

  if (nickname == null || nickname.trim() === "") {
    return encodedRedirect("error", "/register", "Nickname is required");
  }

  if (email == null || email.trim() === "") {
    return encodedRedirect("error", "/register", "Email is required");
  }

  // TODO: dynamic genders
  if (
    gender != null &&
    gender?.toLowerCase() !== "male" &&
    gender?.toLowerCase() !== "female" &&
    gender?.toLowerCase() !== "non-binary"
  ) {
    return encodedRedirect("error", "/register", "Invalid gender");
  }

  if (
    password == null ||
    password.trim() === "" ||
    passwordAgain == null ||
    passwordAgain.trim() === ""
  ) {
    return encodedRedirect("error", "/register", "Password is required");
  }

  if (selectedPronouns == null || selectedPronouns.length < 1)
    return encodedRedirect(
      "error",
      "/register",
      "We need to refer to you! Please select your pronouns"
    );

  console.log("totally adding the user...");
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
