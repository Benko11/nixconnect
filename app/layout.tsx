import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { signOutAction } from "./actions";
import { retrieveClient } from "@/utils/utils";
import DisableRightClick from "./disable-right-click";
import ToastMessageWrapper from "./ToastMessageWrapper";

export const metadata: Metadata = {
  title: "*NixConnect",
  description: "Be gay, love old computers, JOIN US!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const x = await supabase.auth.getUser();

  const signedIn = x.data.user != null;
  const userDetails = await retrieveClient();

  function renderUserActions() {
    if (signedIn) {
      if (userDetails?.nickname == null) {
        return (
          <form action={signOutAction} className="ml-auto">
            <button className="p-1">Log out</button>
          </form>
        );
      } else {
        return (
          <form action={signOutAction} className="ml-auto">
            <button className=" bg-default-secondary text-default-light p-1">
              ~{userDetails.nickname}
            </button>
          </form>
        );
      }
    }

    return (
      <div className="flex gap-2 ml-auto items-center">
        <Link href="/login" className="p-1">
          Log in
        </Link>
        <Link href="/register" className="p-1">
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <html lang="en">
      <body className="font-display bg-default-background text-default-light">
        <ToastMessageWrapper>
          <DisableRightClick />
          <nav
            className="bg-default-primary sticky w-full text-default-dark flex "
            style={{ zIndex: 1000 }}
          >
            <Link href="/" className="p-1">
              {metadata.title as string}
            </Link>
            {renderUserActions()}
          </nav>
          <footer
            className="bg-default-accent fixed w-full bottom-0 flex"
            style={{ zIndex: 1000 }}
          >
            <Link href="/about" className="ml-auto">
              <div className="p-1">About</div>
            </Link>
          </footer>

          <main className="py-8">{children}</main>
        </ToastMessageWrapper>
      </body>
    </html>
  );
}
