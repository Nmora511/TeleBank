"use client";
import api from "@/apiClient/apiCaller";
import { refreshProps } from "@/types/api/refreshProps";
import { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function Refresh() {
  const router = useRouter();

  useEffect(() => {
    api
      .post("/auth/refresh")
      .then((response: AxiosResponse<refreshProps>) => {
        if (response.status === 200 && response.data.accessToken) {
          localStorage.setItem("auth-token", response.data.accessToken);
          router.push("/home");
          return;
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

  return <div></div>;
}
