"use server";

import { dismissRoute } from "@/utils/utils";
import GithubButton from "./github-button";
import NarrowLayout from "@/components/layouts/NarrowLayout";
import Link from "next/link";
import NixInput from "@/components/NixInput";
import { signIn } from "@/actions/sign-in";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  await dismissRoute();

  const sp = await searchParams;
  return (
    <NarrowLayout>
      <h1 className="text-2xl pb-2">Log in</h1>

      <div className="bg-default-neutral p-4">
        {sp.error && <div className="text-default-error">{sp.error}</div>}
        <form action={signIn}>
          <div className="flex flex-col pb-4">
            <NixInput label="Nickname" autoFocus />
          </div>
          <div className="flex flex-col pb-4">
            <NixInput label="Password" type="password" />
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

          <input type="hidden" name="redirectTo" value={"callbackUrl"} />
        </form>
      </div>
    </NarrowLayout>
  );
}
