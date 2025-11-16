import { Request, Response, NextFunction } from "express";

export function productGuard(_req: Request, _res: Response, next: NextFunction) {
  // Exemplo: adicionar lógica de autorização aqui
  // if (!req.headers["x-api-key"]) return res.status(401).json({ error: "Unauthorized" });
  next();
}