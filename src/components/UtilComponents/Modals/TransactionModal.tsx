"useClient";

import { useModalContext } from "@/contexts/ModalContext";
import ThreeDotsWave from "../LoadingButton/ThreeDotsWave";
import Input from "../Input";
import { useEffect, useState } from "react";
import moment from "moment";
import LoadingButton from "../LoadingButton/LoadingButton";
import { moneyMask, removeMoneyMask } from "@/utils/MoneyMask";
import api from "@/apiClient/apiCaller";
import { toast } from "react-toastify";

type TransactionModalProps = {
  myUserName: string;
  friendUserName: string;
};

export default function TransactionModal({
  myUserName,
  friendUserName,
}: TransactionModalProps) {
  const { setModalIsOpen } = useModalContext();
  const [date, setDate] = useState<string>(moment().format("YYYY-MM-DDThh:mm"));
  const [value, setValue] = useState<number>(0);
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [fromOptionList, setFromOptionList] = useState<React.ReactElement>(
    <option></option>,
  );
  const [toOptionList, setToOptionList] = useState<React.ReactElement>(
    <option></option>,
  );
  const [isLoadingButton, setIsLoadingButton] = useState<boolean>(false);

  const postTransaction = () => {
    setIsLoadingButton(true);

    if (from === to) {
      toast.error("Transação não pode ser realizada de e para o mesmo usuário");
      setIsLoadingButton(false);
      return;
    }

    api
      .post("/transaction", {
        from: from,
        to: to,
        value: value,
        message: message,
        date: moment(date).format("DD-MM-YYYY/hh:mma"),
      })
      .then((response) => {
        if (response.status === 201) {
          toast.success("Transação criada com sucesso");
          setModalIsOpen(false);
          window.location.reload();
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
        setIsLoadingButton(false);
      });
  };

  useEffect(() => {
    if (from === "" && to === "") {
      setFromOptionList(
        <>
          <option value="">Selecione</option>
          <option value={myUserName}>{myUserName}</option>
          <option value={friendUserName}>{friendUserName}</option>
        </>,
      );
      setToOptionList(
        <>
          <option value="">Selecione</option>
          <option value={myUserName}>{myUserName}</option>
          <option value={friendUserName}>{friendUserName}</option>
        </>,
      );
    } else if (from === "") {
      setToOptionList(
        <>
          <option value={myUserName}>{myUserName}</option>
          <option value={friendUserName}>{friendUserName}</option>
        </>,
      );
      if (to === friendUserName) {
        setFromOptionList(<option value={myUserName}>{myUserName}</option>);
        setFrom(myUserName);
      } else if (to === myUserName) {
        setFromOptionList(
          <option value={friendUserName}>{friendUserName}</option>,
        );
        setFrom(friendUserName);
      }
    } else if (to === "") {
      setFromOptionList(
        <>
          <option value={myUserName}>{myUserName}</option>
          <option value={friendUserName}>{friendUserName}</option>
        </>,
      );
      if (from === friendUserName) {
        setToOptionList(<option value={myUserName}>{myUserName}</option>);
        setTo(myUserName);
      } else if (from === myUserName) {
        setToOptionList(
          <option value={friendUserName}>{friendUserName}</option>,
        );
        setTo(friendUserName);
      }
    }
  }, [from, to, myUserName, friendUserName]);

  return (
    <div className="w-full ">
      <h1 className="text-2xl font-bold p-4 ">Adicionar Transação</h1>
      <div>
        <div className="flex justify-evenly text-center">
          <div className="my-4">
            <h1 className="font-bold">DE:</h1>
            <select
              defaultValue=""
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="text-center m-2 p-2 focus:bg-[var(--secondary-foreground)] outline-none border-[1px] rounded-lg border-[var(--foreground)] bg-[var(--background)]"
            >
              {fromOptionList}
            </select>
          </div>

          <div className="my-4">
            <h1 className="font-bold">PARA:</h1>
            <select
              defaultValue=""
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="text-center m-2 p-2 focus:bg-[var(--secondary-foreground)] outline-none border-[1px] rounded-lg border-[var(--foreground)] bg-[var(--background)]"
            >
              {toOptionList}
            </select>
          </div>
        </div>

        <div className="my-4 flex flex-col">
          <h1 className="font-bold">MENSAGEM:</h1>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            css="mx-6"
          />
        </div>

        <div className="flex justify-evenly max-w-full">
          <div className="my-4 text-center w-fit">
            <h1 className="font-bold">DATA:</h1>
            <Input
              value={date}
              onChange={(e) => setDate(e.target.value)}
              type="datetime-local"
              css="w-[7rem]"
            />
          </div>

          <div className="my-4 text-center w-fit">
            <h1 className="font-bold">VALOR:</h1>
            <Input
              value={moneyMask(value)}
              onChange={(e) => setValue(removeMoneyMask(e.target.value))}
              css="text-center w-[6rem]"
            />
          </div>
        </div>

        <LoadingButton
          onClick={postTransaction}
          isLoadingButton={isLoadingButton}
          css="py-4"
        >
          Adicionar
        </LoadingButton>
      </div>
    </div>
  );
}
