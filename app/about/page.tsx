import Breadcrumbs from "@/components/Breadcrumbs";
import NarrowLayout from "@/components/layouts/NarrowLayout";
import { convertMarkdown } from "@/utils/utils";
import fs from "fs/promises";

export default async function Page() {
  const path = process.cwd() + "/README.md";

  const x = await fs.readFile(path, "utf-8");
  return (
    <NarrowLayout>
      <div>
        <Breadcrumbs
          hierachy={[{ href: "/", title: "Home" }]}
          currentTitle="About"
        />
        Created by me (Benjamin),{" "}
        <a
          href="https://github.com/benko11"
          className="text-default-primary"
          target="_blank"
        >
          benko11
        </a>{" "}
        on GitHub
      </div>
      <div
        dangerouslySetInnerHTML={convertMarkdown(x)}
        className="markdown-block py-4"
      ></div>
    </NarrowLayout>
  );
}
