"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    // Pegando o token de autenticação do localStorage
    const token = localStorage.getItem("auth-token"); // Ajuste 'auth-token' para o nome da chave que você usa para armazenar o token

    // Verifica se o usuário está logado com base no token
    if (token) {
      // Se o token existir, redireciona para a página home
      router.push("/home");
    } else {
      // Se o token não existir, redireciona para a página de login
      router.push("/login");
    }
  }, [router]);

  return null; // Enquanto faz o redirecionamento, não renderiza nada (pode adicionar um spinner, se quiser)
};

export default HomePage;
