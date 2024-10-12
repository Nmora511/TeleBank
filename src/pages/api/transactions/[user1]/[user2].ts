import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../lib/mongodb";
import { TransactionProps } from "@/types/api/transactionProps";
import { authenticateToken } from "../../auth";
import moment from "moment";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { user1, user2 } = req.query;

  if (req.method === "GET") {
    try {
      const decodedToken = authenticateToken(req, res);
      if (!decodedToken) return;

      const client = await clientPromise;
      const db = client.db("TeleBank");

      const transactions = await db
        .collection("transactions")
        .find({
          $or: [
            { from: user1, to: user2 },
            { from: user2, to: user1 },
          ],
        })
        .toArray();

      const orderedTransactions = transactions.sort(
        (a, b) =>
          moment(b.date, "DD-MM-YYYY/HH:mm").unix() -
          moment(a.date, "DD-MM-YYYY/HH:mm").unix(),
      );

      // Calcular o saldo do ponto de vista de user1
      let balance = 0;
      const log: TransactionProps[] = [];

      orderedTransactions.forEach((transaction) => {
        if (transaction.isValid) {
          if (transaction.from === user1) {
            balance += transaction.value; // user1 enviou dinheiro
          } else {
            balance -= transaction.value; // user1 recebeu dinheiro
          }
        }

        log.push({
          id: transaction.id,
          from: transaction.from,
          to: transaction.to,
          value: transaction.value,
          message: transaction.message,
          date: transaction.date,
          isValid: transaction.isValid,
        });
      });

      res.status(200).json({ balance: balance / 100, log: log });
    } catch (error) {
      res.status(500).json({ message: "Erro ao calcular saldo", error });
    }
  } else {
    res.status(405).json({ message: "Método não permitido" });
  }
}
