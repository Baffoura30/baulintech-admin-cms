import { NextResponse } from 'next/server';
import { xero } from '@/lib/xero';

export async function GET() {
  try {
    const consentUrl = await xero.buildConsentUrl();
    return NextResponse.redirect(consentUrl);
  } catch (error) {
    console.error('[Xero Auth] Error generating consent URL:', error);
    return NextResponse.json({ error: 'Failed to initialize Xero authentication' }, { status: 500 });
  }
}
