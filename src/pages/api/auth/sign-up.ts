import clientPromise from "@/lib/mongodb";
import { sha256 } from "js-sha256";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const salt = process.env.NEXT_PUBLIC_SALT;
      const { name, username, password } = req.body;

      if (!name || !username || !password) {
        return res
          .status(402)
          .json({ message: "Nome, senha e nome de usuário são necessários" });
      }

      const hashedPassword = sha256(password + salt);
      const client = await clientPromise;
      const db = client.db("TeleBank");

      const userExists = await db
        .collection("users")
        .findOne({ username: username });

      if (!userExists) {
        const result = await db.collection("users").insertOne({
          name: name,
          username: username,
          password: hashedPassword,
        });
        res.status(201).json(result);
      } else {
        return res
          .status(401)
          .json({ message: "Nome de usuário já registrado" });
      }
    } catch (error) {
      res.status(500).json({ message: "Erro ao criar usuário", error });
    }
  } else {
    res.status(405).json({ message: "Método não permitido" });
  }
}
