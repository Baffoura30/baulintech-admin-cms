# Baulin Admin CMS

Internal Operations & CRM dashboard for Baulin Technologies.

**Live URL:** [cms.baulin.co.uk](https://cms.baulin.co.uk)
**GitHub:** [Baffoura30/baulintech-admin-cms](https://github.com/Baffoura30/baulintech-admin-cms)

---

## Platform Architecture

This is one of two repositories that together form the full Baulin Technologies platform. Both repos share a single Supabase instance.

| Repo | Purpose | URL |
|------|---------|-----|
| **`baulintech`** | Marketing site, client dashboard, public blog/portfolio | [baulin.co.uk](https://baulin.co.uk) |
| **This repo** — `baulintech-admin-cms` | Internal CRM, content management, ops dashboard | [cms.baulin.co.uk](https://cms.baulin.co.uk) |

### How they connect

- **Contact form leads** → submitted via main site → appear instantly in Admin CMS (`contact_submissions` table)
- **Blog, FAQ, Portfolio, Pricing, Testimonials** → managed here → read by main site via Supabase
- **Client projects & milestones** → managed here → visible in client dashboard (`/dashboard` on main site)
- **Support tickets** → created by clients on main site → managed here

### Auth differences

| Repo | Auth method |
|------|------------|
| `baulintech` | Supabase Auth (email/password + Google OAuth) |
| **This repo** | NextAuth.js with hardcoded admin session (`id: "admin-1"`) + Supabase service role key |

---

## Tech Stack

- **Framework:** Next.js 14 App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL, accessed via service role key — bypasses RLS)
- **Auth:** NextAuth.js (not Supabase Auth)
- **Payments:** Stripe
- **Email:** Resend
- **Accounting:** Xero integration

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

Create `.env.local` with the following:

```env
# NextAuth
NEXTAUTH_URL=https://cms.baulin.co.uk
NEXTAUTH_SECRET=

# Supabase (shared with main site — use service role key)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Resend
RESEND_API_KEY=
CONTACT_EMAIL=hello@baulin.co.uk

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Xero (accounting integration)
XERO_CLIENT_ID=
XERO_CLIENT_SECRET=
XERO_REDIRECT_URI=https://cms.baulin.co.uk/api/xero/callback

# Email server (SMTP/IMAP for mirrored email)
EMAIL_SMTP_HOST=
EMAIL_SMTP_PORT=
EMAIL_IMAP_HOST=
EMAIL_IMAP_PORT=
EMAIL_USER=
EMAIL_PASS=

# Admin credentials
ADMIN_EMAIL=
ADMIN_PASSWORD_HASH=

# Admin profile UUID (from profiles table — used as sender_id for messages)
# SQL to get: SELECT id FROM profiles WHERE role = 'admin' LIMIT 1;
ADMIN_PROFILE_ID=

# GA4
GA4_PROPERTY_ID=
```

---

## Related Repo

Main site: [github.com/Baffoura30/baulintech](https://github.com/Baffoura30/baulintech)
