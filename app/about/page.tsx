import Breadcrumbs from "@/components/Breadcrumbs";
import NarrowLayout from "@/components/layouts/NarrowLayout";

export default async function Page() {
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

      <h3 className="text-xl">Features</h3>
      <div>Things that work:</div>
      <ul>
        <li>user authentication (GitHub only)</li>
        <li>signing out</li>
        <li>sending posts in pure plain text and with new line breaks</li>
        <li>single user login (no multiple users)</li>
      </ul>
      <div>
        Be careful, as currently there are no safeguards for sending user input,
        so be nice!
      </div>
    </NarrowLayout>
  );
}
