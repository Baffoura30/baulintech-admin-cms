"use client";

import Link from "next/link";
import { Plus, Search, MoreVertical } from "lucide-react";
import StatusPill from "@/components/ui/StatusPill";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*, client_subscriptions(tier, status, monthly_amount)")
        .eq("role", "client")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (err) {
      console.error("Error fetching clients:", err);
    } finally {
      setLoading(false);
    }
  }

  const filteredClients = clients.filter(client =>
    client.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-baulin-gold"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading clients...</div>
          ) : filteredClients.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No clients found matching your search.</div>
          ) : (
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
                {filteredClients.map((client) => {
                  const sub = client.client_subscriptions?.[0];
                  return (
                  <tr key={client.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <Link href={`/clients/${client.id}`} className="block">
                        <div className="font-semibold text-white group-hover:text-baulin-gold transition-colors">{client.business_name || client.full_name}</div>
                        <div className="text-xs text-gray-500">{client.full_name} • {client.email}</div>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill status={(sub?.status || 'pending') as any} />
                    </td>
                    <td className="px-6 py-4">
                      {sub?.tier ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white/5 border border-white/10 text-gray-300">
                          {sub.tier}
                        </span>
                      ) : (
                        <span className="text-gray-600">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-200">
                      {sub?.monthly_amount && sub.monthly_amount > 0 ? `£${sub.monthly_amount}` : "-"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-500 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        
      </div>
    </div>
  );
}
