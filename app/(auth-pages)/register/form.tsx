"use client";

import { useState } from "react";
import Pronouns from "./Pronouns";
import Genders from "./Genders";
import NixInput from "@/components/NixInput";
import RegisterClient from "@/types/RegisterClient";
import { useMutation, useQuery } from "@tanstack/react-query";

export default function Form() {
  const [form, setForm] = useState<RegisterClient>({
    nickname: "",
    email: "",
    password: "",
    passwordAgain: "",
    gender: 0,
    pronouns: [],
  });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({
    nickname: "",
    email: "",
    password: "",
    passwordAgain: "",
    gender: "",
    pronouns: "",
  });

  const {
    data: genders,
    error: gendersError,
    isPending: gendersIsPending,
  } = useQuery({
    queryKey: ["genders"],
    queryFn: fetchGenders,
  });
  const {
    data: pronouns,
    error: pronounsError,
    isPending: pronounsIsPending,
  } = useQuery({ queryKey: ["pronouns"], queryFn: fetchPronouns });

  const registerMutation = useMutation({
    mutationFn: createAccount,
    onSuccess: (data) => {
      setMessage(data.message);
      if (data.errors != null) {
        console.log(data.errors);
        setErrors({
          ...errors,
          nickname: data.errors.nickname?._errors[0],
          email: data.errors.email?._errors[0],
          password: data.errors?.password?._errors[0],
          passwordAgain: data.errors?.password_again?._errors[0],
          pronouns: data.errors?.pronouns?._errors[0],
        });
      }

      if (data.success) {
        setForm({
          nickname: "",
          email: "",
          password: "",
          passwordAgain: "",
          pronouns: [],
          gender: 0,
        });
      }
    },
    onError: (error) => {
      console.error(error);
      console.log("huge shit");
    },
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(form);
  };

  console.log(errors);

  return (
    <form onSubmit={handleSubmit}>
      {message && <div className="text-default-error pb-6">{message}</div>}
      <div className="flex flex-col pb-4">
        <NixInput
          label="Nickname"
          placeholder="Your unique identifier on the platform"
          stateValue={form.nickname}
          onChange={handleInput}
        />
        {errors.nickname && (
          <div className="text-default-error">{errors.nickname}</div>
        )}
      </div>

      <div className="flex flex-col pb-4">
        <NixInput
          label="Email"
          stateValue={form.email}
          onChange={handleInput}
        />
        {errors.email && (
          <div className="text-default-error">{errors.email}</div>
        )}
      </div>

      <div className="grid grid-cols-2 pb-4 gap-x-4">
        <div className="flex flex-col">
          <NixInput
            label="Password"
            type="password"
            stateValue={form.password}
            onChange={handleInput}
          />
          {errors.password && (
            <div className="text-default-error">{errors.password}</div>
          )}
          {errors.passwordAgain && (
            <div className="text-default-error">{errors.passwordAgain}</div>
          )}
        </div>
        <div className="flex flex-col">
          <NixInput
            label="Password again"
            type="password"
            id="passwordAgain"
            stateValue={form.passwordAgain}
            onChange={handleInput}
          />
        </div>
      </div>

      {gendersIsPending ? (
        <div> Loading genders...</div>
      ) : gendersError ? (
        <div className="text-default-error">Could not load genders</div>
      ) : (
        <Genders
          value={form.gender}
          genders={genders}
          onChange={handleGenderChange}
        />
      )}

      {pronounsIsPending ? (
        <div>Loading pronouns...</div>
      ) : pronounsError ? (
        <div className="text-default-error">Could not load pronouns</div>
      ) : (
        <Pronouns
          pronouns={pronouns}
          selected={form.pronouns}
          onChange={handlePronounsChange}
        />
      )}

      {errors?.pronouns && (
        <div className="text-default-error">{errors.pronouns}</div>
      )}

      <div className="pt-4">
        <button
          type="submit"
          className="text-default-dark bg-default-primary p-3 px-8 text-lg disabled:opacity-70"
          // disabled={pending}
        >
          Sign up
        </button>
      </div>
    </form>
  );
}

async function fetchGenders() {
  return await fetch("/api/genders").then((res) => res.json());
}

async function fetchPronouns() {
  return await fetch("/api/pronouns").then((res) => res.json());
}

async function createAccount(data: RegisterClient) {
  if (data.gender === 0) data.gender = undefined;

  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
