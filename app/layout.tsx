import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import DisableRightClick from "./disable-right-click";
import ToastMessageWrapper from "./ToastMessageWrapper";
import UserNavigation from "./UserNavigation";
import QueryClientWrapper from "./QueryClientWrapper";
import UserWrapper from "./UserWrapper";
import Footer from "./Footer";
import PreferencesWrapper from "./PreferencesWrapper";

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
      <body className="font-display bg-background text-light">
        <ToastMessageWrapper>
          <QueryClientWrapper>
            <UserWrapper>
              <PreferencesWrapper>
                <DisableRightClick />
                <nav
                  className="bg-primary fixed w-full text-dark flex"
                  style={{ zIndex: 1000 }}
                >
                  <Link href="/" className="p-1 nixconnect">
                    <h1>{metadata.title as string}</h1>
                  </Link>
                  <UserNavigation />
                </nav>
                <Footer />

                <main className="py-8 main-container">{children}</main>
              </PreferencesWrapper>
            </UserWrapper>
          </QueryClientWrapper>
        </ToastMessageWrapper>
      </body>
    </html>
  );
}
