# Baulin Admin CMS

This is the internal Operations & CRM dashboard for Baulin Technologies.

## Platform Architecture

This project is part of a dual-platform system linked by a **Shared Supabase Backend**.

- **Main Site:** [baulin.co.uk](https://baulin.co.uk) (Marketing & Lead Gen)
- **Admin CMS:** [cms.baulin.co.uk](https://cms.baulin.co.uk) (Internal CRM & Ops)

### Integration & Data Flow
Both applications connect to the same Supabase instance. This allows for:
- **Instant CRM Alerts:** When a lead is submitted on the main site, it appears immediately in the Admin CMS.
- **Unified Auth:** Security is managed via Supabase Auth across both platforms.
- **Real-time Sync:** Updates to projects, tickets, or blog posts in this CMS are reflected instantly on the main website.

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
