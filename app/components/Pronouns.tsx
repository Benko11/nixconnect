"use client";

import { useState } from "react";

interface PronounsProps {
  pronouns: string[][];
}

export default function Pronouns({ pronouns }: PronounsProps) {
  const [selectedPronouns, setSelectedPronouns] = useState<string[]>([]);

  function displayCurrentPronouns() {
    if (selectedPronouns.length === 0) return "-";
    if (selectedPronouns.length === 1) {
      const correctPronouns = pronouns.filter((p) =>
        p.includes(selectedPronouns[0])
      );
      console.log(correctPronouns.join("/"));
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
