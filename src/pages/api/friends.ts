import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";
import { authenticateToken } from "./auth";
import { friends } from "@/types/api/friendsProps";

import { performance } from "perf_hooks";

async function post(req: NextApiRequest, res: NextApiResponse) {
  try {
    const decodedToken = authenticateToken(req, res);
    if (!decodedToken) return;

    const { user1, user2 } = req.body;
    const client = await clientPromise;
    const db = client.db("TeleBank");

    if (!(user1 === decodedToken.username)) {
      return res.status(400).json({
        message:
          "usuário do token não corresponde ao usuário chamando requisição",
      });
    }

    const user2Exists = await db
      .collection("users")
      .findOne({ username: user2 });

    if (!user2Exists) {
      return res
        .status(400)
        .json({ message: `Usuário ${user2} não encontrado.` });
    }

    const user1ToUser2 = await db
      .collection("friends")
      .findOne({ user1: user1, user2: user2 });

    const user2ToUser1 = await db
      .collection("friends")
      .findOne({ user1: user2, user2: user1 });

    if (user1ToUser2 && !user2ToUser1) {
      return res
        .status(400)
        .json({ message: `Solicitação para ${user2} já enviada.` });
    }

    if (user2ToUser1 && user1ToUser2) {
      return res.status(400).json({ message: "Os usuários já são amigos." });
    }

    const result = await db.collection("friends").insertOne({ user1, user2 });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "Erro ao adicionar amigo", error });
  }
}

async function get(req: NextApiRequest, res: NextApiResponse) {
  try {
    const startTime = performance.now();
    const decodedToken = authenticateToken(req, res);
    if (!decodedToken) return;

    const username = decodedToken.username;

    const client = await clientPromise;
    const db = client.db("TeleBank");

    const stepOne = performance.now();
    const possibleFriends = await db
      .collection("friends")
      .find({
        user1: username,
      })
      .toArray();

    const stepTwo = performance.now();

    const reciprocalFriendship = await db
      .collection("friends")
      .find({
        user1: { $in: possibleFriends.map((friend) => friend.user2) },
        user2: username,
      })
      .toArray();

    const confirmedFriends: string[] = reciprocalFriendship.map(
      (friend) => friend.user1,
    );

    const stepThree = performance.now();
    const friendsList: friends[] = [];

    const friend_data = await db
      .collection("users")
      .find({
        username: { $in: confirmedFriends },
      })
      .toArray();

    for (const friend of friend_data) {
      const transactions = await db
        .collection("transactions")
        .find({
          $or: [
            { from: username, to: friend.username },
            { from: friend.username, to: username },
          ],
        })
        .toArray();

      // Calcular o saldo do ponto de vista de username
      let balance = 0;

      transactions
        .filter((transaction) => transaction.isValid)
        .map((transaction) =>
          transaction.from === username
            ? transaction.value
            : -transaction.value,
        )
        .forEach((value) => {
          balance += value;
        });

      friendsList.push({
        name: friend.name,
        username: friend.username,
        balance: balance / 100,
      });
    }

    const endTime = performance.now();
    console.log(`Passo 1: ${stepOne - startTime}`);
    console.log(`Passo 2: ${stepTwo - stepOne}`);
    console.log(`Passo 3: ${stepThree - stepTwo}`);
    console.log(`Passo 4: ${endTime - stepThree}`);
    res.status(200).json({ friends: friendsList });
  } catch (error) {
    res.status(500).json({ message: "Erro ao puxar amigos", error });
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    post(req, res);
  } else if (req.method === "GET") {
    get(req, res);
  } else {
    res.status(405).json({ message: "Método não permitido" });
  }
}
