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
  const appointments = await prisma.appointment.findMany({
    include: { user: true, service: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(appointments);
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const { id, status } = await req.json();
  if (!id || !status) return NextResponse.json({ error: "Eksik veri" }, { status: 400 });
  const appointment = await prisma.appointment.update({ where: { id: Number(id) }, data: { status } });
  return NextResponse.json(appointment);
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Eksik id" }, { status: 400 });
  await prisma.appointment.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
} 