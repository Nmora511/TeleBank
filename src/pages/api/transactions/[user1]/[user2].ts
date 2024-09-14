import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { user1, user2 } = req.query;

  if (req.method === "GET") {
    try {
      const client = await clientPromise;
      const db = client.db("TeleBank");

      // Buscar todas as transações entre os dois usuários (independente da ordem)
      const transactions = await db
        .collection("transactions")
        .find({
          $or: [
            { from: user1, to: user2 },
            { from: user2, to: user1 },
          ],
        })
        .toArray();

      // Calcular o saldo do ponto de vista de user1
      let balance = 0;
      transactions.forEach((transaction) => {
        if (transaction.from === user1) {
          balance -= transaction.value; // user1 enviou dinheiro
        } else {
          balance += transaction.value; // user1 recebeu dinheiro
        }
      });

      res.status(200).json({ balance });
    } catch (error) {
      res.status(500).json({ message: "Erro ao calcular saldo", error });
    }
  } else {
    res.status(405).json({ message: "Método não permitido" });
  }
}
