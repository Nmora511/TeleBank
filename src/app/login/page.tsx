import Input from "@/components/UtilComponents/Input";
import InputPassword from "@/components/UtilComponents/InputPassword";

export default function login() {
  return (
    <div className="h-[100vh] w-full flex justify-center max-sm:mt-40 sm:items-center text-center">
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
              <Input placeholder="Username" />
            </div>

            <div>
              <h2 className="font-bold">Digite sua senha</h2>
              <InputPassword placeholder="Senha" />
            </div>

            <button className="bg-[var(--primary-yellow)] mb-4 hover:bg-[var(--secondary-yellow)] active:bg-[var(--tertiary-yellow)] font-bold p-4 rounded-2xl">
              Fazer LogIn
            </button>

            <span className="border border-[var(--foreground)] bg-[var(--foreground)] w-[80%]" />

            <a className="cursor-pointer opacity-80">
              Não possui uma conta, fazer cadastro
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
