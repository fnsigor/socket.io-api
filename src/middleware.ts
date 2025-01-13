// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();


export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Token não fornecido." });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: number };
    req.userId = decoded.id;

    (req as any).user = decoded;
    next();
  } catch (error) {
    console.log("auth error", error)
    res.status(401).json({ error: "Token inválido ou expirado." });
    return
  }
};
