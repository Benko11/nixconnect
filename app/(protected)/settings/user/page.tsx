"use client";

import Breadcrumbs from "@/components/Breadcrumbs";
import FormError from "@/components/FormError";
import NarrowLayout from "@/components/layouts/NarrowLayout";
import NixInput from "@/components/NixInput";
import PrimaryButton from "@/components/PrimaryButton";
import { useToastMessage } from "@/contexts/ToastMessageContext";
import { useAuthUser } from "@/contexts/UserContext";
import UserDataClient from "@/types/UserDataClient";
import isValidHttpUrl from "@/utils/isValidHttpUrl";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { FormEvent, useState } from "react";

export default function Page() {
  const toastMessage = useToastMessage();
  const { user, refetchUser } = useAuthUser();
  console.log(user);

  const [form, setForm] = useState<{ email: string; avatarUrl: string }>({
    email: user?.email || "",
    avatarUrl: user?.avatarUrl || "",
  });
  const [errors, setErrors] = useState({
    email: "",
    avatarUrl: "",
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const userDataMutation = useMutation({
    mutationFn: changeUserData,
    onSuccess: (data) => {
      console.log(data);
      if (data.errors) {
        setErrors({
          ...errors,
          email: data.errors.email?._errors[0],
          avatarUrl: data.errors.avatarUrl?._errors[0],
        });
        return;
      }

      refetchUser();
      toastMessage.show("User data updated", 8000);
    },
    onError: (err) => {
      console.error(err);
      toastMessage.errorShow("Could not update user data", 8000);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    userDataMutation.mutate(form);
  };

  if (user == null) return;

  return (
    <NarrowLayout>
      <Breadcrumbs
        hierachy={[
          { href: "/", title: "Home" },
          { href: "/settings", title: "Settings" },
        ]}
        currentTitle="User"
      />
      <div className="bg-default-neutral mt-4 p-4">
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <div>
            <NixInput
              id="email"
              label="E-mail"
              stateValue={form.email}
              onChange={handleInput}
            />
            <FormError message={errors.email} />
          </div>

          <div>
            <NixInput
              label="Avatar URL"
              id="avatarUrl"
              stateValue={form.avatarUrl}
              onChange={handleInput}
              required={false}
            />
            <FormError message={errors.avatarUrl} />
          </div>

          {isValidHttpUrl(form.avatarUrl) && (
            <Image
              width={192}
              height={192}
              alt={user.nickname}
              src={form.avatarUrl}
            />
          )}

          <div className="mt-4 flex flex-col">
            <PrimaryButton disabled={userDataMutation.isPending}>
              Change account information
            </PrimaryButton>
          </div>
        </form>
      </div>
    </NarrowLayout>
  );
}

async function changeUserData(body: UserDataClient) {
  return await fetch(`/api/auth/user`, {
    body: JSON.stringify(body),
    method: "PATCH",
  }).then((res) => res.json());
}
