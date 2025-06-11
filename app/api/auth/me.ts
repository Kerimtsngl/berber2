import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "Yetkisiz" });
  const token = auth.replace("Bearer ", "");
  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: "Geçersiz token" });
  const user = await prisma.user.findUnique({ where: { id: payload.id } });
  if (!user) return res.status(404).json({ error: "Kullanıcı bulunamadı" });
  return res.status(200).json({ id: user.id, name: user.name, email: user.email, role: user.role });
} 