"use client";

import CheckboxGroup from "@/components/Form/CheckboxGroup";
import { Pronoun } from "@/types/Pronoun";

export default function Pronouns({
  pronouns,
  selected,
  onChange,
}: {
  pronouns: Pronoun[];
  selected: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  function getPronounByWord(word: string) {
    const currentGroup = pronouns.filter((p) => p.word === word)[0].group;
    const selectedPronouns = pronouns
      .filter((p) => p.group === currentGroup)
      .sort((a, b) => a.order - b.order);

    return selectedPronouns;
  }

  function displayCurrentPronouns() {
    if (selected.length === 0) return "-";
    if (selected.length === 1) {
      console.log(getPronounByWord(selected[0]).map((p) => p.word));

      return getPronounByWord(selected[0])
        .map((p) => p.word)
        .join("/");
    }
    if (selected.length === 2) return selected.join("/");

    return "any";
  }

  function displayPronouns() {
    const mainPronouns = pronouns
      .filter((p) => p.order === 0)
      .map((p) => p.word);
    return (
      <CheckboxGroup
        name="pronouns"
        onChange={onChange}
        selected={selected}
        labels={mainPronouns}
        values={mainPronouns}
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
