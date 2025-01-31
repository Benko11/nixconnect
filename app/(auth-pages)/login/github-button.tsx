"use client";

import { createClient } from "@/utils/supabase/client";

export default function GithubButton() {
  async function handleGithub(e: any) {
    e.preventDefault();

    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      options: { redirectTo: `https://nixconnect.vercel.app/auth/callback` },
      provider: "github",
    });
  }

  return (
    <button
      className="text-default-primary ml-auto p-3 px-8"
      onClick={handleGithub}
    >
      Use GitHub
    </button>
  );
}
