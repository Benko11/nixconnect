"use client";

import { useEffect, useState } from "react";

interface Pronoun {
  id: number;
  word: string;
}

export default function Pronouns({ pronouns }: { pronouns: Pronoun[][] }) {
  const [selectedPronouns, setSelectedPronouns] = useState<number[]>([]);

  function getPronounById(id: number) {
    return pronouns
      .filter((pronoun) => pronoun[0].id === id)
      .map((p) => {
        return [p[0].word, p[1].word];
      })[0];
  }

  function displayCurrentPronouns() {
    if (selectedPronouns.length === 0) return "-";

    if (selectedPronouns.length === 1)
      return getPronounById(selectedPronouns[0]).join("/");

    if (selectedPronouns.length === 2)
      return selectedPronouns.map((p) => getPronounById(p)[0]).join("/");

    return "any";
  }

  function handlePronounsChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    if (event.target.checked) {
      setSelectedPronouns((prev) => [...prev, +value]);
    } else {
      setSelectedPronouns((prev) =>
        prev.filter((pronoun) => pronoun !== +value)
      );
    }
  }

  function displayPronouns() {
    return pronouns.map((pronoun) => {
      const p: Pronoun = pronoun[0];
      return (
        <div className="flex gap-2 select-none" key={p.id}>
          <input
            type="checkbox"
            name="pronouns"
            value={p.id}
            id={`pronoun-${p.id}`}
            onChange={handlePronounsChange}
          />
          <label htmlFor={`pronoun-${p.id}`}>{p.word}</label>
        </div>
      );
    });
  }

  return (
    <div>
      <h3>
        Pronouns <span className="text-default-error">*</span>
      </h3>
      {displayPronouns()}
      Current pronouns: {displayCurrentPronouns()}
      <input
        type="hidden"
        name="selectedPronouns"
        value={selectedPronouns.join(",")}
      />
    </div>
  );
}
