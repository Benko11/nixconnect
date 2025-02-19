"use client";

import { ToastMessageProvider } from "@/contexts/ToastMessageContext";

export default function ToastMessageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ToastMessageProvider>{children}</ToastMessageProvider>;
}
