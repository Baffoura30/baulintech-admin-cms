import nodemailer from 'nodemailer';
import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';
import { supabase } from './supabase';

// SMTP Configuration
const smtpConfig = {
  host: process.env.EMAIL_SMTP_HOST || 'mail.baulin.co.uk',
  port: parseInt(process.env.EMAIL_SMTP_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
};

// IMAP Configuration
const imapConfig = {
  host: process.env.EMAIL_IMAP_HOST || 'mail.baulin.co.uk',
  port: parseInt(process.env.EMAIL_IMAP_PORT || '993'),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  },
  logger: false,
};

export async function sendEmail({ to, subject, body, clientId, leadId }: { to: string; subject: string; body: string; clientId?: string; leadId?: string }) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Email credentials not configured");
  }

  const transporter = nodemailer.createTransport(smtpConfig);

  const info = await transporter.sendMail({
    from: `"Baulin Technologies" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: body,
  });

  if (clientId || leadId) {
    await supabase.from('messages').insert([{
      client_id: clientId || null,
      lead_id: leadId || null,
      direction: 'outbound',
      sender: process.env.EMAIL_USER,
      recipient: to,
      subject,
      body,
      raw_id: info.messageId,
    }]);

    await supabase.from('activity_log').insert([{
      entity_type: clientId ? 'Client' : 'Lead',
      entity_id: clientId || leadId,
      action: 'email_sent',
      details: { subject, to }
    }]);
  }

  return info;
}

export async function syncClientEmails(clientEmail: string, clientId?: string, leadId?: string) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Email credentials not configured");
  }

  const client = new ImapFlow({
    ...imapConfig,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    logger: false as any
  });

  await client.connect();

  try {
    let lock = await client.getMailboxLock('INBOX');
    try {
      const messages = await client.fetch({ from: clientEmail }, { 
        source: true 
      });

      for await (let msg of messages) {
        if (!msg.source) continue;

        const parsed: any = await simpleParser(msg.source);
        const raw_id = parsed.messageId;
        
        const { data: exists } = await supabase
          .from('messages')
          .select('id')
          .eq('raw_id', raw_id)
          .single();

        if (!exists) {
          await supabase.from('messages').insert([{
            client_id: clientId || null,
            lead_id: leadId || null,
            direction: 'inbound',
            sender: clientEmail,
            recipient: process.env.EMAIL_USER,
            subject: parsed.subject,
            body: parsed.html || parsed.text || "No content",
            raw_id: raw_id,
            created_at: parsed.date || new Date(),
          }]);

          await supabase.from('activity_log').insert([{
            entity_type: clientId ? 'Client' : 'Lead',
            entity_id: clientId || leadId,
            action: 'email_received',
            details: { subject: parsed.subject }
          }]);
        }
      }
    } finally {
      lock.release();
    }
  } finally {
    await client.logout();
  }
}
