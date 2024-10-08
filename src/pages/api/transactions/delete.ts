import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { authenticateToken } from "../auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const decodedToken = authenticateToken(req, res);
      if (!decodedToken) return;

      const { id }: { id: string } = req.body;
      const client = await clientPromise;
      const db = client.db("TeleBank");

      const transaction = await db
        .collection("transactions")
        .find({ id: id })
        .toArray();

      if (!transaction)
        res.status(400).json({ message: "transação não encontrada" });

      if (
        !transaction.some(
          (user) =>
            user.from === decodedToken.username ||
            user.to === decodedToken.username,
        )
      )
        res.status(401).json({
          message: "usuário do token não presente na transação requisitada",
        });

      await db
        .collection("transactions")
        .updateOne({ id: id }, { $set: { isValid: false } });

      res.status(200).json({ message: "transação deletada" });
    } catch (error) {
      (error as string).toString();
      res.status(403).json({
        message: "Não foi possível deletar a transação",
        error: (error as object).toString(),
      });
    }
  } else {
    res.status(405).json({ message: "Método não permitido" });
  }
}
