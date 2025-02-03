import Genders from "@/app/(auth-pages)/register/Genders";
import Pronouns from "@/app/(auth-pages)/register/Pronouns";
import {
  confirmInformation,
  getAllGenders,
  getAllPronouns,
} from "@/app/actions";
import Breadcrumbs from "@/components/Breadcrumbs";
import NarrowLayout from "@/components/layouts/NarrowLayout";
import { protectRoute } from "@/utils/utils";
import { Suspense } from "react";

export default async function Page() {
  await protectRoute();

  const hierarchy = [{ title: "Home", href: "/feed" }];

  return (
    <NarrowLayout>
      <Breadcrumbs hierachy={hierarchy} currentTitle="Gathering information" />

      <div className="bg-default-neutral p-4">
        <p>
          We are glad to have you on board! Before you continue using
          *NixConnect, we need just a couple more details about you.
        </p>

        <form className="pt-4" action={confirmInformation}>
          <div className="flex flex-col pb-4">
            <label htmlFor="nickname">
              Nickname <span className="text-default-error">*</span>
            </label>
            <input
              type="text"
              name="nickname"
              id="nickname"
              placeholder="Your unique identifier on the platform"
              className="bg-default-light text-default-dark p-1 px-2 outline-none opacity-90 hover:opacity-100 focus:opacity-100"
            />
          </div>
          <Suspense
            fallback={<p>Something went wrong with displaying genders</p>}
          >
            {<Genders />}
          </Suspense>
          <Suspense
            fallback={<p>Something went wrong with displaying pronouns.</p>}
          >
            <Pronouns />
          </Suspense>

          <div className="pt-4">
            <button
              type="submit"
              className="text-default-dark bg-default-primary p-3 px-8 text-lg"
            >
              Confirm information
            </button>
          </div>
        </form>
      </div>
    </NarrowLayout>
  );
}
