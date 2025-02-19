import ToastMessage from "@/components/ToastMessage";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

interface ToastMessageContextType {
  show: (
    message: string,
    duration: number,
    variant?: "success" | "error"
  ) => void;
  errorShow: (message: string, duration: number) => void;
}

const ToastMessageContext = createContext<ToastMessageContextType | null>(null);
export function ToastMessageProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<
    {
      id: string;
      timeoutId: NodeJS.Timeout | null;
      message: string;
      duration: number;
      variant: "success" | "error";
    }[]
  >([]);

  const show = useCallback(
    (
      message: string,
      duration: number = 8000,
      variant: "success" | "error" = "success"
    ) => {
      const id = Date.now().toString();
      const timeoutId = setTimeout(() => {
        setMessages((prev) => prev.slice(1));
      }, duration);

      setMessages((prev) => [
        ...prev,
        { id, timeoutId, message, duration, variant },
      ]);
    },
    []
  );

  const errorShow = useCallback(
    (message: string, duration: number = 8000) => {
      show(message, duration, "error");
    },
    [show]
  );

  function handleClick(id: string) {
    setMessages((prev) => {
      const toast = prev.find((t) => t.id);
      if (toast && toast.timeoutId) {
        clearTimeout(toast.timeoutId);
      }
      return prev.filter((t) => t.id !== id);
    });
  }

  return (
    <ToastMessageContext.Provider value={{ show, errorShow }}>
      {children}
      <div className="fixed flex flex-col gap-4 bottom-16 right-8">
        {messages.map(({ id, message, variant }, index) => (
          <ToastMessage
            key={index}
            message={message}
            variant={variant}
            onClick={() => handleClick(id)}
          />
        ))}
      </div>
    </ToastMessageContext.Provider>
  );
}

export function useToastMessage() {
  const context = useContext(ToastMessageContext);
  if (!context) {
    throw new Error(
      "useToastMessage must be used within a ToastMessageProvider"
    );
  }

  return context;
}
