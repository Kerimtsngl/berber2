import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const token = auth.replace("Bearer ", "");
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Geçersiz token" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { id: payload.id } });
  if (!user) return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
  return NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role, profileImage: user.profileImage });
} 