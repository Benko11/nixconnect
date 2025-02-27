import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import DisableRightClick from "./disable-right-click";
import ToastMessageWrapper from "./ToastMessageWrapper";
import UserNavigation from "./UserNavigation";
import QueryClientWrapper from "./QueryClientWrapper";
import UserWrapper from "./UserWrapper";

export const metadata: Metadata = {
  title: "*NixConnect",
  description: "Be gay, love old computers, JOIN US!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-display bg-default-background text-default-light">
        <ToastMessageWrapper>
          <QueryClientWrapper>
            <UserWrapper>
              <DisableRightClick />
              <nav
                className="bg-default-primary fixed w-full text-default-dark flex "
                style={{ zIndex: 1000 }}
              >
                <Link href="/" className="p-1">
                  {metadata.title as string}
                </Link>
                <UserNavigation />
              </nav>
              <footer
                className="bg-default-accent fixed w-full bottom-0 flex"
                style={{ zIndex: 1000 }}
              >
                <div className="flex ml-auto gap-2">
                  <Link href="/help">
                    <div className="p-1">Help</div>
                  </Link>
                  <Link href="/about">
                    <div className="p-1">About</div>
                  </Link>
                </div>
              </footer>

              <main className="py-8">{children}</main>
            </UserWrapper>
          </QueryClientWrapper>
        </ToastMessageWrapper>
      </body>
    </html>
  );
}
