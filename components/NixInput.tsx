interface NixInputProps {
  label: string;
  id?: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
  autoFocus?: boolean;
  value?: string;
}

export default function NixInput({
  label,
  id,
  required = true,
  placeholder = "",
  type = "text",
  autoFocus = false,
  value = "",
}: NixInputProps) {
  const inputId =
    id == null
      ? label.toLowerCase().replaceAll(/ /g, "_").replaceAll(/-/g, "_")
      : id;

  return (
    <>
      <label htmlFor={inputId}>
        {label} {required && <span className="text-default-error">*</span>}
      </label>
      <input
        type={type}
        name={inputId}
        id={inputId}
        placeholder={placeholder}
        defaultValue={value}
        className="bg-default-light text-default-dark p-1 px-2 outline-none opacity-90 hover:opacity-100 focus:opacity-100"
        autoFocus={autoFocus}
      />
    </>
  );
}
