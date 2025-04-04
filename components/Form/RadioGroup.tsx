import { ReactNode } from "react";

interface RadioGroupProps {
  name: string;
  keys: number[];
  labels: string[];
  descriptions: string[];
  visuals?: ReactNode[];
  selected: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function RadioGroup({
  name,
  keys,
  labels,
  visuals,
  descriptions,
  onChange,
  selected,
}: RadioGroupProps) {
  if (keys.length < 1) return;

  return keys.map((key, index) => (
    <label
      key={key}
      htmlFor={`${name}-${key.toString()}`}
      className="cursor-pointer"
    >
      <div className="flex items-center gap-4 relative">
        <div className="bg-default-dark p-4 py-10">
          <input
            type="radio"
            name={name}
            id={`${name}-${key.toString()}`}
            value={key.toString()}
            onChange={onChange}
            checked={key === selected}
            className="hidden"
          />
          <div className="flex items-center justify-center">
            <div
              className={`w-4 h-4 bg-transparent ${key === selected ? "bg-default-secondary" : "bg-default-light"}`}
            >
              <div
                className={`translate-x-1 translate-y-1 w-2 h-2 bg-transparent ${key === selected && "bg-default-light"}`}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="font-bold text-lg">{labels[index]}</div>
          <div className="text-sm">{descriptions[index]}</div>
        </div>

        {visuals && visuals.length > 0 && (
          <div className="ml-auto">{visuals[index]}</div>
        )}
      </div>
    </label>
  ));
}
