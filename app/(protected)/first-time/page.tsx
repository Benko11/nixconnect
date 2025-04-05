"use client";

import Pronouns from "@/app/(auth-pages)/register/Pronouns";
import Breadcrumbs from "@/components/Breadcrumbs";
import RadioGroup from "@/components/Form/RadioGroup";
import NarrowLayout from "@/components/layouts/NarrowLayout";
import NixInput from "@/components/NixInput";
import { ConfirmDataClient } from "@/types/ConfirmDataClient";
import { Gender } from "@/types/Gender";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function Page() {
  const [form, setForm] = useState<ConfirmDataClient>({
    nickname: "",
    pronouns: [],
    gender: 0,
  });

  const {
    data: genders,
    error: gendersError,
    isPending: gendersIsPending,
  } = useQuery<Gender[]>({
    queryKey: ["genders"],
    queryFn: fetchGenders,
  });

  const {
    data: pronouns,
    error: pronounsError,
    isPending: pronounsIsPending,
  } = useQuery({ queryKey: ["pronouns"], queryFn: fetchPronouns });

  const confirmMutation = useMutation({
    mutationFn: confirmInformation,
  });

  const hierarchy = [{ title: "Home", href: "/feed" }];

  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = +e.target.value;
    setForm({ ...form, gender: selected });
  };

  const handlePronounsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const pronouns = [...form.pronouns];
    if (e.target.checked) {
      pronouns.push(value);
      setForm({ ...form, pronouns });
    } else {
      const filtered = pronouns.filter((p) => p !== value);
      setForm({ ...form, pronouns: filtered });
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    confirmMutation.mutate(form);
  };

  return (
    <NarrowLayout>
      <Breadcrumbs hierachy={hierarchy} currentTitle="Gathering information" />

      <div className="bg-neutral p-4">
        <p>
          We are glad to have you on board! Before you continue using
          *NixConnect, we need just a couple more details about you.
        </p>

        <form className="pt-4" onSubmit={handleSubmit}>
          <div className="flex flex-col pb-4">
            <NixInput
              label="Nickname"
              stateValue={form.nickname}
              onChange={handleInput}
              placeholder="Your unique identifier on the platform"
            />
          </div>

          {gendersIsPending ? (
            <div> Loading genders...</div>
          ) : gendersError ? (
            <div className="text-error">Could not load genders</div>
          ) : (
            <div className="py-2 pb-4">
              <h3>Gender</h3>

              <RadioGroup
                name="gender"
                keys={genders.map((g) => g.id)}
                labels={genders.map((g) => g.name)}
                descriptions={genders.map((g) => g.description)}
                onChange={handleGenderChange}
                selected={
                  genders.map((g) => g.id).filter((v) => v === form.gender)[0]
                }
              />
            </div>
          )}

          {pronounsIsPending ? (
            <div>Loading pronouns...</div>
          ) : pronounsError ? (
            <div className="text-error">Could not load pronouns</div>
          ) : (
            <Pronouns
              pronouns={pronouns}
              selected={form.pronouns}
              onChange={handlePronounsChange}
            />
          )}

          <div className="pt-4">
            <button
              type="submit"
              className="text-dark bg-primary p-3 px-8 text-lg"
            >
              Confirm information
            </button>
          </div>
        </form>
      </div>
    </NarrowLayout>
  );
}

async function fetchGenders() {
  return await fetch("/api/genders").then((res) => res.json());
}

async function fetchPronouns() {
  return await fetch("/api/pronouns").then((res) => res.json());
}

async function confirmInformation(data: ConfirmDataClient) {
  if (data.gender === 0) data.gender = undefined;

  const res = await fetch("/api/auth/confirm-information", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
