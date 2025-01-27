import type { Metadata } from "next";
import "./globals.css";

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
          <a href="#" className="p-1">
            *NixConnect
          </a>
          {signedIn ? (
            <div className="ml-auto bg-default-secondary text-default-light p-1">
              ~benko11
            </div>
          ) : (
            <div className="flex gap-2"></div>
          )}
        </nav>
        <footer className="bg-default-accent fixed w-full bottom-0 flex">
          <a href="#" className="ml-auto">
            <div className="p-1">About</div>
          </a>
        </footer>

        <main className="py-8">{children}</main>
      </body>
    </html>
  );
}
