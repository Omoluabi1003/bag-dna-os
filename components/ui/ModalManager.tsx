"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

type ModalEntry = { id: string; onClose: () => void; restoreTo?: HTMLElement | null };
type ModalManagerContextValue = {
  activeModalId: string | null;
  registerModal: (id: string, onClose: () => void, restoreTo?: HTMLElement | null) => void;
  closeModal: (id: string) => void;
};

const ModalManagerContext = createContext<ModalManagerContextValue | null>(null);

export function ModalManagerProvider({ children }: { children: React.ReactNode }) {
  const [stack, setStack] = useState<ModalEntry[]>([]);
  const previousOverflow = useRef<string>("");

  const registerModal = useCallback((id: string, onClose: () => void, restoreTo?: HTMLElement | null) => {
    setStack((current) => [...current.filter((entry) => entry.id !== id), { id, onClose, restoreTo }]);
  }, []);

  const closeModal = useCallback((id: string) => {
    setStack((current) => {
      const entry = current.find((item) => item.id === id);
      window.setTimeout(() => entry?.restoreTo?.focus(), 0);
      return current.filter((item) => item.id !== id);
    });
  }, []);

  useEffect(() => {
    if (stack.length === 1) {
      previousOverflow.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    if (stack.length === 0) {
      document.body.style.overflow = previousOverflow.current;
    }
    return () => {
      document.body.style.overflow = previousOverflow.current;
    };
  }, [stack.length]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const active = stack.at(-1);
      if (!active) return;
      active.onClose();
      closeModal(active.id);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeModal, stack]);

  return <ModalManagerContext.Provider value={{ activeModalId: stack.at(-1)?.id ?? null, registerModal, closeModal }}>{children}</ModalManagerContext.Provider>;
}

export function useModalManager() {
  const context = useContext(ModalManagerContext);
  if (!context) throw new Error("useModalManager must be used inside ModalManagerProvider");
  return context;
}
