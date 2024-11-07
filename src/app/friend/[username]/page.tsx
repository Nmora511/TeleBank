"use client";
import api from "@/apiClient/apiCaller";
import FriendHistory from "@/components/friendsComponents/FriendHistory";
import BackArrow from "@/components/UtilComponents/BackArrow";
import Loading from "@/components/UtilComponents/Loading";
import TransactionModal from "@/components/UtilComponents/Modals/TransactionModal";
import { useModalContext } from "@/contexts/ModalContext";
import { meProps } from "@/types/api/meProps";
import { Transaction, TransactionProps } from "@/types/api/transactionProps";
import { moneyMask } from "@/utils/MoneyMask";
import { AxiosResponse } from "axios";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Friend() {
  const { setModalIsOpen, setModalContent } = useModalContext();
  const params = useParams();
  const username = params?.username ? params?.username : "";
  const [log, setLog] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [myUsername, setMyUserame] = useState<string>("");
  const [friendName, setFriendName] = useState<string>("");
  const [friendUserName, setFriendUserName] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(true);

  //temporary
  console.log(myUsername);

  useEffect(() => {
    api
      .get(`/transactions/${username}`)
      .then((response: AxiosResponse<TransactionProps>) => {
        if (
          response.status === 200 &&
          response.data.log &&
          response.data.balance
        ) {
          setLog(response.data.log);
          setBalance(response.data.balance);
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
        getMe();
      });
  }, []);

  const getMe = () => {
    api
      .get(`/me`)
      .then((response: AxiosResponse<meProps>) => {
        if (
          response.status === 201 &&
          response.data.username &&
          response.data.name
        ) {
          setMyUserame(response.data.username);
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
        getFriend();
      });
  };

  const getFriend = () => {
    api
      .get(`/user/${username}`)
      .then((response: AxiosResponse<meProps>) => {
        if (
          response.status === 200 &&
          response.data.username &&
          response.data.name
        ) {
          setFriendUserName(response.data.username);
          setFriendName(response.data.name);
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
        setIsLoading(false);
      });
  };

  const newTransaction = () => {
    setModalContent(
      <TransactionModal
        myUserName={myUsername}
        friendUserName={friendUserName}
      />,
    );
    setModalIsOpen(true);
  };

  const balanceColorVerification =
    balance > 0 ? "text-[var(--primary-green)]" : "text-[var(--primary-red)]";
  const balanceColor =
    balance === 0 ? "text-[var(--foreground)]" : balanceColorVerification;

  return isLoading ? (
    <div className="h-[88vh] w-full flex items-center justify-center">
      <Loading />
    </div>
  ) : (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-[100vh] flex-col flex w-full items-center max-sm:pt-8 sm:items-center text-center overflow-scroll"
    >
      <div className="w-full flex justify-center">
        <h1 className="text-[var(--primary-yellow)] md:text-[10rem] text-[4rem] font-bold font-poppins">
          TELE
        </h1>
        <h1 className="text-[var(--foreground)] md:text-[10rem] text-[4rem] font-bold font-poppins">
          BANK
        </h1>
      </div>

      <div className="mt-6 mb-3 flex w-full text-center justify-center items-center text-4xl font-bold">
        <BackArrow />
        <h1>{friendName}</h1>
      </div>
      <h3 className="mb-6">@{friendUserName}</h3>

      <h2 className="mt-4 mb-4 text-2xl font-extralight">SALDO: </h2>
      <div
        className={`border-[0.1rem] rounded-3xl w-fit text-center ${balanceColor}`}
      >
        <h1 className="p-4 text-xl font-bold">{moneyMask(balance)}</h1>
      </div>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={newTransaction}
        className="my-8 text-2xl bg-[var(--primary-yellow)] hover:bg-[var(--secondary-yellow)] active:bg-[var(--tertiary-yellow)] font-bold p-4 rounded-3xl"
      >
        Nova
        <br /> Transação
      </motion.button>

      <h1 className="font-bold text-2xl">Histórico</h1>
      <span className="my-5 w-[80%] h-[0.04rem] bg-[var(--foreground)] text-[var(--foreground)]">
        &nbsp;
      </span>
      <div className="w-full flex flex-col justify-center items-center text-center ">
        {log.length > 0 ? (
          log.map((transaction) => {
            return (
              <FriendHistory key={transaction.id} transaction={transaction} />
            );
          })
        ) : (
          <h1 className="mt-4 opacity-50 text-sm">
            Não existem transações no histórico
          </h1>
        )}
      </div>
    </motion.div>
  );
}
