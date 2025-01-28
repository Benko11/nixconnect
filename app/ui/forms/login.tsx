"use client";

import { authenticate } from "@/app/db/users";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";

export default function Login() {
  const searchParamas = useSearchParams();
  const callbackUrl = searchParamas.get("callbackUrl") || "/feed";
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );

  return (
    <form action={formAction}>
      <div className="flex flex-col pb-4">
        <label htmlFor="nickname">Nickname</label>
        <input
          type="text"
          name="nickname"
          id="nickname"
          className="bg-default-light text-default-dark p-1 px-2 outline-none opacity-90 hover:opacity-100 focus:opacity-100"
        />
      </div>
      <div className="flex flex-col pb-4">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          className="bg-default-light text-default-dark p-1 px-2 outline-none opacity-90 hover:opacity-100 focus:opacity-100"
        />
      </div>
      <button
        type="submit"
        className="text-default-dark bg-default-primary p-3 px-8 text-lg"
        aria-disabled={isPending}
      >
        Log In
      </button>

      <input type="hidden" name="redirectTo" value={callbackUrl} />

      <div>{errorMessage && <p>{errorMessage}</p>}</div>
    </form>
  );
}
