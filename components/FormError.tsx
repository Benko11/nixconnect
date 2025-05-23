interface FormErrorProps {
  message: string;
}

export default function FormError({ message }: FormErrorProps) {
  if (message == null || message?.trim() === "") return;

  return <div className="text-error">{message}</div>;
}
