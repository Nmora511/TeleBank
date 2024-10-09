"use client";
import Input from "@/components/UtilComponents/Input";
import InputPassword from "@/components/UtilComponents/InputPassword";
import api from "@/apiClient/apiCaller";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { AxiosResponse } from "axios";
import { sha256 } from "js-sha256";
import { signupProps } from "@/types/api/signupProps";

export default function Login() {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const salt = process.env.NEXT_PUBLIC_SALT;

  const postSignUp = () => {
    if (password !== confirmPassword) {
      toast.error("As senhas divergem");
      return;
    }

    api
      .post("/auth/sign-up", {
        name: name,
        username: username,
        password: sha256(password + salt),
      })
      .then((response: AxiosResponse<signupProps>) => {
        if (response.status === 201 && response.data.acknowledged) {
          toast.success("Cadastro realizado com sucesso");
          router.push("/login");
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
  };

  return (
    <div className="h-[100vh] w-full flex justify-center max-sm:pt-10 sm:items-center text-center">
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
              <h2 className="font-bold">Digite seu nome</h2>
              <Input
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="Name"
              />
            </div>

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

            <div>
              <h2 className="font-bold">Confirme sua senha</h2>
              <InputPassword
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                placeholder="Senha"
              />
            </div>

            <button
              onClick={() => {
                postSignUp();
              }}
              className="bg-[var(--primary-yellow)] mb-4 hover:bg-[var(--secondary-yellow)] active:bg-[var(--tertiary-yellow)] font-bold p-4 rounded-2xl"
            >
              Cadastrar-se
            </button>

            <span className="border border-[var(--foreground)] bg-[var(--foreground)] w-[80%]" />

            <a
              onClick={() => {
                router.push("/login");
              }}
              className="cursor-pointer opacity-80"
            >
              Já possui uma conta, Logar-se
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}