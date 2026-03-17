"use client";

import { Plus, Loader2, FolderPlus } from "lucide-react";
import { useState, useEffect } from "react";
import KanbanBoard from "@/components/kanban/KanbanBoard";
import Modal from "@/components/ui/Modal";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/Toast";

interface Client {
  id: string;
  business_name: string;
  full_name: string;
}

export default function PipelinePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    clientId: "",
    priority: "normal",
    tier: "Authority"
  });

  useEffect(() => {
    async function fetchClients() {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, business_name, full_name')
        .eq('role', 'client')
        .order('business_name');

      if (!error) setClients(data || []);
    }
    fetchClients();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.clientId) {
      showToast("Please fill in project name and client", "info");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('client_projects').insert([{
        name: formData.name,
        profile_id: formData.clientId,
        priority: formData.priority,
        tier: formData.tier,
        status: 'brief'
      }]);

      if (error) throw error;

      showToast("Project created successfully", "success");
      setIsModalOpen(false);
      setRefreshKey(prev => prev + 1);
      setFormData({ name: "", clientId: "", priority: "normal", tier: "Authority" });
    } catch (error: any) {
      showToast("Error creating project: " + error.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col space-y-6 text-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Project Pipeline</h1>
          <p className="text-sm text-gray-400">Track and manage active projects across all clients</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        <KanbanBoard key={refreshKey} />
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Start New Project"
      >
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Project Name</label>
            <input 
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-baulin-dark border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-baulin-gold"
              placeholder="e.g. Website Redesign"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Assign Client</label>
            <select 
              value={formData.clientId}
              onChange={(e) => setFormData({...formData, clientId: e.target.value})}
              className="w-full bg-baulin-dark border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-baulin-gold"
              required
            >
              <option value="">Select a client...</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.business_name || client.full_name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Service Tier</label>
              <select 
                value={formData.tier}
                onChange={(e) => setFormData({...formData, tier: e.target.value})}
                className="w-full bg-baulin-dark border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-baulin-gold"
              >
                <option value="Presence">Presence</option>
                <option value="Authority">Authority</option>
                <option value="Prestige">Prestige</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Priority</label>
              <select 
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="w-full bg-baulin-dark border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-baulin-gold"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <FolderPlus className="w-5 h-5" />}
              Launch Project
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
