import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    adminEmail: process.env.ADMIN_EMAIL,
    hasHash: !!process.env.ADMIN_PASSWORD_HASH,
    nextAuthUrl: process.env.NEXTAUTH_URL,
    env: process.env.NODE_ENV,
  });
}
