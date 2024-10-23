"useClient";

import { useModalContext } from "@/contexts/ModalContext";
import ThreeDotsWave from "../LoadingButton/ThreeDotsWave";

type DeleteModalProps = {
  reactiveTransaction: () => void;
};

export default function ReactiveModal({
  reactiveTransaction,
}: DeleteModalProps) {
  const { setModalIsOpen, isAuxLoading } = useModalContext();

  return (
    <div>
      <h1 className="text-xl m-2 mb-6 font-bold">
        Tem certeza que deseja reativar a transação selecionada?{" "}
      </h1>
      <div className="flex justify-evenly">
        <button
          onClick={() => {
            setModalIsOpen(false);
          }}
          className="font-bold text-xl m-2 mb-6 text-[var(--primary-red)]"
        >
          Não
        </button>
        <button
          disabled={isAuxLoading}
          onClick={() => {
            reactiveTransaction();
          }}
          className="font-bold text-xl m-2 mb-6 text-[var(--primary-green)]"
        >
          {isAuxLoading ? (
            <ThreeDotsWave circleCss="bg-[var(--primary-green)]" />
          ) : (
            "Sim"
          )}
        </button>
      </div>
    </div>
  );
}
