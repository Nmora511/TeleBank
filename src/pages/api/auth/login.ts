import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";
import jwt from "jsonwebtoken";
import { sha256 } from "js-sha256";

const secret = process.env.JWT_SECRET || "fallbackSecret";
const refreshSecret =
  process.env.REFRESH_TOKEN_SECRET || "fallbackRefreshSecret";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Usuário e senha são obrigatórios" });
    }

    try {
      const client = await clientPromise;
      const db = client.db("TeleBank");

      const user = await db.collection("users").findOne({ username: username });

      if (!user) {
        return res.status(400).json({ message: "Usuário não encontrado" });
      }

      const salt = process.env.NEXT_PUBLIC_SALT;
      const hashedPassword = sha256(password + salt);
      console.log(hashedPassword + " " + user.password);
      const passwordMatch = hashedPassword === user.password;

      if (!passwordMatch) {
        return res.status(400).json({ message: "Senha incorreta" });
      }

      const token = jwt.sign(
        {
          username: user.username,
          name: user.name,
        },
        secret,
        {
          expiresIn: "4h",
        },
      );

      const refreshToken = jwt.sign(
        { username: user.username, name: user.name },
        refreshSecret,
        { expiresIn: "30d" },
      );

      res.setHeader(
        "Set-Cookie",
        `refreshToken=${refreshToken}; HttpOnly; Path=/api; Max-Age=${30 * 24 * 60 * 60}`,
      );

      res.status(200).json({
        message: "Login bem-sucedido",
        token,
        user: { username: user.username, name: user.name },
      });
    } catch (error) {
      res.status(500).json({ message: "Erro no servidor", error });
    }
  } else {
    res.status(405).json({ message: "Método não permitido" });
  }
}
