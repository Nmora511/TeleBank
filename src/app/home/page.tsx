"use client";
import api from "@/apiClient/apiCaller";
import { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Card from "@/components/homeComponents/Card";
import { friends, friendsProps } from "@/types/api/friendsProps";
import Loading from "@/components/UtilComponents/Loading";
import LayoutNavBar from "../layoutNavBar";
import { CurrencyCircleDollar } from "phosphor-react";
import { useModalContext } from "@/contexts/ModalContext";
import QuickTransactionModal from "@/components/UtilComponents/Modals/QuickTransaction";

export default function Home() {
  const router = useRouter();
  const { setModalIsOpen, setModalContent } = useModalContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [friendsList, setFriendsList] = useState<friends[]>([]);

  const quickTransaction = () => {
    setModalContent(<QuickTransactionModal friendsList={friendsList} />);
    setModalIsOpen(true);
  };

  useEffect(() => {
    api
      .get("/friends/")
      .then((response: AxiosResponse<friendsProps>) => {
        if (response.status === 200 && response.data.friends) {
          setFriendsList(response.data.friends);
        }
      })
      .catch((error) => {
        if (error.response.status === 401 || error.response.status === 403) {
          router.push("/refresh");
          return;
        } else if (error.response && error.response.data) {
          toast.error(error.response.data.message || "Erro desconhecido");
        } else {
          toast.error("Erro de conexão ou algo inesperado");
        }
        console.log(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <LayoutNavBar>
      {isLoading ? (
        <div className="h-[88vh] w-full flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-[100vh] w-full justify-center max-sm:pt-8 sm:items-center text-center overflow-scroll"
          >
            <div className="w-full flex justify-center">
              <h1 className="text-[var(--primary-yellow)] md:text-[10rem] text-[4rem] font-bold font-poppins">
                TELE
              </h1>
              <h1 className="text-[var(--foreground)] md:text-[10rem] text-[4rem] font-bold font-poppins">
                BANK
              </h1>
            </div>

            <motion.div className="w-full h-fit flex flex-col items-center text-center pb-32">
              {friendsList.length > 0 ? (
                friendsList.map((friend) => {
                  return (
                    <Card
                      key={friend.username}
                      setIsLoading={setIsLoading}
                      friend={friend}
                    />
                  );
                })
              ) : (
                <h1 className="my-60 opacity-50 text-lg">
                  Nenhuma amizade encontrada
                </h1>
              )}
            </motion.div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.87 }}
            onClick={quickTransaction}
            className="z-9 cursor-pointer bg-[var(--primary-yellow)] w-fit h-fit flex justify-center items-center rounded-full fixed bottom-[8rem] left-[80vw]"
          >
            <CurrencyCircleDollar className="m-2" size={50} weight="bold" />
          </motion.div>
        </>
      )}
    </LayoutNavBar>
  );
}
