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
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Eksik id" }, { status: 400 });
  await prisma.user.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const { id, role, isBanned } = await req.json();
  if (!id) return NextResponse.json({ error: "Eksik id" }, { status: 400 });
  let user;
  if (typeof isBanned === "boolean") {
    user = await prisma.user.update({ where: { id: Number(id) }, data: { isBanned } });
  } else if (role) {
    user = await prisma.user.update({ where: { id: Number(id) }, data: { role } });
  }
  return NextResponse.json(user);
} 