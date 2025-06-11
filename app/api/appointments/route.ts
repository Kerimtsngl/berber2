import { NextRequest, NextResponse } from "next/server";
import { createAppointment, getUserAppointments } from "../../actions/appointmentActions";
import { verifyToken } from "../../lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function getUserIdFromRequest(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth) return null;
  const token = auth.replace("Bearer ", "");
  const payload = verifyToken(token);
  return payload?.id || payload?.userId || null;
}

export async function POST(req: NextRequest) {
  const userId = getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ error: "Kimlik doğrulama gerekli" }, { status: 401 });
  const { serviceId, timeSlotId } = await req.json();
  if (!serviceId || !timeSlotId) return NextResponse.json({ error: "Eksik veri" }, { status: 400 });
  try {
    const appointment = await createAppointment(Number(userId), Number(serviceId), Number(timeSlotId));
    return NextResponse.json(appointment, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  const userId = getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ error: "Kimlik doğrulama gerekli", appointments: [] }, { status: 401 });
  try {
    const appointments = await getUserAppointments(Number(userId));
    return NextResponse.json(appointments || []);
  } catch (e: any) {
    return NextResponse.json({ error: e.message, appointments: [] }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  const userId = getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ error: "Kimlik doğrulama gerekli" }, { status: 401 });
  const { id, status } = await req.json();
  if (!id || status !== "REJECTED") return NextResponse.json({ error: "Eksik veya hatalı veri" }, { status: 400 });
  // Sadece kendi randevusunu iptal edebilsin
  const appointment = await prisma.appointment.findUnique({ where: { id: Number(id) } });
  if (!appointment || appointment.userId !== userId) {
    return NextResponse.json({ error: "Bu randevuyu iptal etme yetkiniz yok." }, { status: 403 });
  }
  await prisma.appointment.update({ where: { id: Number(id) }, data: { status: "REJECTED" } });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const userId = getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ error: "Kimlik doğrulama gerekli" }, { status: 401 });
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Eksik id" }, { status: 400 });
  // Sadece kendi randevusunu silebilsin
  const appointment = await prisma.appointment.findUnique({ where: { id: Number(id) } });
  if (!appointment || appointment.userId !== userId) {
    return NextResponse.json({ error: "Bu randevuyu silme yetkiniz yok." }, { status: 403 });
  }
  await prisma.appointment.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
} 