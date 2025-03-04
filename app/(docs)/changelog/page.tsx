import Breadcrumbs from "@/components/Breadcrumbs";
import NarrowLayout from "@/components/layouts/NarrowLayout";
import fs from "fs/promises";
import Markdown from "react-markdown";

export default async function Page() {
  const path = process.cwd() + "/CHANGELOG.md";

  const x = await fs.readFile(path, "utf-8");

  return (
    <NarrowLayout>
      <Breadcrumbs
        hierachy={[{ href: "/", title: "Home" }]}
        currentTitle="Changelog"
      />
      <Markdown className="markdown-block docs">{x}</Markdown>
    </NarrowLayout>
  );
}
