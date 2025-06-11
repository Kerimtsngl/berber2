import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import { verifyToken } from "../../lib/auth";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const token = auth.replace("Bearer ", "");
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Geçersiz token" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  let where = {};
  if (userId === "me" || !userId) {
    where = { OR: [{ senderId: payload.id }, { receiverId: payload.id }] };
  } else {
    // Sadece iki kullanıcı arasındaki mesajlar
    where = {
      OR: [
        { senderId: payload.id, receiverId: Number(userId) },
        { senderId: Number(userId), receiverId: payload.id },
      ],
    };
  }
  const messages = await prisma.message.findMany({
    where,
    include: { sender: true, receiver: true },
    orderBy: { createdAt: "asc" },
  });
  // isMine flag'i ekle
  const result = messages.map(m => ({ ...m, isMine: m.senderId === payload.id }));
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const token = auth.replace("Bearer ", "");
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Geçersiz token" }, { status: 401 });
  const senderId = payload.id;
  const { receiverId, content } = await req.json();
  if (!receiverId || !content) {
    return NextResponse.json({ error: "Eksik veri" }, { status: 400 });
  }
  const message = await prisma.message.create({
    data: { senderId, receiverId, content },
  });
  return NextResponse.json(message, { status: 201 });
} 