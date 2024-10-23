"use client";
import { useEffect, useState } from "react";
import LayoutNavBar from "../layoutNavBar";
import Loading from "@/components/UtilComponents/Loading";
import { NotificationProps, transaction } from "@/types/api/notificationProps";
import api from "@/apiClient/apiCaller";
import { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import InviteCard from "@/components/notificationsComponents/InviteCard";
import TransactionCard from "@/components/notificationsComponents/TransactionCard";
import Input from "@/components/UtilComponents/Input";
import LoadingButton from "@/components/UtilComponents/LoadingButton/LoadingButton";
import { motion } from "framer-motion";

export default function Notifications() {
  const [option, setOption] = useState<string>("friendship");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [transactions, setTransactions] = useState<transaction[]>();
  const [invites, setInvites] = useState<string[]>([]);
  const [isLoadingButton, setIsLoadingButton] = useState<boolean>(false);
  const [userInvite, setUserInvite] = useState<string>("");

  console.log(transactions);

  useEffect(() => {
    api
      .get("/user/notifications")
      .then((response: AxiosResponse<NotificationProps>) => {
        if (
          response.status === 200 &&
          response.data.transactions &&
          response.data.invites
        ) {
          setTransactions(response.data.transactions);
          setInvites(response.data.invites);
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
  }, []);

  const sendInvite = () => {
    setIsLoadingButton(true);
    api
      .post("/friends", { user2: userInvite })
      .then((response) => {
        if (response.status === 201) {
          toast.success("Solicitação enviada com sucesso para: " + userInvite);
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

  return (
    <LayoutNavBar>
      {isLoading ? (
        <div className="h-[88vh] w-full flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-screen h-screen overflow-scroll"
        >
          <div className="sticky top-0 w-full h-[10%] flex flex-col bg-[var(--background)] text-center items-center z-10">
            <div className="h-full w-full flex items-center justify-around">
              <h2
                onClick={() => {
                  setOption("friendship");
                }}
                className={`text-2xl flex-1 cursor-pointer h-full flex items-center justify-center ${option === "friendship" ? "bg-[var(--secondary-foreground)]" : ""}`}
              >
                Amizades
              </h2>
              <span className="w-[0.04rem] h-[80%] bg-[var(--foreground)]" />
              <h2
                onClick={() => {
                  setOption("transaction");
                }}
                className={`text-2xl flex-1 cursor-pointer h-full flex items-center justify-center ${option === "transaction" ? "bg-[var(--secondary-foreground)]" : ""}`}
              >
                Transações
              </h2>
            </div>
            <span className="h-[0.05rem] w-[95%] bg-[var(--foreground)] " />
          </div>
          {option === "friendship" ? (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col justify-center items-center gap-0 pb-28"
            >
              <Input
                onChange={(e) => setUserInvite(e.target.value)}
                value={userInvite}
                placeholder="Nome de Usuário"
                css="mt-6"
              />
              <LoadingButton
                isLoadingButton={isLoadingButton}
                onClick={sendInvite}
                className="bg-[var(--primary-yellow)] mt-3 hover:bg-[var(--secondary-yellow)] active:bg-[var(--tertiary-yellow)] font-bold p-4 rounded-2xl"
              >
                Enviar Convite
              </LoadingButton>
              {invites.length != 0 ? (
                invites.map((invite) => {
                  return <InviteCard key={invite} invitationUser={invite} />;
                })
              ) : (
                <h1 className="mt-12 opacity-50 text-sm">
                  Não existem solicitações de amizade para você
                </h1>
              )}
            </motion.div>
          ) : (
            <div className="h-full w-full flex justify-center items-start">
              <h1 className="mt-48">Em Breve...</h1>
            </div>
          )}
          {option === "transaction" ? <TransactionCard /> : <div></div>}
        </motion.div>
      )}
    </LayoutNavBar>
  );
}
