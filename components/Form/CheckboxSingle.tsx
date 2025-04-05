interface CheckboxSingleProps {
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isChecked: boolean;
}

export default function CheckboxSingle({
  label,
  onChange,
  isChecked,
}: CheckboxSingleProps) {
  return (
    <label key={label} className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        onChange={onChange}
        checked={isChecked}
        className="hidden"
      />
      {!isChecked && <div>[ ]</div>}
      {isChecked && (
        <div>
          [<span className="text-accent font-black">x</span>]
        </div>
      )}
      <div>{label}</div>
    </label>
  );
}
