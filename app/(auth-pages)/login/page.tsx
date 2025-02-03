import { dismissRoute } from "@/utils/utils";
import GithubButton from "./github-button";
import NarrowLayout from "@/components/layouts/NarrowLayout";
import Link from "next/link";
import NixInput from "@/components/NixInput";

export default async function Page() {
  await dismissRoute();

  return (
    <NarrowLayout>
      <h1 className="text-2xl pb-2">Log in</h1>

      <div className="bg-default-neutral p-4">
        <form>
          <div className="flex flex-col pb-4">
            <NixInput label="Nickname" autoFocus />
          </div>
          <div className="flex flex-col pb-4">
            <NixInput label="Password" type="pasword" />
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
