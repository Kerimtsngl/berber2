import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "../../../actions/authActions";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "E-posta ve şifre gerekli" }, { status: 400 });
    }
    const { user, token } = await loginUser(email, password);
    return NextResponse.json({ user, token }, { status: 200 });
  } catch (e: any) {
    console.error("Login error:", e);
    return NextResponse.json({ error: e.message || "Giriş yapılamadı" }, { status: 400 });
  }
} 