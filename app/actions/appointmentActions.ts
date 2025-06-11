import { prisma } from "../../lib/prisma";
import { addEvent } from "./adminActions";

export async function getAvailableTimeSlots() {
  return await prisma.timeSlot.findMany({ where: { isAvailable: true } });
}

export async function getServices() {
  return await prisma.service.findMany();
}

export async function createAppointment(userId: number, serviceId: number, timeSlotId: number) {
  // timeSlotId artık timestamp olarak geliyor (örn: 1749189600000)
  let slot = await prisma.timeSlot.findFirst({ where: { start: new Date(timeSlotId) } });
  if (!slot) {
    // Slot yoksa oluştur
    const start = new Date(timeSlotId);
    const end = new Date(start);
    end.setMinutes(start.getMinutes() + 30);
    slot = await prisma.timeSlot.create({ data: { start, end, isAvailable: true } });
  }
  if (!slot.isAvailable) throw new Error("Seçilen saat uygun değil.");
  // Randevu oluştur
  const appointment = await prisma.appointment.create({
    data: { userId, serviceId, timeSlotId: slot.id },
  });
  // Zaman dilimini rezerve et
  await prisma.timeSlot.update({ where: { id: slot.id }, data: { isAvailable: false } });
  // Admin paneline event ekle
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user) {
    await addEvent("appointment_created", `${user.name} yeni randevu aldı`, user.id);
  }
  return appointment;
}

export async function getUserAppointments(userId: number) {
  return await prisma.appointment.findMany({
    where: { userId },
    include: { service: true, timeSlot: true },
  });
} 