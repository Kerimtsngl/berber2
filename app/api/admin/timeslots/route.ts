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
  const slots = await prisma.timeSlot.findMany();
  return NextResponse.json(slots);
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const { start, end } = await req.json();
  if (!start || !end) return NextResponse.json({ error: "Eksik veri" }, { status: 400 });
  const slot = await prisma.timeSlot.create({ data: { start: new Date(start), end: new Date(end) } });
  return NextResponse.json(slot, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Eksik id" }, { status: 400 });
  await prisma.timeSlot.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
} 