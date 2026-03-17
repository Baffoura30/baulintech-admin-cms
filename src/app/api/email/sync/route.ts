import { NextResponse } from 'next/server';
import { syncClientEmails } from '@/lib/email';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get('clientId');
    const leadId = searchParams.get('leadId');

    if (!clientId && !leadId) {
      return NextResponse.json({ error: 'Missing identifier' }, { status: 400 });
    }

    let email = '';
    if (clientId) {
      const { data } = await supabase.from('profiles').select('email').eq('id', clientId).single();
      email = data?.email || '';
    } else if (leadId) {
      const { data } = await supabase.from('contact_submissions').select('email').eq('id', leadId).single();
      email = data?.email || '';
    }

    if (!email) {
      return NextResponse.json({ error: 'Entity email not found' }, { status: 404 });
    }

    await syncClientEmails(email, clientId || undefined, leadId || undefined);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Email Sync API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
