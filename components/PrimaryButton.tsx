interface PrimaryButtonProps {
  disabled: boolean;
  children: React.ReactNode;
}

export default function PrimaryButton({
  disabled,
  children,
}: PrimaryButtonProps) {
  return (
    <button
      className="bg-default-primary text-default-background p-2 disabled:opacity-70"
      disabled={disabled}
    >
      {children}
    </button>
  );
}
