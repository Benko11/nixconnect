"use client";

import ColourScheme from "@/types/ColourScheme";
import { useQuery } from "@tanstack/react-query";
import { createContext, ReactNode, useContext, useEffect } from "react";

interface PreferencesContextType {
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
    data: current,
    error: errorCurrent,
    isPending: isPendingCurrent,
  } = useQuery({
    queryKey: ["preferences", "colour-scheme", "current"],
    queryFn: fetchCurrentColourScheme,
    enabled: colourSchemes?.length > 0,
  });

  useEffect(() => {
    if (isPendingCurrent) return;

    applyColourScheme(current.colourScheme);
  }, [current]);

  if (isPendingCurrent) return null;

  if (errorColourSchemes || errorCurrent)
    return <div>Could not load colour schemes</div>;

  return (
    <PreferencesContext.Provider
      value={{
        colourScheme: {
          apply: applyColourScheme,
          current: current?.colourScheme,
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
  return await fetch("/api/preferences/colour-schemes/").then((res) =>
    res.json()
  );
}

async function fetchCurrentColourScheme() {
  return await fetch("/api/preferences/colour-scheme").then((res) =>
    res.json()
  );
}
