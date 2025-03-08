import Link from "next/link";

export default function Footer() {
  const version = process.env.NIXCONNECT_VERSION!;
  return (
    <footer
      className="bg-default-accent fixed w-full bottom-0 flex"
      style={{ zIndex: 1000 }}
    >
      <div className="flex mr-auto">
        <Link href="/changelog" className="p-1 bg-default-secondary">
          v{version}
        </Link>
      </div>
      <div className="flex ml-auto gap-2">
        <Link href="/help">
          <div className="p-1">Help</div>
        </Link>
        <Link href="/about">
          <div className="p-1">About</div>
        </Link>
      </div>
    </footer>
  );
}
