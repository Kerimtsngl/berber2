import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export async function GET(req: NextRequest) {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      profileImage: true,
    },
  });
  return NextResponse.json(users);
} 