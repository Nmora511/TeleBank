import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";
import { Transaction } from "@/types/api/transactionProps";
import { v4 as uuid } from "uuid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const { from, to, value, message, date }: Transaction = req.body;
      const client = await clientPromise;
      const db = client.db("TeleBank");

      const user1Exists = await db
        .collection("users")
        .findOne({ username: from });

      const user2Exists = await db
        .collection("users")
        .findOne({ username: to });

      if (!user1Exists) {
        return res
          .status(400)
          .json({ message: `Usuário ${from} não encontrado.` });
      }

      if (!user2Exists) {
        return res
          .status(400)
          .json({ message: `Usuário ${to} não encontrado.` });
      }

      // Verifica se as duas amizades recíprocas existem
      const friendshipOne = await db.collection("friends").findOne({
        user1: from,
        user2: to,
      });

      const friendshipTwo = await db.collection("friends").findOne({
        user1: to,
        user2: from,
      });

      const friendshipExists = friendshipOne && friendshipTwo;

      if (!friendshipExists) {
        return res.status(400).json({ message: "Os usuários não são amigos." });
      }

      const result = await db.collection("transactions").insertOne({
        id: uuid(),
        from: from,
        to: to,
        value: Math.round(value * 100),
        message: message,
        date: date,
        isValid: true,
      });
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: "Erro ao adicionar transação", error });
    }
  } else {
    res.status(405).json({ message: "Método não permitido" });
  }
}
