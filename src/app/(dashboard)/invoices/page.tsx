"use client";

import { Receipt, FileText, Send, Loader2, Plus } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/Toast";
import Modal from "@/components/ui/Modal";

interface Invoice {
  id: string;
  client_name: string;
  amount: number;
  status: string;
  due_at: string;
  invoice_number: string;
}

interface Client {
  id: string;
  business_name: string;
  full_name: string;
}

export default function InvoicesPage() {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [activeTab, setActiveTab] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    clientId: "",
    amount: "",
    invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
    status: "draft"
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [invRes, clientRes] = await Promise.all([
          supabase.from('invoices').select('*').order('due_at', { ascending: false }),
          supabase.from('profiles').select('id, business_name, full_name').eq('role', 'client').order('business_name')
        ]);

        if (invRes.error) throw invRes.error;
        if (clientRes.error) throw clientRes.error;

        setInvoices(invRes.data || []);
        setClients(clientRes.data || []);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        showToast("Failed to fetch data: " + error.message, "error");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [showToast]);

  const filteredInvoices = useMemo(() => {
    if (activeTab === "All") return invoices;
    return invoices.filter(inv => inv.status.toLowerCase() === activeTab.toLowerCase());
  }, [invoices, activeTab]);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientId || !formData.amount) {
      showToast("Please fill in all required fields", "info");
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedClient = clients.find(c => c.id === formData.clientId);
      
      const { data, error } = await supabase.from('invoices').insert([{
        client_id: formData.clientId,
        client_name: selectedClient?.business_name || selectedClient?.full_name,
        amount: parseFloat(formData.amount),
        status: formData.status,
        invoice_number: formData.invoiceNumber,
        due_at: new Date().toISOString()
      }]).select();

      if (error) throw error;

      showToast("Invoice created successfully", "success");
      setInvoices([data[0], ...invoices]);
      setIsModalOpen(false);
      setFormData({
        clientId: "",
        amount: "",
        invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
        status: "draft"
      });
    } catch (error: any) {
      showToast("Error creating invoice: " + error.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-gray-400 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-baulin-gold" />
        <p className="animate-pulse">Accessing Xero linked invoices...</p>
      </div>
    );
  }

  const tabs = ["All", "Draft", "Sent", "Paid"];

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Xero Invoicing</h1>
          <p className="text-sm text-gray-400">Generate and track Xero invoices from project milestones</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Ad-hoc Invoice
        </button>
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
        
        <div className="overflow-x-auto scroller-hide">
          <table className="w-full text-left text-sm text-gray-300 min-w-[800px]">
            <thead className="bg-white/[0.02] text-xs uppercase text-gray-500 border-b border-white/10">
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
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/[0.02] group transition-colors">
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
                      <button 
                        onClick={() => showToast("Xero sync coming soon", "info")}
                        className="text-baulin-gold hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded-md" 
                        title="Send via Xero"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-gray-600 italic">
                    <Receipt className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    No invoices found for this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Create Ad-hoc Invoice"
      >
        <form onSubmit={handleCreateInvoice} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Select Client</label>
            <select 
              value={formData.clientId}
              onChange={(e) => setFormData({...formData, clientId: e.target.value})}
              className="w-full bg-baulin-dark border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-baulin-gold"
              required
            >
              <option value="">Choose a client...</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.business_name || client.full_name}</option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Amount (£)</label>
              <input 
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="w-full bg-baulin-dark border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-baulin-gold"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Invoice #</label>
              <input 
                type="text"
                value={formData.invoiceNumber}
                readOnly
                className="w-full bg-baulin-dark border border-white/10 rounded-lg px-4 py-2 text-gray-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Initial Status</label>
            <div className="flex gap-2">
              {['draft', 'sent', 'paid'].map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFormData({...formData, status: s})}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase border transition-all ${
                    formData.status === s ? 'bg-baulin-gold/20 border-baulin-gold text-baulin-gold shadow-lg shadow-baulin-gold/10' : 'bg-transparent border-white/10 text-gray-500 hover:border-white/20'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
              Generate Invoice
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
