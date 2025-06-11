import { prisma } from "../lib/prisma";
import { hashPassword, comparePassword, generateToken } from "../lib/auth";
import { addEvent } from "./adminActions";

export async function registerUser(name: string, email: string, password: string, phone: string) {
  const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { phone }] } });
  if (existing) {
    if (existing.isBanned) throw new Error("Bu e-posta veya telefon engellenmiş. Kayıt olamazsınız.");
    throw new Error("Bu e-posta veya telefon ile zaten kayıtlı bir kullanıcı var.");
  }
  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, password: hashed, phone },
  });
  await addEvent("user_registered", `Yeni kullanıcı kaydı: ${name} (${email})`, user.id);
  return user;
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Kullanıcı bulunamadı.");
  if (user.isBanned) throw new Error("Bu kullanıcı engellenmiş. Giriş yapamazsınız.");
  const valid = await comparePassword(password, user.password);
  if (!valid) throw new Error("Şifre hatalı.");
  const token = generateToken({ id: user.id, role: user.role });
  return { user, token };
}

export async function updateProfile(id: number, name: string, email: string, phone: string, profileImage?: string) {
  return await prisma.user.update({ where: { id }, data: { name, email, phone, ...(profileImage ? { profileImage } : {}) } });
}

export async function changePassword(id: number, currentPassword: string, newPassword: string) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error("Kullanıcı bulunamadı.");
  const valid = await comparePassword(currentPassword, user.password);
  if (!valid) throw new Error("Mevcut şifre hatalı.");
  const isSame = await comparePassword(newPassword, user.password);
  if (isSame) throw new Error("Yeni şifre mevcut şifre ile aynı olamaz.");
  const hashed = await hashPassword(newPassword);
  await prisma.user.update({ where: { id }, data: { password: hashed } });
  return true;
} 