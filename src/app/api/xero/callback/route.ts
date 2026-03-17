import { NextRequest, NextResponse } from 'next/server';
import { xero } from '@/lib/xero';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'No authorization code provided' }, { status: 400 });
  }

  try {
    const tokenSet = await xero.apiCallback(request.url);
    
    // For now, we'll log the success. 
    // In a real implementation, you would store these tokens in a secure database
    // linked to the user or organization.
    console.log('[Xero Callback] Successfully authenticated');
    
    // Redirect back to settings with a success flag
    return NextResponse.redirect(new URL('/settings?xero=success', request.url));
  } catch (error) {
    console.error('[Xero Callback] Error exchanging code for tokens:', error);
    return NextResponse.redirect(new URL('/settings?xero=error', request.url));
  }
}
