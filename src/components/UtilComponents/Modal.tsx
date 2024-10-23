"use client";
import { useModalContext } from "@/contexts/ModalContext";
import { motion } from "framer-motion";
import { XCircle } from "phosphor-react";

export default function Modal() {
  const { modalIsOpen, modalContent, setModalIsOpen } = useModalContext();

  if (!modalIsOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-10 w-screen h-screen bg-[var(--background-opacity)] flex items-center justify-center text-center"
    >
      <div className="bg-[var(--background)] border-[var(--primary-yellow)] border-2 rounded-md w-fit max-w-[70%] h-fit max-h-[60%] flex flex-col items-center justify-center text-center">
        <div className="w-full flex justify-end">
          <XCircle
            onClick={() => {
              setModalIsOpen(false);
            }}
            size={20}
            className="m-2 text-[var(--primary-yellow)] cursor-pointer"
          />
        </div>
        {modalContent}
      </div>
    </motion.div>
  );
}
