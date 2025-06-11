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
  const events = await prisma.event.findMany({
    where: { isHidden: false },
    include: { user: true },
    orderBy: { createdAt: "desc" },
    take: 30,
  });
  return NextResponse.json(events);
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const { id, isHidden } = await req.json();
  const eventId = Number(id);
  if (isNaN(eventId) || typeof isHidden !== "boolean") {
    return NextResponse.json({ error: "Eksik veya hatalı parametre" }, { status: 400 });
  }
  await prisma.event.update({ where: { id: eventId }, data: { isHidden } });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const { id } = await req.json();
  const eventId = Number(id);
  if (isNaN(eventId)) return NextResponse.json({ error: "Eksik id" }, { status: 400 });
  await prisma.event.delete({ where: { id: eventId } });
  return NextResponse.json({ success: true });
} 