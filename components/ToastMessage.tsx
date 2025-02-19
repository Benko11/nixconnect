"use client";

interface ToastMessageProps {
  message: string;
  onClick: () => void;
  variant: "success" | "error";
}

export default function ToastMessage({
  message,
  onClick,
  variant = "success",
}: ToastMessageProps) {
  const classes = ["p-4", "select-none", "max-w-80", "cursor-pointer"];
  if (variant === "success") classes.push("bg-default-dark");
  if (variant === "error")
    classes.push("bg-default-error", "text-default-dark");
  return (
    <div
      className={classes.join(" ")}
      style={{ boxShadow: "5px 5px var(--accent-colour)" }}
      onClick={onClick}
    >
      {message}
    </div>
  );
}
