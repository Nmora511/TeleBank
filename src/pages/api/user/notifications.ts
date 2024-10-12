import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { authenticateToken } from "../auth";
import moment from "moment";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      const decodedToken = authenticateToken(req, res);
      if (!decodedToken) return;

      const username = decodedToken.username;

      const client = await clientPromise;
      const db = client.db("TeleBank");

      const transactions = await db
        .collection("transactions")
        .find({
          $or: [{ from: username }, { to: username }],
        })
        .toArray();

      const orderedTransactions = transactions.sort(
        (a, b) =>
          moment(b.date, "DD-MM-YYYY/HH:mm").unix() -
          moment(a.date, "DD-MM-YYYY/HH:mm").unix(),
      );

      const adjustedTransactions = orderedTransactions.map((transaction) => {
        return {
          ...transaction,
          value: transaction.value / 100,
        };
      });

      const possibleInvites = await db
        .collection("friends")
        .find({
          user2: username,
        })
        .toArray();

      const friends = await db
        .collection("friends")
        .find({
          user1: username,
          user2: { $in: possibleInvites.map((friend) => friend.user1) },
        })
        .toArray();

      const friendsUser2 = friends.map((friend) => friend.user2);
      const invites = possibleInvites
        .filter(
          (possibleInvite) => !friendsUser2.includes(possibleInvite.user1),
        )
        .map((invite) => invite.user1);

      res
        .status(200)
        .json({ transactions: adjustedTransactions, invites: invites });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erro ao puxar amigos", error });
    }
  } else {
    res.status(405).json({ message: "Método não permitido" });
  }
}
