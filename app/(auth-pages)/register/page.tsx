import { getAllGenders, getAllPronouns } from "@/app/actions";
import Breadcrumbs from "@/components/Breadcrumbs";
import WideLayout from "@/components/layouts/WideLayout";
import { dismissRoute } from "@/utils/utils";
import { Suspense } from "react";
import Pronouns from "./Pronouns";
import Genders from "./Genders";

export default async function Page() {
  await dismissRoute();
  const genders = await getAllGenders();
  const pronouns = await getAllPronouns();

  const hierarchy = [{ href: "/login", title: "Home" }];
  return (
    <WideLayout>
      <Breadcrumbs hierachy={hierarchy} currentTitle="Create account" />
      <div className="bg-default-neutral p-4">
        <form>
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

          <div className="flex flex-col pb-4">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              className="bg-default-light text-default-dark p-1 px-2 outline-none opacity-90 hover:opacity-100 focus:opacity-100"
            />
          </div>

          <div className="grid grid-cols-2 pb-4 gap-x-4">
            <div className="flex flex-col">
              <label htmlFor="password">
                Password <span className="text-default-error">*</span>
              </label>

              <input
                type="password"
                name="password"
                id="password"
                className="bg-default-light text-default-dark p-1 px-2 outline-none opacity-90 hover:opacity-100 focus:opacity-100"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="password_again">
                Password again <span className="text-default-error">*</span>
              </label>

              <input
                type="password"
                name="password_again"
                id="password_again"
                className="bg-default-light text-default-dark p-1 px-2 outline-none opacity-90 hover:opacity-100 focus:opacity-100"
              />
            </div>
          </div>

          <Suspense
            fallback={<p>Something went wrong with displaying genders</p>}
          >
            {<Genders genders={genders!} />}
          </Suspense>

          <Suspense
            fallback={<p>Something went wrong with displaying pronouns.</p>}
          >
            <Pronouns pronouns={pronouns} />
          </Suspense>

          <div className="pt-4">
            <button
              type="submit"
              className="text-default-dark bg-default-primary p-3 px-8 text-lg"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </WideLayout>
  );
}
