"use client";

import { Gender } from "@/types/Gender";

export default function Genders({
  value,
  genders,
  onChange,
}: {
  value?: number;
  genders: Gender[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  if (genders == null || genders.length < 1)
    return <div>No genders found.</div>;

  return (
    <div className="py-2 pb-4">
      <h3>Gender</h3>
      {genders.map(({ id, name, description }) => (
        <div key={id}>
          <label htmlFor={`gender-${id}`}>
            <div className="flex items-center gap-4">
              <div className="bg-default-dark p-4 py-6">
                <input
                  type="radio"
                  name="gender"
                  value={id}
                  id={`gender-${id}`}
                  onChange={onChange}
                  checked={value === id}
                />
              </div>
              <div>
                <div className="font-bold">{name}</div>
                <div className="text-sm">{description}</div>
              </div>
            </div>
          </label>
        </div>
      ))}
    </div>
  );
}
