import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const refreshSecret =
  process.env.REFRESH_TOKEN_SECRET || "fallbackRefreshSecret";
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
      const decoded = jwt.verify(refreshToken, refreshSecret) as jwt.JwtPayload;

      const newAccessToken = jwt.sign(
        { username: decoded.username, name: decoded.name },
        secret,
        { expiresIn: "5h" },
      );

      res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
      res
        .status(403)
        .json({ message: "Token de atualização inválido", error: error });
    }
  } else {
    res.status(405).json({ message: "Método não permitido" });
  }
}
