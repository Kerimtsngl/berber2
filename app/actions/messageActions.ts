import { prisma } from "../../lib/prisma";

export async function sendMessage(senderId: number, receiverId: number, content: string) {
  return await prisma.message.create({
    data: { senderId, receiverId, content },
  });
}

export async function getUserMessages(userId: number) {
  return await prisma.message.findMany({
    where: { receiverId: userId },
    include: { sender: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllMessages() {
  return await prisma.message.findMany({ include: { sender: true, receiver: true }, orderBy: { createdAt: "desc" } });
}

export async function deleteMessage(id: number) {
  return await prisma.message.delete({ where: { id } });
} 