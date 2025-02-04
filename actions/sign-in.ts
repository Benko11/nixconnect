"use server";

import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { redirect } from "next/navigation";

export async function signIn(formData: FormData) {
  const nickname = formData.get("nickname")?.toString();
  const password = formData.get("password")?.toString();
  if (nickname == null || password == null)
    return encodedRedirect(
      "error",
      "/login",
      "This set of credentials does not match our records."
    );

  const supabase = await createClient();
  const { data: email } = await supabase
    .from("users")
    .select("email")
    .eq("nickname", nickname)
    .maybeSingle();
  console.log(email);
  if (email == null)
    return encodedRedirect(
      "error",
      "/login",
      "This set of credentials does not match our records."
    );

  const { error } = await supabase.auth.signInWithPassword({
    email: email.email,
    password,
  });

  if (error) {
    console.error(error);
    const message = error.message.includes("confirm")
      ? "Please check your inbox to verify your email"
      : "This set of credentials does not match our records";
    return encodedRedirect("error", "/login", message);
  }

  return redirect("/feed");
}
