"use client";
import { useRouter } from "next/navigation";
import LayoutNavBar from "../layoutNavBar";

export default function Settings() {
  const router = useRouter();

  return (
    <LayoutNavBar>
      <div className="w-full h-[100vh] flex flex-col justify-center items-center">
        <button
          onClick={() => {
            localStorage.removeItem("auth-token");
            router.push("/");
          }}
          className="bg-[var(--primary-yellow)] mb-4 hover:bg-[var(--secondary-yellow)] active:bg-[var(--tertiary-yellow)] font-bold p-4 rounded-2xl"
        >
          Fazer LogOff
        </button>
      </div>
    </LayoutNavBar>
  );
}
