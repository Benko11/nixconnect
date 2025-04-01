"use client";

import Breadcrumbs from "@/components/Breadcrumbs";
import ColourScheme from "@/components/ColourScheme";
import NarrowLayout from "@/components/layouts/NarrowLayout";
import { usePreference } from "@/contexts/PreferencesContext";
import { useToastMessage } from "@/contexts/ToastMessageContext";
import { useAuthUser } from "@/contexts/UserContext";
import ColourSchemeType from "@/types/ColourScheme";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChangeEvent, useState } from "react";

export default function Page() {
  const toastMessage = useToastMessage();
  const {
    data: colourSchemes,
    error: colourSchemesError,
    isPending: colourSchemesPending,
  } = useQuery({
    queryKey: ["colour-schemes", "all"],
    queryFn: fetchColourSchemes,
  });

  const changeColourSchemeMutation = useMutation({
    mutationFn: fetchColourScheme,
    onMutate: (value) => {
      colourScheme.apply(+value);
      setSelected(+value);
    },
    onSuccess: () => {
      refetchUser();
      toastMessage.show("Applied theme", 8000);
    },
    onError: () => {
      toastMessage.errorShow("Could not apply theme", 8000);
    },
  });

  const { refetchUser } = useAuthUser();
  const { colourScheme } = usePreference();
  const [selected, setSelected] = useState(colourScheme.current);

  const handleColourSchemeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const filteredColourSchemeId = +e.target.value;
    colourScheme.apply(filteredColourSchemeId);

    changeColourSchemeMutation.mutate(filteredColourSchemeId);
  };

  function renderColourSchemes() {
    if (colourSchemesPending) return <div>Loading...</div>;
    if (colourSchemes.length < 1) return;

    return (
      <form>
        <div className="flex flex-col gap-2">
          {colourSchemes.map((colourScheme: ColourSchemeType) => {
            return (
              <div className="flex items-center gap-2" key={colourScheme.id}>
                <input
                  type="radio"
                  name="colour-scheme"
                  id={`colour-scheme-${colourScheme.id.toString()}`}
                  value={colourScheme.id.toString()}
                  onChange={handleColourSchemeChange}
                  checked={colourScheme.id === selected}
                />
                <label htmlFor={`colour-scheme-${colourScheme.id.toString()}`}>
                  <ColourScheme
                    colourScheme={colourScheme}
                    key={colourScheme.id}
                  />
                </label>
              </div>
            );
          })}
        </div>
      </form>
    );
  }

  return (
    <NarrowLayout>
      <Breadcrumbs
        hierachy={[
          { href: "/", title: "Home" },
          { href: "/settings", title: "Settings" },
        ]}
        currentTitle="Personalization"
      />

      <h3 className="text-xl mt-3 mb-1">Colour schemes</h3>
      <div className="bg-default-neutral p-4">
        {colourSchemesError ? (
          <div>Could not load colour schemes</div>
        ) : (
          renderColourSchemes()
        )}
      </div>
    </NarrowLayout>
  );
}

async function fetchColourSchemes() {
  return await fetch("/api/preferences/colour-schemes").then((res) =>
    res.json()
  );
}

async function fetchColourScheme(id: number) {
  return await fetch(`/api/preferences/colour-schemes/${id}`, {
    method: "PATCH",
  });
}
