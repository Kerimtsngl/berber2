import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "../../../actions/authActions";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  try {
    const { user, token } = await loginUser(email, password);
    return NextResponse.json({ user, token }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
} 