"use client";

import GithubButton from "./github-button";
import NarrowLayout from "@/components/layouts/NarrowLayout";
import Link from "next/link";
import NixInput from "@/components/NixInput";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuthUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";

async function fetchSignIn(data: { nickname: string; password: string }) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export default function Page() {
  const [form, setForm] = useState({ nickname: "", password: "" });
  const [error, setError] = useState("");
  const { refetchUser } = useAuthUser();
  const router = useRouter();
  const loginMutation = useMutation({
    mutationFn: fetchSignIn,
    onSuccess: (data) => {
      if (!data.success) setError(data.message);
      else {
        setError("");
        refetchUser();
        router.push("/feed");
      }
    },
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(form);
  };

  return (
    <NarrowLayout>
      <h1 className="text-2xl pb-2">Log in</h1>
      <div className="bg-default-neutral p-4">
        {error && <div className="text-default-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col pb-4">
            <NixInput
              label="Nickname"
              autoFocus
              stateValue={form.nickname}
              onChange={handleInput}
            />
          </div>
          <div className="flex flex-col pb-4">
            <NixInput
              label="Password"
              type="password"
              stateValue={form.password}
              onChange={handleInput}
            />
          </div>
          <div className="flex">
            <button
              type="submit"
              className="text-default-dark bg-default-primary p-3 px-8 text-lg"
            >
              Log In
            </button>
            <Link className="text-default-primary  p-3 px-8" href="/register">
              Create account
            </Link>
            <GithubButton />
          </div>

          <input type="hidden" name="redirectTo" value="callbackUrl" />
        </form>
      </div>
      <div className="pt-4 flex gap-2">
        <div>Don&apos;t feel like making an account yet?</div>
        <Link href="/feed" className="text-default-primary">
          Preview the conversations
        </Link>
      </div>
    </NarrowLayout>
  );
}
