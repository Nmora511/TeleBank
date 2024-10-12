"use client";
import { useState } from "react";
import LoadingButton from "../UtilComponents/LoadingButton/LoadingButton";
import api from "@/apiClient/apiCaller";
import { AxiosResponse } from "axios";
import { InsertOneResult } from "mongodb";
import { toast } from "react-toastify";

type InviteCardProps = {
  invitationUser: string;
};

export default function InviteCard({ invitationUser }: InviteCardProps) {
  const [isLoadingAccept, setIsLoadingAccept] = useState<boolean>(false);
  const [isLoadingRefuse, setIsLoadingRefuse] = useState<boolean>(false);

  const accept = () => {
    setIsLoadingAccept(true);
    api
      .post("/friends", { user2: invitationUser })
      .then((response: AxiosResponse<InsertOneResult<Document>>) => {
        if (response.status.toString().startsWith("2")) {
          toast.success(`Usuário ${invitationUser} adicionado com sucesso`);
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
        setIsLoadingAccept(false);
      });
  };

  const refuse = () => {
    setIsLoadingRefuse(true);
    api
      .delete("/friends", {
        data: { user2: invitationUser },
      })
      .then((response: AxiosResponse<{ message: string }>) => {
        if (response.status === 200) {
          toast.success(response.data.message);
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
        setIsLoadingRefuse(false);
      });
  };

  return (
    <div className="w-full h-[12%]">
      <span className="w-[95%] h-[0.04rem] bg-[var(--foreground)] opacity-20 inline-block" />
      <div className="w-full h-full">
        <h2 className="m-4 text-xl">Convite recebido de @{invitationUser}</h2>
        <div className="m-4 mt-5 flex justify-evenly">
          <LoadingButton
            css="bg-[var(--secondary-green)]"
            onClick={accept}
            disabled={isLoadingAccept || isLoadingRefuse}
            isLoadingButton={isLoadingAccept}
          >
            Aceitar
          </LoadingButton>
          <LoadingButton
            css="bg-[var(--secondary-red)]"
            onClick={refuse}
            disabled={isLoadingAccept || isLoadingRefuse}
            isLoadingButton={isLoadingRefuse}
          >
            Recusar
          </LoadingButton>
        </div>
      </div>
      <span className="w-[95%] h-[0.04rem] bg-[var(--foreground)] opacity-20 inline-block" />
    </div>
  );
}
