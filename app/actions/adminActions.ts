import { prisma } from "../../lib/prisma";

export async function listUsers() {
  return await prisma.user.findMany();
}

export async function deleteUser(id: number) {
  return await prisma.user.delete({ where: { id } });
}

export async function changeUserRole(id: number, role: "ADMIN" | "NORMAL") {
  return await prisma.user.update({ where: { id }, data: { role } });
}

export async function addService(name: string, price: number) {
  return await prisma.service.create({ data: { name, price } });
}

export async function deleteService(id: number) {
  return await prisma.service.delete({ where: { id } });
}

export async function addTimeSlot(start: Date, end: Date) {
  return await prisma.timeSlot.create({ data: { start, end } });
}

export async function deleteTimeSlot(id: number) {
  return await prisma.timeSlot.delete({ where: { id } });
}

export async function banUser(id: number) {
  return await prisma.user.update({ where: { id }, data: { isBanned: true } });
}

export async function unbanUser(id: number) {
  return await prisma.user.update({ where: { id }, data: { isBanned: false } });
}

export async function updateService(id: number, name: string, price: number) {
  return await prisma.service.update({ where: { id }, data: { name, price } });
}

export async function addEvent(type: string, message: string, userId?: number) {
  return await prisma.event.create({ data: { type, message, userId } });
}

export async function getLastEvents(limit = 10) {
  return await prisma.event.findMany({ include: { user: true }, orderBy: { createdAt: "desc" }, take: limit });
} 