import { usePathname } from "next/dist/client/components/navigation";
import { useRouter } from "next/navigation";
import { Bell, Gear, House } from "phosphor-react";

export default function NavBar() {
  const router = useRouter();

  const currentPath = usePathname();

  return (
    <div className="w-screen sticky bottom-0 pb-[0.6rem]  bg-[var(--background)]">
      <span className="w-[95%] flex-grow bg-[var(--foreground)] h-[0.04rem] inline-block" />

      <div className="w-screen flex justify-around p-4">
        <button
          onClick={() => router.push("/home")}
          className={`flex flex-col text-center justify-center items-center flex-1  ${currentPath === "/home" ? "text-[var(--primary-yellow)]" : "text-[var(--foreground)]"}`}
        >
          <House weight={currentPath === "/home" ? "fill" : "bold"} size={28} />
          <span>Home</span>
        </button>

        <button
          onClick={() => router.push("/notifications")}
          className={`flex flex-col text-center justify-center items-center flex-1 ${currentPath === "/notifications" ? "text-[var(--primary-yellow)]" : "text-[var(--foreground)]"}`}
        >
          <Bell
            weight={currentPath === "/notifications" ? "fill" : "bold"}
            size={26}
          />
          <span>Notificações</span>
        </button>

        <button
          onClick={() => router.push("/settings")}
          className={`flex flex-col text-center justify-center items-center flex-1 ${currentPath === "/settings" ? "text-[var(--primary-yellow)]" : "text-[var(--foreground)]"}`}
        >
          <Gear
            size={28}
            weight={currentPath === "/settings" ? "fill" : "bold"}
          />
          <span>Ajustes</span>
        </button>
      </div>
    </div>
  );
}
