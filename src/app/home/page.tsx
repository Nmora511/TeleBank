"use client";
import api from "@/apiClient/apiCaller";
import { meProps } from "@/types/api/meProps";
import { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [name, setName] = useState<string>("");

  useEffect(() => {
    api
      .get("/me")
      .then((response: AxiosResponse<meProps>) => {
        if (
          response.status === 201 &&
          response.data.username &&
          response.data.name
        ) {
          setUsername(response.data.username);
          setName(response.data.name);
        }
      })
      .catch((error) => {
        if (error.response.status === 403) {
          router.push("/refresh");
        }
        if (error.response && error.response.data) {
          toast.error(error.response.data.message || "Erro desconhecido");
        } else {
          toast.error("Erro de conexão ou algo inesperado");
        }
        console.log(error.message);
      });
  }, []);

  return (
    <div>
      <h1>Nome: {name}</h1>
      <h1>Usuário: {username}</h1>

      <button
        onClick={() => {
          localStorage.removeItem("auth-token");
          router.push("/");
        }}
        className="bg-[var(--primary-yellow)] mb-4 hover:bg-[var(--secondary-yellow)] active:bg-[var(--tertiary-yellow)] font-bold p-4 rounded-2xl"
      >
        Limpar LocalStorage
      </button>
    </div>
  );
}
