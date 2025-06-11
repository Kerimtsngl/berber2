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
  const services = await prisma.service.findMany();
  return NextResponse.json(services);
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const { name, price } = await req.json();
  if (!name || !price) return NextResponse.json({ error: "Eksik veri" }, { status: 400 });
  const service = await prisma.service.create({ data: { name, price } });
  return NextResponse.json(service, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Eksik id" }, { status: 400 });
  await prisma.service.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}

export async function PUT(req: NextRequest) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const { id, name, price } = await req.json();
  if (!id || !name || !price) return NextResponse.json({ error: "Eksik veri" }, { status: 400 });
  const service = await prisma.service.update({ where: { id: Number(id) }, data: { name, price } });
  return NextResponse.json(service);
} 