interface CheckboxGroupProps {
  name: string;
  labels: string[];
  values: string[];
  selected: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CheckboxGroup({
  labels,
  values,
  name,
  onChange,
  selected,
}: CheckboxGroupProps) {
  return (
    <div>
      {labels.map((label, index) => {
        const isChecked = selected.includes(values[index]);
        return (
          <label key={label} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name={name}
              value={values[index]}
              id={`${name}-${values[index]}`}
              onChange={onChange}
              checked={isChecked}
              className="hidden"
            />
            {!isChecked && <div>[ ]</div>}
            {isChecked && (
              <div>
                [<span className="text-default-accent font-black">x</span>]
              </div>
            )}
            <div>{label}</div>
          </label>
        );
      })}
    </div>
  );
}
