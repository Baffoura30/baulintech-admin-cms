import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

    const emailMatch = email?.trim().toLowerCase() === adminEmail?.trim().toLowerCase();
    const passwordMatch = adminPasswordHash ? await bcrypt.compare(password, adminPasswordHash.trim()) : false;

    return NextResponse.json({
      received: { email, passwordLength: password?.length },
      env: { 
        adminEmail, 
        hash: adminPasswordHash,
        hashLength: adminPasswordHash?.length
      },
      results: { emailMatch, passwordMatch }
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
