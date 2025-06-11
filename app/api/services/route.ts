import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export async function GET(req: NextRequest) {
  const services = await prisma.service.findMany();
  return NextResponse.json(services);
} 