"use client";
import api from "@/apiClient/apiCaller";
import { meProps } from "@/types/api/meProps";
import { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Card from "@/components/homeComponents/Card";
import { friends, friendsProps } from "@/types/api/friendsProps";
import Loading from "@/components/UtilComponents/Loading";
import LayoutNavBar from "../layoutNavBar";

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [friendsList, setFriendsList] = useState<friends[]>([]);

  console.log(username + name);
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
          getFriendList();
        }
      })
      .catch((error) => {
        if (error.response.status === 403) {
          router.push("/refresh");
          return;
        }
        if (error.response && error.response.data) {
          toast.error(error.response.data.message || "Erro desconhecido");
        } else {
          toast.error("Erro de conexão ou algo inesperado");
        }
        console.log(error.message);
      });
  }, []);

  const getFriendList = () => {
    api
      .get("/friends/")
      .then((response: AxiosResponse<friendsProps>) => {
        if (response.status === 200 && response.data.friends) {
          setFriendsList(response.data.friends);
          generateCards();
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

  const generateCards = () => {};

  return isLoading ? (
    <div className="h-[88vh] w-full flex items-center justify-center">
      <Loading />
    </div>
  ) : (
    <LayoutNavBar>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-[100vh] w-full justify-center max-sm:pt-8 sm:items-center text-center"
      >
        <div className="w-full flex justify-center">
          <h1 className="text-[var(--primary-yellow)] md:text-[10rem] text-[4rem] font-bold font-poppins">
            TELE
          </h1>
          <h1 className="text-[var(--foreground)] md:text-[10rem] text-[4rem] font-bold font-poppins">
            BANK
          </h1>
        </div>

        <motion.div className="scrollable overflow-scroll w-full h-fit flex flex-col items-center text-center pb-32">
          {friendsList.map((friend) => {
            return <Card key={friend.username} friend={friend} />;
          })}
        </motion.div>
      </motion.div>
    </LayoutNavBar>
  );
}
