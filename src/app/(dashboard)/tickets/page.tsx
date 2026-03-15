"use client";

import { LifeBuoy, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import Link from "next/link";

const mockTickets = [
  { id: "TKT-102", client: "Acme Solicitors", subject: "Update team page photos", status: "open", priority: "normal", time: "2 hours ago" },
  { id: "TKT-101", client: "Local Plumbers", subject: "Contact form not sending emails", status: "urgent", priority: "high", time: "5 hours ago" },
  { id: "TKT-100", client: "Peak Consultants", subject: "Change primary brand color to #1A1A1A", status: "resolved", priority: "normal", time: "1 day ago" },
];

export default function TicketsPage() {
  return (
    <div className="space-y-6">
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
          <h3 className="text-3xl font-bold text-white mb-1">4</h3>
          <p className="text-sm text-gray-400">Open Tickets</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mb-3">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">1</h3>
          <p className="text-sm text-gray-400">Urgent</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">12</h3>
          <p className="text-sm text-gray-400">Resolved This Week</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/10 flex gap-4">
          <button className="text-sm font-medium text-white pb-4 border-b-2 border-baulin-gold">All Active</button>
          <button className="text-sm font-medium text-gray-500 pb-4 border-b-2 border-transparent">Design Edits</button>
          <button className="text-sm font-medium text-gray-500 pb-4 border-b-2 border-transparent">Tech Support</button>
          <button className="text-sm font-medium text-gray-500 pb-4 border-b-2 border-transparent">Resolved</button>
        </div>
        
        <div className="divide-y divide-white/5">
          {mockTickets.map((ticket, i) => (
            <div key={i} className="p-4 sm:p-6 hover:bg-white/[0.02] transition-colors flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="flex gap-4 items-start">
                <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${ticket.status === 'urgent' ? 'bg-red-500' : ticket.status === 'resolved' ? 'bg-green-500' : 'bg-blue-500'}`} />
                <div>
                  <h4 className="font-medium text-white text-base mb-1 hover:text-baulin-gold cursor-pointer transition-colors">{ticket.subject}</h4>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                    <span className="font-mono text-gray-500">{ticket.id}</span>
                    <span>•</span>
                    <Link href={`/clients/1`} className="hover:text-white transition-colors">{ticket.client}</Link>
                    <span>•</span>
                    <span>{ticket.time}</span>
                  </div>
                </div>
              </div>
              <button className="text-sm font-medium text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded transition-colors whitespace-nowrap">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
