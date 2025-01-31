import NarrowLayout from "@/components/layouts/NarrowLayout";

export default async function Page() {
  return (
    <NarrowLayout>
      <div>
        <h1 className="text-3xl pb-2">About</h1>
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
    </NarrowLayout>
  );
}
