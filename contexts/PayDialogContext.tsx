"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Suspense,
} from "react";
import PayDialog from "@/components/pay-dialog";

type PayDialogContextType = {
  openPayDialog: () => void;
  closePayDialog: () => void;
};

const PayDialogContext = createContext<PayDialogContextType | undefined>(
  undefined
);

export function PayDialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openPayDialog = () => setIsOpen(true);
  const closePayDialog = () => setIsOpen(false);

  return (
    <PayDialogContext.Provider value={{ openPayDialog, closePayDialog }}>
      {children}
      <Suspense fallback={<div>Loading...</div>}>
        <PayDialog />
      </Suspense>
    </PayDialogContext.Provider>
  );
}

export function usePayDialog() {
  const context = useContext(PayDialogContext);
  if (context === undefined) {
    throw new Error("usePayDialog must be used within a PayDialogProvider");
  }
  return context;
}
