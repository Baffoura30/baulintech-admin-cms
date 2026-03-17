"use client";

import { LifeBuoy, CheckCircle2, AlertCircle, Clock, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/Toast";

interface Ticket {
  id: string;
  subject: string;
  status: string;
  priority: string;
  category?: string;
  created_at: string;
  profile_id: string;
  profiles?: { full_name: string; business_name: string };
}

export default function TicketsPage() {
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeTab, setActiveTab] = useState("All Active");
  const [stats, setStats] = useState({ open: 0, urgent: 0, resolved: 0 });
  const { showToast } = useToast();

  useEffect(() => {
    async function fetchTickets() {
      try {
        const { data, error } = await supabase
          .from('support_tickets')
          .select('*, profiles(full_name, business_name)')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const ticketData = data || [];
        setTickets(ticketData);

        setStats({
          open: ticketData.filter(t => t.status === 'open').length,
          urgent: ticketData.filter(t => t.priority === 'high' || t.status === 'urgent').length,
          resolved: ticketData.filter(t => t.status === 'resolved').length
        });
      } catch (error: any) {
        console.error("Error fetching tickets:", error);
        showToast("Failed to fetch tickets: " + error.message, "error");
      } finally {
        setLoading(false);
      }
    }

    fetchTickets();
  }, [showToast]);

  const filteredTickets = useMemo(() => {
    if (activeTab === "All Active") return tickets.filter(t => t.status !== 'resolved');
    if (activeTab === "Design Edits") return tickets.filter(t => t.category?.toLowerCase().includes('design') && t.status !== 'resolved');
    if (activeTab === "Tech Support") return tickets.filter(t => t.category?.toLowerCase().includes('tech') && t.status !== 'resolved');
    if (activeTab === "Resolved") return tickets.filter(t => t.status === 'resolved');
    return tickets;
  }, [tickets, activeTab]);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-gray-400 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-baulin-gold" />
        <p className="animate-pulse">Loading support tickets...</p>
      </div>
    );
  }

  const tabs = ["All Active", "Design Edits", "Tech Support", "Resolved"];

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Support Tickets</h1>
          <p className="text-sm text-gray-400">Manage client edit requests and technical support</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">{stats.open}</h3>
          <p className="text-sm text-gray-400">Open Tickets</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mb-3">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">{stats.urgent}</h3>
          <p className="text-sm text-gray-400">Urgent</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">{stats.resolved}</h3>
          <p className="text-sm text-gray-400">Resolved</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm">
        <div className="p-4 border-b border-white/10 flex gap-4 overflow-x-auto scroller-hide">
          {tabs.map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm font-medium pb-4 border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab ? 'text-baulin-gold border-baulin-gold' : 'text-gray-500 border-transparent hover:text-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="divide-y divide-white/5">
          {filteredTickets.length > 0 ? (
            filteredTickets.map((ticket) => (
              <div key={ticket.id} className="p-4 sm:p-6 hover:bg-white/[0.02] transition-colors flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="flex gap-4 items-start">
                  <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${
                    ticket.status === 'urgent' || ticket.priority === 'high' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 
                    ticket.status === 'resolved' ? 'bg-green-500' : 'bg-blue-500'
                  }`} />
                  <div>
                    <h4 className="font-medium text-white text-base mb-1 hover:text-baulin-gold cursor-pointer transition-colors">{ticket.subject}</h4>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                      <span className="font-mono text-gray-500 text-[10px] bg-white/5 px-1.5 py-0.5 rounded uppercase tracking-tighter">#{ticket.id.slice(0, 8)}</span>
                      <span>•</span>
                      <Link href={`/clients/${ticket.profile_id}`} className="hover:text-white transition-colors">{ticket.profiles?.business_name || ticket.profiles?.full_name || 'Individual Client'}</Link>
                      <span>•</span>
                      <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => showToast("Ticket visualization coming soon", "info")}
                  className="text-sm font-medium text-white bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg transition-all active:scale-95"
                >
                  View Details
                </button>
              </div>
            ))
          ) : (
            <div className="py-24 text-center">
              <LifeBuoy className="w-12 h-12 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">No tickets found for this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
