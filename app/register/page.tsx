"use client";

import { useEffect, useState } from "react";
import { Gender } from "../api/genders/route";

export default function Page() {
  const [genders, setGenders] = useState<Gender[]>([]);

  function displayGenders() {
    if (genders.length < 1) return;

    return genders.map(({ id, name, description }) => (
      <div key={id}>
        <label htmlFor={`gender-${id}`}>
          <input type="radio" name="gender" value={name} id={`gender-${id}`} />
          <div className="font-bold">{name}</div>
          <div className="text-sm">{description}</div>
        </label>
      </div>
    ));
  }

  useEffect(() => {
    async function run() {
      const raw = await fetch("/api/genders");
      const data = await raw.json();
      setGenders(data);
    }

    run();
  }, []);
  return (
    <div className="flex justify-center py-6">
      <div className="w-[990px] max-w-[95%]">
        <h2 className="text-2xl">
          <a href="#" className="text-default-primary">
            Home
          </a>{" "}
          / Create account
        </h2>
        <div className="bg-default-neutral p-4">{displayGenders()}</div>
      </div>
    </div>
  );
}
