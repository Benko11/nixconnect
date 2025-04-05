"use client";

import { createClient } from "@/utils/supabase/client";
import { FormEvent } from "react";

export default function GithubButton() {
  async function handleGithub(e: FormEvent) {
    e.preventDefault();

    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <button className="text-primary ml-auto p-3 px-8" onClick={handleGithub}>
      Use GitHub
    </button>
  );
}
