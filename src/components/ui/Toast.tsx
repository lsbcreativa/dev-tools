"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = "success") => {
    const id = ++nextId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const icons = {
    success: <CheckCircle size={16} />,
    error: <XCircle size={16} />,
    info: <Info size={16} />,
  };

  const colors = {
    success: "border-[var(--success)] text-[var(--success)]",
    error: "border-[var(--destructive)] text-[var(--destructive)]",
    info: "border-[var(--primary)] text-[var(--primary)]",
  };

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-2.5 rounded-lg border bg-[var(--card)] px-4 py-3 text-sm shadow-lg animate-slide-up ${colors[t.type]}`}
          >
            {icons[t.type]}
            <span className="text-[var(--foreground)]">{t.message}</span>
            <button
              onClick={() => removeToast(t.id)}
              className="ml-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
