import ToastMessage from "@/components/ToastMessage";
import { createContext, ReactNode, useContext, useState } from "react";

interface ToastMessageContextType {
  showToastMessage: (message: string) => void;
}

const ToastMessageContext = createContext<ToastMessageContextType | undefined>(
  undefined
);

export default function ToastMessageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);
  const [toastId, setToastId] = useState(0);

  const showToastMessage = (message: string) => {
    const id = toastId;
    setToastId((prev) => prev++);
    console.log(toastId);
    setToasts((prev) => [...prev, { id, message }]);
  };

  return (
    <ToastMessageContext.Provider value={{ showToastMessage }}>
      {children}
      <div>
        {toasts.map((toast) => (
          <ToastMessage
            key={toast.id}
            message={toast.message}
            onClose={() =>
              setToasts((prev) => prev.filter((t) => t.id !== toast.id))
            }
          />
        ))}
      </div>
    </ToastMessageContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastMessageContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastMessageProvider");
  }

  return context;
};
