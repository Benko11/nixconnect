import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string
) {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

export async function protectRoute() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user == null) {
    return redirect("/login");
  }
}

export async function dismissRoute() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user != null) {
    return redirect("/feed");
  }
}

export async function retrieveClient() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user == null) {
    return;
  }

  const { data: me, error } = await supabase
    .from("user_details")
    .select("*")
    .eq("id", user.id)
    ?.single();

  if (error) console.log(error);

  return me;
}

export async function requireBasicInfo() {
  const x = await retrieveClient();
  if (x == null || x.length < 1) {
    return redirect("/first-time");
  }
}
