"use client";

import { Suspense, useActionState, useEffect, useState } from "react";
import Pronouns from "./Pronouns";
import Genders from "./Genders";
import NixInput from "@/components/NixInput";
import { createAccount, State } from "@/lib/actions";

export default function Form() {
  const initialState: State = { message: null, errors: {}, formData: {} };
  const [state, formAction, pending] = useActionState<State, FormData>(
    createAccount,
    initialState
  );

  const [genders, setGenders] = useState([]);
  const [pronouns, setPronouns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gendersData, pronounsData] = await Promise.all([
          fetchGenders(),
          fetchPronouns(),
        ]);
        setGenders(gendersData);
        setPronouns(pronounsData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <form action={formAction}>
      {state.message && (
        <div className="text-default-error pb-6">{state.message}</div>
      )}
      <div className="flex flex-col pb-4">
        <NixInput
          label="Nickname"
          placeholder="Your unique identifier on the platform"
          value={state.formData?.nickname}
        />
        {state.errors?.nickname && (
          <div className="text-default-error">{state.errors.nickname}</div>
        )}
      </div>

      <div className="flex flex-col pb-4">
        <NixInput label="Email" value={state.formData?.email} />
        {state.errors?.email && (
          <div className="text-default-error">{state.errors.email}</div>
        )}
      </div>

      <div className="grid grid-cols-2 pb-4 gap-x-4">
        <div className="flex flex-col">
          <NixInput label="Password" type="password" />
          {state.errors?.password && (
            <div className="text-default-error">{state.errors.password}</div>
          )}
          {state.errors?.passwordAgain && (
            <div className="text-default-error">
              {state.errors.passwordAgain}
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <NixInput label="Password again" type="password" />
        </div>
      </div>

      <Suspense fallback={<div>Retrieving genders...</div>}>
        <Genders value={state.formData?.gender} genders={genders} />
      </Suspense>

      <Suspense fallback={<div>Retrieving pronouns...</div>}>
        <Pronouns pronouns={pronouns} />
      </Suspense>
      {state.errors?.pronouns && (
        <div className="text-default-error">{state.errors.pronouns}</div>
      )}

      <div className="pt-4">
        <button
          type="submit"
          className="text-default-dark bg-default-primary p-3 px-8 text-lg disabled:opacity-70"
          disabled={pending}
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
