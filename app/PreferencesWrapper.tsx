import { PreferencesProvider } from "@/contexts/PreferencesContext";
import React from "react";

export default function PreferencesWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PreferencesProvider>{children}</PreferencesProvider>;
}
