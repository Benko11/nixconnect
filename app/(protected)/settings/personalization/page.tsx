"use client";

import Breadcrumbs from "@/components/Breadcrumbs";
import RadioGroup from "@/components/Form/RadioGroup";
import NarrowLayout from "@/components/layouts/NarrowLayout";
import { usePreference } from "@/contexts/PreferencesContext";
import { useToastMessage } from "@/contexts/ToastMessageContext";
import { useAuthUser } from "@/contexts/UserContext";
import ColourScheme from "@/types/ColourScheme";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChangeEvent, useState } from "react";

export default function Page() {
  const toastMessage = useToastMessage();
  const {
    data: colourSchemes,
    error: colourSchemesError,
    isPending: colourSchemesPending,
  } = useQuery<ColourScheme[]>({
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
      refetchPrefs();
      toastMessage.show("Applied theme", 8000);
    },
    onError: () => {
      toastMessage.errorShow("Could not apply theme", 8000);
    },
  });

  const { refetchUser } = useAuthUser();
  const { colourScheme, refetchPrefs } = usePreference();
  const [selected, setSelected] = useState(colourScheme.current);

  const handleColourSchemeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const filteredColourSchemeId = +e.target.value;
    colourScheme.apply(filteredColourSchemeId);

    changeColourSchemeMutation.mutate(filteredColourSchemeId);
  };

  function renderColourSchemes() {
    if (colourSchemesPending) return <div>Loading...</div>;
    if (colourSchemes == null || colourSchemes.length < 1) return;

    return (
      <form>
        <div className="flex flex-col">
          <RadioGroup
            name="colour-scheme"
            keys={colourSchemes.map((c) => c.id)}
            labels={colourSchemes.map((c) => c.name)}
            descriptions={colourSchemes.map((c) => c.description)}
            visuals={colourSchemes.map((c) => (
              <div className="w-20 aspect-square grid grid-cols-2" key={1}>
                <div style={{ background: c.primaryColour }}></div>
                <div style={{ background: c.secondaryColour }}></div>
                <div style={{ background: c.accentColour }}></div>
                <div style={{ background: c.errorColour }}></div>
              </div>
            ))}
            selected={selected}
            onChange={handleColourSchemeChange}
          />
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
      <div className="bg-neutral p-4">
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
  return await fetch("/api/preferences/colour-schemes/redis").then((res) =>
    res.json()
  );
}

async function fetchColourScheme(id: number) {
  return await fetch(`/api/preferences/colour-schemes/${id}`, {
    method: "PATCH",
  });
}
