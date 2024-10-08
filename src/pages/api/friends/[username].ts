import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";
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

      const friends = await db
        .collection("friends")
        .find({
          $or: [{ user1: username }, { user2: username }],
        })
        .toArray();

      res.status(200).json(friends);
    } catch (error) {
      res.status(500).json({ message: "Erro ao puxar amigos", error });
    }
  } else {
    res.status(405).json({ message: "Método não permitido" });
  }
}
