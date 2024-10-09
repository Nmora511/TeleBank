import { NextApiRequest, NextApiResponse } from "next";
import { authenticateToken } from "./auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      const decodedToken = authenticateToken(req, res);
      if (!decodedToken) return;

      const result = {
        username: decodedToken.username,
        name: decodedToken.name,
      };
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: "Erro ao adicionar amigo", error });
    }
  } else {
    res.status(405).json({ message: "Método não permitido" });
  }
}
