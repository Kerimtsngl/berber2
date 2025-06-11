import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../../../lib/auth";
import { changePassword } from "../../../actions/authActions";

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const token = auth.replace("Bearer ", "");
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Geçersiz token" }, { status: 401 });
  const { currentPassword, newPassword } = await req.json();
  try {
    await changePassword(payload.id, currentPassword, newPassword);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
} 