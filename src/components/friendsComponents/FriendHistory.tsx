"use client";
import api from "@/apiClient/apiCaller";
import { useModalContext } from "@/contexts/ModalContext";
import { Transaction } from "@/types/api/transactionProps";
import { moneyMask } from "@/utils/MoneyMask";
import { AxiosResponse } from "axios";
import moment from "moment";
import { Trash, ArrowRight, ArrowClockwise } from "phosphor-react";
import { useEffect } from "react";
import { toast } from "react-toastify";

type friendHistoryProps = {
  transaction: Transaction;
};

export default function FriendHistory({ transaction }: friendHistoryProps) {
  const { setModalIsOpen, setModalContent } = useModalContext();
  const isValidProperties = transaction.isValid
    ? ""
    : "line-through text-[var(--primary-red)] opacity-70";

  useEffect(() => {
    setModalContent(
      <div>
        <h1 className="text-xl m-2 mb-6 font-bold">
          Tem certeza que deseja apagar a transação selecionada?{" "}
        </h1>
        <div className="flex justify-evenly">
          <button className="font-bold text-xl m-2 mb-6 text-[var(--primary-red)]">
            Não
          </button>
          <button className="font-bold text-xl m-2 mb-6 text-[var(--primary-green)]">
            Sim
          </button>
        </div>
      </div>,
    );
  }, []);

  const deleteModal = () => {
    setModalContent(
      <div>
        <h1 className="text-xl m-2 mb-6 font-bold">
          Tem certeza que deseja apagar a transação selecionada?{" "}
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
            onClick={() => {
              deleteTransaction();
            }}
            className="font-bold text-xl m-2 mb-6 text-[var(--primary-green)]"
          >
            Sim
          </button>
        </div>
      </div>,
    );

    setModalIsOpen(true);
  };

  const deleteTransaction = () => {
    api
      .post("transactions/delete/", { id: transaction.id })
      .then((response: AxiosResponse<{ message: string }>) => {
        if (response.status === 200) {
          toast.success(response.data.message);
        }
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          toast.error(error.response.data.message || "Erro desconhecido");
        } else {
          toast.error("Erro de conexão ou algo inesperado");
        }
        console.log(error.message);
      })
      .finally(() => {
        window.location.reload();
      });
  };

  const reactiveModal = () => {
    setModalContent(
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
            onClick={() => {
              reactiveTransaction();
            }}
            className="font-bold text-xl m-2 mb-6 text-[var(--primary-green)]"
          >
            Sim
          </button>
        </div>
      </div>,
    );

    setModalIsOpen(true);
  };

  const reactiveTransaction = () => {
    api
      .post("transactions/reactive/", { id: transaction.id })
      .then((response: AxiosResponse<{ message: string }>) => {
        if (response.status === 200) {
          toast.success(response.data.message);
        }
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          toast.error(error.response.data.message || "Erro desconhecido");
        } else {
          toast.error("Erro de conexão ou algo inesperado");
        }
        console.log(error.message);
      })
      .finally(() => {
        window.location.reload();
      });
  };

  return (
    <div className="w-[80%] gap-2 flex flex-col justify-center">
      <div
        className={`flex gap-12 text-lg text-center items-center justify-center ${isValidProperties}`}
      >
        <h1>{transaction.from}</h1>
        <ArrowRight size={30} weight="bold" />
        <h1>{transaction.to}</h1>
      </div>

      <div
        className={`flex text-lg text-center items-center justify-center ${isValidProperties}`}
      >
        <h1 className="font-bold mx-2">Descrição : </h1>
        <h1>{transaction.message}</h1>
      </div>
      <div
        className={`flex text-lg text-center items-center justify-center ${isValidProperties}`}
      >
        <h1 className="font-bold mx-2">Data :</h1>
        <h1>
          {moment(transaction.date, "DD-MM-YYYY/HH:mmA").format(
            "DD/MM/YY - HH:mm",
          )}
          h
        </h1>
      </div>
      <div
        className={`flex text-lg text-center items-center justify-center ${isValidProperties}`}
      >
        <h1 className="font-bold mx-2">Valor :</h1>
        <h1>{moneyMask(transaction.value)}</h1>
      </div>

      <div className="justify-end flex">
        {transaction.isValid ? (
          <Trash
            onClick={() => {
              deleteModal();
            }}
            size={22}
            weight="bold"
            className="text-[var(--primary-red)] cursor-pointer"
          />
        ) : (
          <ArrowClockwise
            onClick={() => {
              reactiveModal();
            }}
            size={22}
            weight="bold"
            className="cursor-pointer"
          />
        )}
      </div>
      <span className="my-5 mt-3 w-[100%] h-[0.1rem] bg-[var(--foreground)] inline-block opacity-40" />
    </div>
  );
}
