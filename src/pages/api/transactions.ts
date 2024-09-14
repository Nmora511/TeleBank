import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const { from, to, value, message, date } = req.body;
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

      const friendshipExists = await db.collection("friends").findOne({
        $or: [
          { from, to },
          { user1: to, user2: from },
        ],
      });

      if (!friendshipExists) {
        return res.status(400).json({ message: "Os usuários não são amigos." });
      }

      const result = await db
        .collection("transactions")
        .insertOne({ from, to, value, message, date });
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: "Erro ao adicionar transação", error });
    }
  } else {
    res.status(405).json({ message: "Método não permitido" });
  }
}
