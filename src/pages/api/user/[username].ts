import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { authenticateToken } from "../auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      const decodedToken = authenticateToken(req, res);
      if (!decodedToken) return;

      const { username } = req.query;
      const client = await clientPromise;
      const db = client.db("TeleBank");

      const userData = await db.collection("users").findOne({
        username: username,
      });

      if (!userData) {
        return res.status(400).json({
          message: `Usuário ${username} não encontrado`,
        });
      }

      // Verifica se as duas amizades recíprocas existem
      const friendshipOne = await db.collection("friends").findOne({
        user1: decodedToken.username,
        user2: username,
      });

      const friendshipTwo = await db.collection("friends").findOne({
        user1: username,
        user2: decodedToken.username,
      });

      const friendshipExists = friendshipOne && friendshipTwo;

      if (!friendshipExists) {
        return res.status(400).json({
          message: "usuário do token não é amigo do usuário requisitado",
        });
      }

      res
        .status(200)
        .json({ username: userData.username, name: userData.name });
    } catch (error) {
      res.status(500).json({ message: "Erro ao puxar amigos", error });
    }
  } else {
    res.status(405).json({ message: "Método não permitido" });
  }
}
