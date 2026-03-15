"use client";

import { Receipt, FileText, Send } from "lucide-react";

export default function InvoicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Xero Invoicing</h1>
          <p className="text-sm text-gray-400">Generate and track Xero invoices from project milestones</p>
        </div>
        <button className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors">
          <FileText className="w-4 h-4" />
          Create Ad-hoc Invoice
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/10 flex gap-4">
          <button className="text-sm font-medium text-white pb-4 border-b-2 border-baulin-gold">All</button>
          <button className="text-sm font-medium text-gray-500 pb-4 border-b-2 border-transparent">Draft</button>
          <button className="text-sm font-medium text-gray-500 pb-4 border-b-2 border-transparent">Sent</button>
          <button className="text-sm font-medium text-gray-500 pb-4 border-b-2 border-transparent">Paid</button>
        </div>
        
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-black/40 text-xs uppercase text-gray-500 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-medium">Invoice #</th>
              <th className="px-6 py-4 font-medium">Client</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Amount</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr className="hover:bg-white/[0.02]">
              <td className="px-6 py-4 font-mono text-gray-400">INV-0001</td>
              <td className="px-6 py-4 font-medium text-white">Local Plumbers</td>
              <td className="px-6 py-4">Oct 12, 2025</td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  Draft
                </span>
              </td>
              <td className="px-6 py-4 text-right font-medium text-white">£450.00</td>
              <td className="px-6 py-4 text-right">
                <button className="text-baulin-gold hover:text-white transition-colors" title="Send via Xero">
                  <Send className="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
