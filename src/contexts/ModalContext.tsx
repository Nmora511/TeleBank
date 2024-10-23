"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactElement,
  ReactNode,
} from "react";

type ModalContextType = {
  modalIsOpen: boolean;
  setModalIsOpen: (value: boolean) => void;
  modalContent: ReactElement;
  setModalContent: (value: ReactElement) => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalWrapper = ({ children }: { children: ReactNode }) => {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<ReactElement>(<></>);

  return (
    <ModalContext.Provider
      value={{ modalIsOpen, setModalIsOpen, modalContent, setModalContent }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModalContext must be used within a ModalWrapper");
  }
  return context;
}
