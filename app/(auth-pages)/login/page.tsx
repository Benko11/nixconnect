import { dismissRoute } from "@/utils/utils";
import GithubButton from "./github-button";
import NarrowLayout from "@/components/layouts/NarrowLayout";

export default async function Page() {
  await dismissRoute();

  return (
    <NarrowLayout>
      <h1 className="text-2xl pb-2">Log in</h1>

      <div className="bg-default-neutral p-4">
        <form>
          <div className="flex flex-col pb-4">
            <label htmlFor="nickname">Nickname</label>
            <input
              type="text"
              name="nickname"
              id="nickname"
              className="bg-default-light text-default-dark p-1 px-2 outline-none opacity-90 hover:opacity-100 focus:opacity-100"
              autoFocus
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
          <div className="flex">
            <button
              type="submit"
              className="text-default-dark bg-default-primary p-3 px-8 text-lg"
            >
              Log In
            </button>
            <GithubButton />
          </div>

          <input type="hidden" name="redirectTo" value={"callbackUrl"} />

          {/* <div>{errorMessage && <p>{errorMessage}</p>}</div> */}
        </form>
      </div>
    </NarrowLayout>
  );
}
