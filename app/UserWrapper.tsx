"use client";

import { UserProvider } from "@/contexts/UserContext";

export default function UserWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserProvider>{children}</UserProvider>;
}
