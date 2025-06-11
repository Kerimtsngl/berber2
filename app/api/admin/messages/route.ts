import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { verifyToken } from "../../../lib/auth";

async function isAdmin(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth) return false;
  const token = auth.replace("Bearer ", "");
  const payload = verifyToken(token);
  return payload && payload.role === "ADMIN";
}

export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const messages = await prisma.message.findMany({
    where: { isHidden: false },
    include: { sender: true, receiver: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(messages);
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Eksik id" }, { status: 400 });
  await prisma.message.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const { id, isHidden } = await req.json();
  const messageId = Number(id);
  if (isNaN(messageId) || typeof isHidden !== "boolean") {
    return NextResponse.json({ error: "Eksik veya hatalı parametre" }, { status: 400 });
  }
  await prisma.message.update({ where: { id: messageId }, data: { isHidden } });
  return NextResponse.json({ success: true });
} 