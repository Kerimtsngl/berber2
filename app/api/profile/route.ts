import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { updateProfile } from "../../actions/authActions";
import path from "path";
import fs from "fs";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const token = auth.replace("Bearer ", "");
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Geçersiz token" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { id: payload.id } });
  if (!user) return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
  return NextResponse.json({ name: user.name, email: user.email, phone: user.phone, profileImage: user.profileImage, role: user.role });
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const token = auth.replace("Bearer ", "");
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Geçersiz token" }, { status: 401 });

  const formData = await req.formData();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  let profileImageUrl: string | undefined = undefined;
  const file = formData.get("profileImage");
  if (file && typeof file === "object" && "arrayBuffer" in file) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `profile_${payload.id}_${Date.now()}.jpg`;
    const uploadPath = path.join(process.cwd(), "public", "uploads", filename);
    fs.mkdirSync(path.dirname(uploadPath), { recursive: true });
    fs.writeFileSync(uploadPath, buffer);
    profileImageUrl = `/uploads/${filename}`;
  }
  try {
    await updateProfile(payload.id, name, email, phone, profileImageUrl);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
} 