import Breadcrumbs from "@/components/Breadcrumbs";
import WideLayout from "@/components/layouts/WideLayout";
import { dismissRoute } from "@/utils/utils";
import Form from "./form";

export default async function Page() {
  await dismissRoute();

  const hierarchy = [{ href: "/login", title: "Home" }];
  return (
    <WideLayout>
      <Breadcrumbs hierachy={hierarchy} currentTitle="Create account" />
      <div className="bg-default-neutral p-4">
        <div className="pb-4">
          We are excited for you to try out *NixConnect! First, we need you to
          fill a couple of things about you, i.e. your preferred persona.
        </div>
        <Form />
      </div>
    </WideLayout>
  );
}
