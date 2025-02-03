import Breadcrumbs from "@/components/Breadcrumbs";
import WideLayout from "@/components/layouts/WideLayout";
import { dismissRoute } from "@/utils/utils";
import { Suspense } from "react";
import Pronouns from "./Pronouns";
import Genders from "./Genders";
import NixInput from "@/components/NixInput";

export default async function Page() {
  await dismissRoute();

  const hierarchy = [{ href: "/login", title: "Home" }];
  return (
    <WideLayout>
      <Breadcrumbs hierachy={hierarchy} currentTitle="Create account" />
      <div className="bg-default-neutral p-4">
        <form>
          <div className="flex flex-col pb-4">
            <NixInput
              label="Nickname"
              placeholder="Your unique identifier on the platform"
            />
          </div>

          <div className="flex flex-col pb-4">
            <NixInput label="E-mail" type="email" />
          </div>

          <div className="grid grid-cols-2 pb-4 gap-x-4">
            <div className="flex flex-col">
              <NixInput label="Password" type="password" />
            </div>
            <div className="flex flex-col">
              <NixInput label="Password again" type="password" />
            </div>
          </div>

          <Suspense fallback={<div>Retrieving genders...</div>}>
            <Genders />
          </Suspense>

          <Pronouns />

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
