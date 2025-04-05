"use client";

import ColourScheme from "@/types/ColourScheme";
import { useQuery } from "@tanstack/react-query";
import { createContext, ReactNode, useContext, useEffect } from "react";

interface PreferencesContextType {
  refetchPrefs: () => Promise<void>;
  showMail: { current: number };
  colourScheme: {
    apply: (colourSchemeId: number) => void;
    current: number;
  };
}

const PreferencesContext = createContext<PreferencesContextType | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const { data: colourSchemes, error: errorColourSchemes } = useQuery({
    queryKey: ["preferences", "colour-scheme"],
    queryFn: fetchColourSchemes,
  });

  const {
    data: currentCS,
    error: errorCurrentCS,
    isPending: isPendingCurrentCS,
    refetch: refetchCS,
  } = useQuery({
    queryKey: ["preferences", "colour-scheme", "current"],
    queryFn: fetchCurrentColourScheme,
    enabled: colourSchemes?.length > 0,
  });

  const {
    data: currentSM,
    error: errorSM,
    refetch: refetchSM,
  } = useQuery({
    queryKey: ["preferences", "show-mail"],
    queryFn: fetchCurrentShowMail,
  });

  useEffect(() => {
    if (isPendingCurrentCS) return;

    applyColourScheme(currentCS.colourScheme);
  }, [currentCS]);

  async function refetchPrefs() {
    await refetchCS();
    await refetchSM();
  }

  if (isPendingCurrentCS) return null;

  if (errorColourSchemes || errorCurrentCS)
    return <div>Could not load colour schemes</div>;

  if (errorSM) return <div>Could not load show mail</div>;

  return (
    <PreferencesContext.Provider
      value={{
        refetchPrefs: refetchPrefs,
        showMail: {
          current: currentSM.showMail,
        },
        colourScheme: {
          apply: applyColourScheme,
          current: currentCS?.colourScheme,
        },
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );

  function applyColourScheme(colourSchemeId: number) {
    const colourScheme = (colourSchemes as ColourScheme[]).filter(
      (cs) => cs.id === colourSchemeId
    )[0];
    if (colourScheme == null) return;

    document.documentElement.style.setProperty(
      "--primary-colour",
      colourScheme.primaryColour
    );

    document.documentElement.style.setProperty(
      "--secondary-colour",
      colourScheme.secondaryColour
    );

    document.documentElement.style.setProperty(
      "--accent-colour",
      colourScheme.accentColour
    );

    document.documentElement.style.setProperty(
      "--error-colour",
      colourScheme.errorColour
    );

    document.documentElement.style.setProperty(
      "--neutral-colour",
      colourScheme.neutralColour
    );

    document.documentElement.style.setProperty(
      "--light-colour",
      colourScheme.lightColour
    );

    document.documentElement.style.setProperty(
      "--dark-colour",
      colourScheme.darkColour
    );
  }
}

export function usePreference() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreference must be used within a PreferencesProvider.");
  }

  return context;
}

async function fetchColourSchemes() {
  return await fetch("/api/preferences/colour-schemes/redis").then((res) =>
    res.json()
  );
}

async function fetchCurrentColourScheme() {
  return await fetch("/api/preferences/colour-scheme").then((res) =>
    res.json()
  );
}

async function fetchCurrentShowMail() {
  return await fetch("/api/preferences/show-mail").then((res) => res.json());
}
