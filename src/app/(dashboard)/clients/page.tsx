"use client";

import Link from "next/link";
import { Plus, Search, MoreVertical } from "lucide-react";
import StatusPill from "@/components/ui/StatusPill";

// Placeholder data matching the DB schema
const mockClients = [
  { id: "1", businessName: "Acme Legal", contactName: "John Doe", email: "john@acmelegal.com", stage: "active", tier: "Authority", mrr: 299 },
  { id: "2", businessName: "Summit Accountants", contactName: "Jane Smith", email: "jane@summit.co.uk", stage: "onboarding", tier: "Presence", mrr: 99 },
  { id: "3", businessName: "Peak Consultants", contactName: "Bob Ross", email: "bob@peak.com", stage: "enquiry", tier: null, mrr: 0 },
  { id: "4", businessName: "Local Plumbers", contactName: "Phil Fixit", email: "phil@local.com", stage: "at_risk", tier: "Presence", mrr: 99 },
];

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Clients</h1>
          <p className="text-sm text-gray-400">Manage all your contacts and active subscribers</p>
        </div>
        <Link 
          href="/clients/new" 
          className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Client
        </Link>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm">
        {/* Toolbar */}
        <div className="p-4 border-b border-white/10 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search clients..." 
              className="w-full bg-black/50 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-baulin-gold"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-black/40 text-xs uppercase text-gray-500 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-medium">Business / Contact</th>
                <th className="px-6 py-4 font-medium">Stage</th>
                <th className="px-6 py-4 font-medium">Tier</th>
                <th className="px-6 py-4 font-medium text-right">MRR</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockClients.map((client) => (
                <tr key={client.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <Link href={`/clients/${client.id}`} className="block">
                      <div className="font-semibold text-white group-hover:text-baulin-gold transition-colors">{client.businessName}</div>
                      <div className="text-xs text-gray-500">{client.contactName} • {client.email}</div>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <StatusPill status={client.stage as any} />
                  </td>
                  <td className="px-6 py-4">
                    {client.tier ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white/5 border border-white/10 text-gray-300">
                        {client.tier}
                      </span>
                    ) : (
                      <span className="text-gray-600">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-gray-200">
                    {client.mrr > 0 ? `£${client.mrr}` : "-"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-500 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
      </div>
    </div>
  );
}
