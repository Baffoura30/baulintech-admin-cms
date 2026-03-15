-- Supabase Database Schema for Baulin Admin Dashboard CRM

-- 1. Clients Table
CREATE TABLE public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    business_type TEXT,
    stage TEXT NOT NULL DEFAULT 'enquiry',
    tier TEXT,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    xero_contact_id TEXT,
    monthly_rate NUMERIC,
    domain TEXT,
    notes TEXT,
    edit_requests_used INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Projects Table (Kanban Pipeline)
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    tier TEXT,
    pipeline_stage TEXT NOT NULL DEFAULT 'brief',
    due_date DATE,
    priority TEXT DEFAULT 'normal',
    repo_url TEXT,
    preview_url TEXT,
    live_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tickets Table (Support & Edits)
CREATE TABLE public.tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    priority TEXT DEFAULT 'normal',
    status TEXT DEFAULT 'open',
    subject TEXT NOT NULL,
    description TEXT,
    internal_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    first_response_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ
);

-- 4. Invoices Table (Stripe / Xero sync tracking)
CREATE TABLE public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    xero_invoice_id TEXT,
    stripe_invoice_id TEXT,
    amount NUMERIC NOT NULL,
    type TEXT,
    status TEXT DEFAULT 'draft',
    due_date DATE,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Activity Log
CREATE TABLE public.activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT,
    entity_id UUID,
    action TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS but since NextAuth is used on the server, 
-- no public access policies are created. Service Role will bypass this.
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
