"use client";

import CheckboxGroup from "@/components/Form/CheckboxGroup";
import { Pronoun } from "@/types/Pronoun";

export default function Pronouns({
  pronouns,
  selected,
  onChange,
}: {
  pronouns: Pronoun[][];
  selected: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  function getPronounByWord(word: string) {
    return pronouns
      .filter((pronoun) => pronoun[0].word === word)
      .map((p) => {
        return [p[0].word, p[1].word];
      })[0];
  }

  function displayCurrentPronouns() {
    if (selected.length === 0) return "-";

    if (selected.length === 1) return getPronounByWord(selected[0]).join("/");

    if (selected.length === 2)
      return selected.map((p) => getPronounByWord(p)[0]).join("/");

    return "any";
  }

  function displayPronouns() {
    return (
      <CheckboxGroup
        name="pronouns"
        onChange={onChange}
        selected={selected}
        labels={pronouns.map((p) => p[0].word)}
        values={pronouns.map((p) => p[0].word)}
      />
    );
  }

  return (
    <div>
      <h3>
        Pronouns <span className="text-error">*</span>
      </h3>
      {displayPronouns()}
      Current pronouns: {displayCurrentPronouns()}
      <input type="hidden" name="selectedPronouns" value={selected.join(",")} />
    </div>
  );
}
