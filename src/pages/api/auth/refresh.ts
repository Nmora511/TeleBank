import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const refreshSecret = process.env.REFRESH_SECRET || "fallbackRefreshSecret";
const secret = process.env.JWT_SECRET || "fallbackSecret";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res
        .status(401)
        .json({ message: "Token de atualização não fornecido" });
    }

    try {
      // Verifica se o refresh token é válido
      const decoded = jwt.verify(refreshToken, refreshSecret) as jwt.JwtPayload;

      const newAccessToken = jwt.sign(
        { userId: decoded.userId, username: decoded.username },
        secret,
        { expiresIn: "5h" },
      );

      res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
      res.status(403).json({ message: "Token de atualização inválido" });
    }
  } else {
    res.status(405).json({ message: "Método não permitido" });
  }
}
