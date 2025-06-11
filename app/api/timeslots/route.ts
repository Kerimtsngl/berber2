import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

// Her gün için 09:00-19:00 arası 30 dakikalık slotları üretir
function generateSlots(date: Date) {
  const slots = [];
  const startHour = 9;
  const endHour = 19;
  for (let hour = startHour; hour < endHour; hour++) {
    for (let min = 0; min < 60; min += 30) {
      const start = new Date(date);
      start.setHours(hour, min, 0, 0);
      const end = new Date(start);
      end.setMinutes(start.getMinutes() + 30);
      slots.push({ start, end });
    }
  }
  return slots;
}

export async function GET(req: NextRequest) {
  // ?date=2024-06-01 gibi bir parametre ile istenirse o günün slotlarını döner
  const { searchParams } = new URL(req.url);
  const dateStr = searchParams.get("date");
  const date = dateStr ? new Date(dateStr) : new Date();
  date.setHours(0, 0, 0, 0);

  // O günün slotlarını üret
  const slots = generateSlots(date);

  // O günün mevcut randevularını çek
  const startOfDay = new Date(date);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  const appointments = await prisma.appointment.findMany({
    where: {
      timeSlot: {
        start: { gte: startOfDay, lte: endOfDay },
      },
    },
    include: { timeSlot: true },
  });

  // Slotların dolu olup olmadığını işaretle
  const result = slots.map((slot) => {
    const isBooked = appointments.some((a) =>
      new Date(a.timeSlot.start).getTime() === slot.start.getTime()
    );
    return {
      id: slot.start.getTime(), // benzersiz id olarak timestamp
      start: slot.start,
      end: slot.end,
      isBooked,
    };
  });

  return NextResponse.json(result);
} 