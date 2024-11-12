"useClient";

import { useModalContext } from "@/contexts/ModalContext";
import Input from "../Input";
import { useEffect, useState } from "react";
import moment from "moment";
import LoadingButton from "../LoadingButton/LoadingButton";
import { moneyMask, removeMoneyMask } from "@/utils/MoneyMask";
import api from "@/apiClient/apiCaller";
import { toast } from "react-toastify";
import { friends } from "@/types/api/friendsProps";
import { AxiosResponse } from "axios";
import { meProps } from "@/types/api/meProps";
import { MultiValue, default as ReactSelect } from "react-select";
import Checkbox from "@mui/material/Checkbox";

type QuickTransactionModalProps = {
  friendsList: friends[];
};

export default function QuickTransactionModal({
  friendsList,
}: QuickTransactionModalProps) {
  const { setModalIsOpen } = useModalContext();
  const [myUsername, setMyUsername] = useState<string>("");
  const [date, setDate] = useState<string>(moment().format("YYYY-MM-DDTHH:mm"));
  const [value, setValue] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [isLoadingButton, setIsLoadingButton] = useState<boolean>(false);
  const [isSpliting, setIsSpliting] = useState<boolean>(false);
  const valuePerFriendIfSplit = isSpliting
    ? Math.round((value / (selectedFriends.length + 1)) * 100) / 100
    : Math.round((value / selectedFriends.length) * 100) / 100;
  const valuePerFriend =
    selectedFriends.length > 0 ? valuePerFriendIfSplit : value;

  const handleChange = (
    options: MultiValue<{ value: string; label: string }>,
  ) => {
    setSelectedFriends(options ? options.map((option) => option.value) : []);
  };

  const postTransaction = () => {
    setIsLoadingButton(true);

    api
      .post("/quick/transaction", {
        friends: selectedFriends,
        value: valuePerFriend,
        message: message,
        date: moment(date).format("DD-MM-YYYY/hh:mma"),
      })
      .then((response) => {
        if (response.status === 201) {
          toast.success("Transações criadas com sucesso");
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
    api
      .get(`/me`)
      .then((response: AxiosResponse<meProps>) => {
        if (
          response.status === 201 &&
          response.data.username &&
          response.data.name
        ) {
          setMyUsername(response.data.username);
        }
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          toast.error(error.response.data.message || "Erro desconhecido");
        } else {
          toast.error("Erro de conexão ou algo inesperado");
        }
        console.log(error.message);
      });
  }, []);

  return (
    <div className="w-full ">
      <h1 className="text-2xl font-bold p-4 ">Adicionar Transação Rápida</h1>
      <div>
        <div className="mt-4">
          <h1 className="font-bold">DE: {myUsername}</h1>
        </div>
        <div className="text-center opacity-50 w-full flex justify-center items-center ">
          <h1 className="font-bold">incluir você no valor?</h1>
          <Checkbox
            // color= #d39918
            sx={{
              color: "var(--foreground)",
              "&.Mui-checked": {
                color: "var(--primary-yellow)",
              },
            }}
            checked={isSpliting}
            onChange={() => {
              setIsSpliting(!isSpliting);
            }}
          />
        </div>

        <div className="flex justify-evenly text-center">
          <div className="my-4">
            <h1 className="font-bold">PARA:</h1>
            <ReactSelect
              className="mx-4 bg-var(--background) border-2 border-var(--foreground) rounded-lg"
              styles={{
                control: (provided) => ({
                  ...provided,
                  color: "var(--foreground)",
                  backgroundColor: "var(--background)",
                  border: 0,
                }),
                multiValueLabel: (provided) => ({
                  ...provided,
                  color: "var(--foreground)",
                }),
                multiValue: (provided) => ({
                  ...provided,
                  color: "var(--foreground)",
                  backgroundColor: "var(--secondary-foreground)",
                }),
                option: (provided) => ({
                  ...provided,
                  color: "var(--foreground)",
                  backgroundColor: "var(--background)",
                }),
              }}
              options={friendsList.map((friend) => {
                return { value: friend.username, label: friend.username };
              })}
              isMulti
              closeMenuOnSelect={false}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="my-4 flex flex-col">
          <h1 className="font-bold">MENSAGEM:</h1>
          <Input
            maxLength={30}
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
              maxLength={15}
              value={moneyMask(value)}
              onChange={(e) => setValue(removeMoneyMask(e.target.value))}
              css="text-center w-[6rem]"
            />
          </div>
        </div>

        <div className="text-center opacity-50 w-full">
          <h1 className="mb-4 font-bold">
            valor para cada: {moneyMask(valuePerFriend)}
          </h1>
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
