"use client";

import Breadcrumbs from "@/components/Breadcrumbs";
import CheckboxGroup from "@/components/Form/CheckboxGroup";
import CheckboxSingle from "@/components/Form/CheckboxSingle";
import NarrowLayout from "@/components/layouts/NarrowLayout";
import { usePreference } from "@/contexts/PreferencesContext";
import { useToastMessage } from "@/contexts/ToastMessageContext";
import { useAuthUser } from "@/contexts/UserContext";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export default function Page() {
  const toastMessage = useToastMessage();
  const { showMail } = usePreference();
  const { refetchUser } = useAuthUser();

  const [showMailTick, setShowMailTick] = useState(
    showMail.current === 1 ? true : false
  );

  const showPublicMailMutation = useMutation({
    mutationFn: changePublicShowMail,
    onSuccess: () => {
      toastMessage.show("Successfully updated", 8000);
      refetchUser();
    },
  });

  const handlePublicShowMail = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.checked);
    setShowMailTick((prev) => !prev);
    showPublicMailMutation.mutate(e.target.checked);
  };

  const [selected, setSelected] = useState<string[]>([]);

  return (
    <NarrowLayout>
      <Breadcrumbs
        hierachy={[
          { title: "Home", href: "/" },
          { title: "Settings", href: "/settings" },
        ]}
        currentTitle="Privacy"
      />

      <div className="bg-default-neutral p-4">
        <form className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <CheckboxSingle
              label="Display mail in profile"
              isChecked={showMailTick}
              onChange={handlePublicShowMail}
            />
          </div>
        </form>
      </div>
    </NarrowLayout>
  );
}

async function changePublicShowMail(activate: boolean) {
  return await fetch("/api/preferences/spm", {
    method: "PATCH",
    body: JSON.stringify({ activate }),
  }).then((res) => res.json());
}
