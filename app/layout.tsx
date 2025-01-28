import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "*NixConnect",
  description: "Be gay, love old computers, JOIN US!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const signedIn = false;
  return (
    <html lang="en">
      <body className="font-display bg-default-background text-default-light">
        <nav className="bg-default-primary fixed w-full text-default-dark flex">
          <Link href="/" className="p-1">
            *NixConnect
          </Link>
          {signedIn ? (
            <div className="ml-auto bg-default-secondary text-default-light p-1">
              ~benko11
            </div>
          ) : (
            <div className="flex gap-2 ml-auto items-center">
              <Link href="/login" className="p-1">
                Log in
              </Link>
              <Link href="/register" className="p-1">
                Sign up
              </Link>
            </div>
          )}
        </nav>
        <footer className="bg-default-accent fixed w-full bottom-0 flex">
          <Link href="#" className="ml-auto">
            <div className="p-1">About</div>
          </Link>
        </footer>

        <main className="py-8">{children}</main>
      </body>
    </html>
  );
}
