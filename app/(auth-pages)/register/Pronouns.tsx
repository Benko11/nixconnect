"use client";

import { useEffect, useState } from "react";

export default function Pronouns() {
  const [pronouns, setPronouns] = useState<string[][]>([]);
  const [selectedPronouns, setSelectedPronouns] = useState<string[]>([]);

  useEffect(() => {
    async function run() {
      const raw = await fetch("/api/pronouns");
      const data = await raw.json();
      setPronouns(data);
    }
    run();
  }, []);

  function displayCurrentPronouns() {
    if (selectedPronouns.length === 0) return "-";
    if (selectedPronouns.length === 1) {
      const correctPronouns = pronouns.filter((p) =>
        p.includes(selectedPronouns[0])
      );
      return correctPronouns.join();
    }
    if (selectedPronouns.length === 2)
      return selectedPronouns[0] + "/" + selectedPronouns[1];
    return "any";
  }

  function handlePronounsChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    if (event.target.checked) {
      setSelectedPronouns((prev) => [...prev, value]);
    } else {
      setSelectedPronouns((prev) =>
        prev.filter((pronoun) => pronoun !== value)
      );
    }
  }

  return (
    <div>
      <h3>
        Pronouns <span className="text-default-error">*</span>
      </h3>
      {pronouns.map((pronoun) => (
        <div className="flex gap-2 select-none" key={pronoun[0]}>
          <input
            type="checkbox"
            name="pronouns"
            value={`${pronoun[0]}`}
            id={`pronoun-${pronoun[0]}`}
            onChange={handlePronounsChange}
          />
          <label htmlFor={`pronoun-${pronoun[0]}`}>{pronoun[0]}</label>
        </div>
      ))}
      Current pronouns: {displayCurrentPronouns()}
      <input
        type="hidden"
        name="selectedPronouns"
        value={selectedPronouns.join(",")}
      />
    </div>
  );
}
