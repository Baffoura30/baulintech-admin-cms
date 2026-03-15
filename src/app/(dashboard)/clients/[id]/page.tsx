"use client";

import Link from "next/link";
import { ArrowLeft, Edit3, Mail, Phone, Globe, CreditCard } from "lucide-react";
import StatusPill from "@/components/ui/StatusPill";

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  // Database placeholder
  const client = {
    id: params.id,
    businessName: "Acme Solicitors LTD",
    contactName: "John Doe",
    email: "john@acmelegal.com",
    phone: "+44 7123 456789",
    businessType: "Lawyer",
    stage: "active",
    tier: "Authority",
    stripe_subscription_id: "sub_1Nxyz...",
    domain: "acmelegal.com",
    monthlyRate: 199,
    edit_requests_used: 2,
    edit_limit: 5,
    notes: "Client is very particular about typography. Use Times New Roman where possible.",
    created_at: "Oct 12, 2025"
  };

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/clients" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold font-display text-white">{client.businessName}</h1>
              <StatusPill status={client.stage as any} />
            </div>
            <p className="text-sm text-gray-400">Client since {client.created_at}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            <Edit3 className="w-4 h-4" />
            Edit Info
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Contact & CRM details) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Contact Details</h3>
            <div className="space-y-4 text-sm text-gray-300">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-md text-gray-400"><Mail className="w-4 h-4"/></div>
                <a href={`mailto:${client.email}`} className="hover:text-baulin-gold transition-colors">{client.email}</a>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-md text-gray-400"><Phone className="w-4 h-4"/></div>
                <a href={`tel:${client.phone}`} className="hover:text-baulin-gold transition-colors">{client.phone}</a>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-md text-gray-400"><Globe className="w-4 h-4"/></div>
                <a href={`https://${client.domain}`} target="_blank" className="hover:text-baulin-gold transition-colors">{client.domain}</a>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Subscription Overview</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Current Plan</p>
                <p className="text-sm font-medium text-white">{client.tier} (£{client.monthlyRate}/mo)</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Stripe Subscription</p>
                <div className="flex items-center gap-2 text-sm text-gray-300 font-mono">
                  <CreditCard className="w-4 h-4 text-gray-500"/>
                  {client.stripe_subscription_id}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Monthly Edits Used</p>
                <div className="w-full h-2 bg-white/10 rounded-full mt-2 overflow-hidden">
                  <div 
                    className={`h-full ${client.edit_requests_used >= client.edit_limit ? "bg-red-500" : "bg-baulin-gold"}`} 
                    style={{ width: `${(client.edit_requests_used / client.edit_limit) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1 text-right">{client.edit_requests_used} of {client.edit_limit} updates</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Notes & Onboarding & Tickets) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-black/50 border border-white/10 rounded-xl p-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Internal Notes</h3>
            <p className="text-sm text-gray-300 whitespace-pre-wrap">{client.notes}</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Ticket History</h3>
              <button className="text-xs font-medium text-baulin-gold hover:text-white transition-colors">View All</button>
            </div>
            <div className="text-sm text-gray-500 py-8 text-center border border-dashed border-white/10 rounded-lg">
              No recent support or edit tickets for this client.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
