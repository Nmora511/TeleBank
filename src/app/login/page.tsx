"use client";
import Input from "@/components/UtilComponents/Input";
import InputPassword from "@/components/UtilComponents/InputPassword";
import api from "@/apiClient/apiCaller";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { sha256 } from "js-sha256";
import { loginProps } from "@/types/api/loginProps";
import { toast } from "react-toastify";
import { AxiosResponse } from "axios";
import { motion } from "framer-motion";
import LoadingButton from "@/components/UtilComponents/LoadingButton/LoadingButton";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const salt = process.env.NEXT_PUBLIC_SALT;

  useEffect(() => {
    if (localStorage.getItem("auth-token")) {
      router.push("/home");
    }
  }, []);

  const postLogin = () => {
    setIsLoading(true);
    api
      .post("/auth/login", {
        username: username,
        password: sha256(password + salt),
      })
      .then((response: AxiosResponse<loginProps>) => {
        if (response.status === 200 && response.data.token) {
          toast.success("Login realizado com sucesso");
          localStorage.setItem("auth-token", response.data.token);
          router.push("/");
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

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      postLogin();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [username, password]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-[100vh] w-full flex justify-center max-sm:pt-28 sm:items-center text-center"
    >
      <div className="flex flex-col gap-6">
        <div className="flex">
          <h1 className="text-[var(--primary-yellow)] md:text-[10rem] text-[4rem] font-bold font-poppins">
            TELE
          </h1>
          <h1 className="text-[var(--foreground)] md:text-[10rem] text-[4rem] font-bold font-poppins">
            BANK
          </h1>
        </div>

        <div className="border-2 border-[var(--foreground)] rounded-lg">
          <div className="flex flex-col items-center justify-center text-center gap-4 m-4">
            <div>
              <h2 className="font-bold">Digite seu nome de usuário</h2>
              <Input
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                placeholder="Username"
              />
            </div>

            <div>
              <h2 className="font-bold">Digite sua senha</h2>
              <InputPassword
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="Senha"
              />
            </div>

            <LoadingButton isLoadingButton={isLoading} onClick={postLogin}>
              Fazer LogIn
            </LoadingButton>

            <span className="border border-[var(--foreground)] bg-[var(--foreground)] w-[80%]" />

            <div className="flex">
              <a
                onClick={() => {
                  router.push("/sign-up");
                }}
                className="cursor-pointer opacity-80"
              >
                Não possui uma conta,&nbsp;
              </a>
              <a
                onClick={() => {
                  router.push("/sign-up");
                }}
                className="cursor-pointer opacity-80 text-[var(--primary-yellow)] underline"
              >
                Cadastrar-se
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
