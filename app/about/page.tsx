import Breadcrumbs from "@/components/Breadcrumbs";
import NarrowLayout from "@/components/layouts/NarrowLayout";
import fs from "fs/promises";
import { marked } from "marked";

export default async function Page() {
  const path = process.cwd() + "/README.md";

  function convertMarkdown() {
    const rawMarkup = marked.parse(x);
    return { __html: rawMarkup };
  }

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
        dangerouslySetInnerHTML={convertMarkdown()}
        className="markdown-block py-4"
      ></div>
    </NarrowLayout>
  );
}
