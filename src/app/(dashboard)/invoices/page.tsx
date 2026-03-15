"use client";

import { Receipt, FileText, Send, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";


interface Invoice {
  id: string;
  client_name: string;
  amount: number;
  status: string;
  due_at: string;
  invoice_number: string;
}

export default function InvoicesPage() {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    async function fetchInvoices() {
      try {
        const { data, error } = await supabase
          .from('invoices')
          .select('*')
          .order('due_at', { ascending: false });

        if (error) throw error;
        setInvoices(data || []);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchInvoices();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-gray-400 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-baulin-gold" />
        <p className="animate-pulse">Accessing Xero linked invoices...</p>
      </div>
    );
  }

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
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300 min-w-[800px]">
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
              {invoices.length > 0 ? (
                invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/[0.02] group">
                    <td className="px-6 py-4 font-mono text-gray-400 group-hover:text-baulin-gold transition-colors">{inv.invoice_number}</td>
                    <td className="px-6 py-4 font-medium text-white">{inv.client_name}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(inv.due_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                        inv.status === 'paid' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                        inv.status === 'sent' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                        'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-white">£{inv.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-baulin-gold hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded-md" title="Send via Xero">
                        <Send className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-gray-600 italic">
                    <Receipt className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    No invoices recorded in the system yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
