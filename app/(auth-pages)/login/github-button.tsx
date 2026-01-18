"use client";

import { FormEvent } from "react";

export default function GithubButton() {
  async function handleGithub(e: FormEvent) {
    e.preventDefault();
  }

  return (
    <button className="text-primary ml-auto p-3 px-8" onClick={handleGithub}>
      Use GitHub
    </button>
  );
}
