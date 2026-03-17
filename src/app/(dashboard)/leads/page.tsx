"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Users, 
  Search, 
  MoreVertical, 
  Mail, 
  Building2, 
  CheckCircle2, 
  Clock,
  UserPlus
} from "lucide-react";
import Link from "next/link";
import StatusPill from "@/components/ui/StatusPill";
import clsx from "clsx";
import { useToast } from "@/components/ui/Toast";
import MessagingTab from "@/components/clients/MessagingTab";

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    try {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (err) {
      console.error("Error fetching leads:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
      setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const { showToast } = useToast();

  const convertToClient = async (lead: any) => {
    try {
      // 1. Insert into profiles
      const { data: newProfile, error: clientError } = await supabase
        .from("profiles")
        .insert([{
          full_name: lead.full_name,
          business_name: lead.business_name,
          email: lead.email,
          role: "client"
        }])
        .select('id')
        .single();

      if (clientError) throw clientError;

      // Create subscription if tier interest exists
      if (lead.tier_interest && newProfile?.id) {
        const tierAmounts: Record<string, number> = { Presence: 99, Authority: 199, Prestige: 349 };
        await supabase.from("client_subscriptions").insert([{
          profile_id: newProfile.id,
          tier: lead.tier_interest,
          monthly_amount: tierAmounts[lead.tier_interest] || 0,
          status: "onboarding",
        }]);
      }

      // 2. Update lead status
      await handleStatusUpdate(lead.id, "replied");
      
      // 3. Log activity
      await supabase.from("activity_log").insert([{
        entity_type: "Lead",
        action: "converted_to_client",
        details: { business: lead.business_name, customer: lead.full_name }
      }]);

      showToast(`Successfully converted ${lead.business_name} to a client!`, "success");
      fetchLeads();
    } catch (err: any) {
      console.error("Error converting lead:", err);
      showToast("Failed to convert lead: " + err.message, "error");
    }
  };

  const filteredLeads = leads.filter(lead => 
    lead.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [selectedLead, setSelectedLead] = useState<any>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Website Enquiries</h1>
          <p className="text-sm text-gray-400">Incoming leads from the marketing site</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className={clsx("transition-all duration-500", selectedLead ? "xl:col-span-1" : "xl:col-span-3")}>
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
            {/* Search Header */}
            <div className="p-4 border-b border-white/10 flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Search enquiries..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-baulin-gold"
                />
              </div>
            </div>

            {/* Table/List */}
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-12 text-center text-gray-500">Loading enquiries...</div>
              ) : filteredLeads.length === 0 ? (
                <div className="p-12 text-center text-gray-500">No leads found.</div>
              ) : (
                <table className="w-full text-left text-sm text-gray-300">
                  <thead className="bg-black/40 text-xs uppercase text-gray-500 border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4 font-medium">Customer</th>
                      {!selectedLead && <th className="px-6 py-4 font-medium">Package</th>}
                      {!selectedLead && <th className="px-6 py-4 font-medium">Status</th>}
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredLeads.map((lead) => (
                      <tr 
                        key={lead.id} 
                        onClick={() => setSelectedLead(lead)}
                        className={clsx(
                          "hover:bg-white/[0.02] transition-colors group cursor-pointer",
                          selectedLead?.id === lead.id && "bg-white/[0.05]"
                        )}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-baulin-gold/10 text-baulin-gold flex items-center justify-center font-bold text-xs border border-baulin-gold/20">
                              {lead.full_name?.charAt(0)}
                            </div>
                            <div>
                              <div className="font-semibold text-white truncate max-w-[120px]">{lead.full_name}</div>
                              <div className="text-[10px] text-gray-500">{lead.business_name}</div>
                            </div>
                          </div>
                        </td>
                        {!selectedLead && (
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white/5 border border-white/10 text-gray-400">
                              {lead.tier_interest || "General"}
                            </span>
                          </td>
                        )}
                        {!selectedLead && (
                          <td className="px-6 py-4">
                            <span className={clsx(
                              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                              lead.status === "new" ? "bg-baulin-gold/20 text-baulin-gold border border-baulin-gold/10" : "bg-white/5 text-gray-500 border border-white/10"
                            )}>
                              {lead.status}
                            </span>
                          </td>
                        )}
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={(e) => { e.stopPropagation(); convertToClient(lead); }}
                            className="p-1.5 rounded-lg bg-baulin-gold/10 text-baulin-gold border border-baulin-gold/20 hover:bg-baulin-gold/20 transition-colors"
                          >
                            <UserPlus className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {selectedLead && (
          <div className="xl:col-span-2 space-y-6 animate-in slide-in-from-right-4 duration-500">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative">
              <button 
                onClick={() => setSelectedLead(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white"
              >
                ✕
              </button>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Initial Enquiry</h3>
              <div className="p-4 bg-black/40 border border-white/5 rounded-xl mb-6">
                <p className="text-sm text-gray-300 leading-relaxed italic">"{selectedLead.message}"</p>
                <div className="mt-4 text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
                  Email: {selectedLead.email} | Package: {selectedLead.tier_interest}
                </div>
              </div>
              
              <MessagingTab clientId={selectedLead.id} clientEmail={selectedLead.email} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
