"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  onClose: () => void;
}

export default function ToastMessage({ message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return clearTimeout(timer);
  }, [onClose]);
  return (
    <div
      className="fixed bg-default-dark p-4 bottom-16 right-8 select-none max-w-80"
      style={{ boxShadow: "5px 5px var(--secondary-colour)" }}
    >
      {message}
    </div>
  );
}
