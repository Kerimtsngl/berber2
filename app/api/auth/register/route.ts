import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "../../../actions/authActions";

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();
  try {
    const user = await registerUser(name, email, password);
    return NextResponse.json(user, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
} 