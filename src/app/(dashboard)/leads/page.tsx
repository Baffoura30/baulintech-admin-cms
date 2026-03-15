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
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import StatusPill from "@/components/ui/StatusPill";
import clsx from "clsx";

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

  const convertToClient = async (lead: any) => {
    try {
      // 1. Insert into clients
      const { error: clientError } = await supabase
        .from("clients")
        .insert([{
          business_name: lead.business_name,
          contact_name: lead.full_name,
          email: lead.email,
          business_type: lead.business_type,
          tier: lead.tier_interest,
          stage: "onboarding"
        }]);

      if (clientError) throw clientError;

      // 2. Update lead status
      await handleStatusUpdate(lead.id, "replied");
      
      alert(`Successfully converted ${lead.business_name} to a client!`);
      fetchLeads();
    } catch (err: any) {
      console.error("Error converting lead:", err);
      alert("Failed to convert lead: " + err.message);
    }
  };

  const filteredLeads = leads.filter(lead => 
    lead.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Website Enquiries</h1>
          <p className="text-sm text-gray-400">Incoming leads from the marketing site</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
        {/* Search Header */}
        <div className="p-4 border-b border-white/10 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
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
                  <th className="px-6 py-4 font-medium">Customer Details</th>
                  <th className="px-6 py-4 font-medium">Package Interest</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-baulin-gold/10 text-baulin-gold flex items-center justify-center font-bold text-xs border border-baulin-gold/20">
                          {lead.full_name?.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{lead.full_name}</div>
                          <div className="text-[10px] text-gray-500 flex items-center gap-1">
                            <Building2 className="w-3 h-3" /> {lead.business_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white/5 border border-white/10 text-gray-400">
                        {lead.tier_interest || "General"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={clsx(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                        lead.status === "new" ? "bg-baulin-gold/20 text-baulin-gold border border-baulin-gold/10" : "bg-white/5 text-gray-500 border border-white/10"
                      )}>
                        {lead.status === "new" && <Clock className="w-3 h-3" />}
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => convertToClient(lead)}
                          className="p-1.5 rounded-lg bg-baulin-gold/10 text-baulin-gold border border-baulin-gold/20 hover:bg-baulin-gold/20 transition-colors"
                          title="Convert to Client"
                        >
                          <UserPlus className="w-4 h-4" />
                        </button>
                        <button className="text-gray-500 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Detail View / Selection - Optional expanded feature */}
      {filteredLeads.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Latest Message</h3>
            <div className="p-4 bg-black/40 border border-white/5 rounded-xl">
              <p className="text-sm text-gray-300 leading-relaxed italic">
                "{filteredLeads[0].message}"
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                <span className="text-xs text-gray-500 font-medium">{filteredLeads[0].email}</span>
                <a 
                  href={`mailto:${filteredLeads[0].email}`}
                  className="text-[10px] text-baulin-gold hover:text-white transition-colors flex items-center gap-1 font-bold uppercase tracking-wider"
                >
                  <Mail className="w-3 h-3" /> Reply Now
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
