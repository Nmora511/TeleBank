import { NextApiRequest, NextApiResponse } from "next";
import { QuickTransactionProps } from "@/types/api/transactionProps";
import { v4 as uuid } from "uuid";
import clientPromise from "@/lib/mongodb";
import { authenticateToken } from "../auth";
import moment from "moment";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const decodedToken = authenticateToken(req, res);
      if (!decodedToken) return;

      const user = decodedToken.username;
      const { friends, value, date, message }: QuickTransactionProps = req.body;
      const client = await clientPromise;
      const db = client.db("TeleBank");

      if (value <= 0 || isNaN(value)) {
        return res.status(400).json({ message: `Valor ${value} inválido.` });
      }

      if (message === "" || message === undefined) {
        return res.status(400).json({ message: `Mensagem inválida.` });
      }

      const dateFormatted = moment(date, "YYYY-MM-DD/HH:mm");
      if (!dateFormatted.isValid()) {
        return res.status(400).json({ message: `Data inválida.` });
      }

      const usersExist = await Promise.all(
        friends.map(async (friend) => {
          const userExist = await db
            .collection("users")
            .findOne({ username: friend });
          return userExist !== null;
        }),
      );

      if (usersExist.includes(false)) {
        return res
          .status(400)
          .json({ message: `Algum usuário não encontrado.` });
      }

      // verificar se todos os usuários são amigos

      const results = [];
      for (const friend of friends) {
        const result = await db.collection("transactions").insertOne({
          id: uuid(),
          from: user,
          to: friend,
          value: Math.round(value * 100),
          message: message,
          date: date,
          isValid: true,
        });
        results.push(result);
      }

      res
        .status(201)
        .json({ message: "Transações adicionadas com sucesso", results });
    } catch (error) {
      res.status(500).json({ message: "Erro ao adicionar transação", error });
    }
  } else {
    res.status(405).json({ message: "Método não permitido" });
  }
}
