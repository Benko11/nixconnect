interface NixInputProps {
  label: string;
  id?: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
  autoFocus?: boolean;
  value?: string;
  stateValue?: string | null;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function NixInput({
  label,
  id,
  required = true,
  placeholder = "",
  type = "text",
  autoFocus = false,
  value = "",
  stateValue = null,
  onChange = () => {},
}: NixInputProps) {
  const inputId =
    id == null
      ? label.toLowerCase().replaceAll(/ /g, "_").replaceAll(/-/g, "_")
      : id;

  const renderInput = () => {
    if (stateValue == null) {
      return (
        <input
          type={type}
          name={inputId}
          id={inputId}
          placeholder={placeholder}
          defaultValue={value}
          className="bg-default-light text-default-dark p-1 px-2 outline-none opacity-90 hover:opacity-100 focus:opacity-100"
          autoFocus={autoFocus}
        />
      );
    }

    return (
      <input
        type={type}
        name={inputId}
        id={inputId}
        placeholder={placeholder}
        value={stateValue}
        onChange={onChange}
        className="bg-default-light text-default-dark p-1 px-2 outline-none opacity-90 hover:opacity-100 focus:opacity-100"
        autoFocus={autoFocus}
      />
    );
  };
  return (
    <>
      <label htmlFor={inputId}>
        {label} {required && <span className="text-default-error">*</span>}
      </label>
      {renderInput()}
    </>
  );
}
