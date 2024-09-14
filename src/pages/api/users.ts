import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const { name, username, password } = req.body;
      const client = await clientPromise;
      const db = client.db("TeleBank");

      const result = await db
        .collection("users")
        .insertOne({ name, username, password });
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: "Erro ao criar usuário", error });
    }
  } else {
    res.status(405).json({ message: "Método não permitido" });
  }
}
