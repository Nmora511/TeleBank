"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("auth-token");

    if (token) {
      router.push("/home");
    } else {
      router.push("/login");
    }
  }, [router]);

  return null;
};

export default HomePage;
