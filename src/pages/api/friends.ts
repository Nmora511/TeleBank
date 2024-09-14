import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const { user1, user2 } = req.body;
      const client = await clientPromise;
      const db = client.db("TeleBank");

      const user1Exists = await db
        .collection("users")
        .findOne({ username: user1 });

      const user2Exists = await db
        .collection("users")
        .findOne({ username: user2 });

      if (!user1Exists) {
        return res
          .status(400)
          .json({ message: `Usuário ${user1} não encontrado.` });
      }

      if (!user2Exists) {
        return res
          .status(400)
          .json({ message: `Usuário ${user2} não encontrado.` });
      }

      const friendshipExists = await db.collection("friends").findOne({
        $or: [
          { user1, user2 },
          { user1: user2, user2: user1 },
        ],
      });

      if (friendshipExists) {
        return res.status(400).json({ message: "Os usuários já são amigos." });
      }

      const result = await db.collection("friends").insertOne({ user1, user2 });
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: "Erro ao adicionar amigo", error });
    }
  } else {
    res.status(405).json({ message: "Método não permitido" });
  }
}
