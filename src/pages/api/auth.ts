import { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";

interface AuthTokenPayload extends JwtPayload {
  username: string;
  name: string;
}

const secret = process.env.JWT_SECRET || "fallbackSecret";

export function authenticateToken(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  try {
    const decoded = jwt.verify(token, secret) as AuthTokenPayload;
    return decoded;
  } catch (error) {
    return res.status(403).json({ message: "Token inválido" });
  }
}
