"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Edit3, Mail, Phone, CreditCard, Loader2, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/Toast";
import StatusPill from "@/components/ui/StatusPill";
import MessagingTab from "@/components/clients/MessagingTab";
import clsx from "clsx";

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'messages'>('overview');
  const { showToast } = useToast();

  useEffect(() => {
    async function fetchClientData() {
      try {
        const [clientRes, projectsRes, subRes] = await Promise.all([
          supabase.from('profiles').select('*').eq('id', params.id).single(),
          supabase.from('client_projects').select('*, project_milestones(*)').eq('profile_id', params.id),
          supabase.from('client_subscriptions').select('*').eq('profile_id', params.id).order('created_at', { ascending: false }).limit(1),
        ]);

        if (clientRes.error) throw clientRes.error;

        setClient(clientRes.data);
        setProjects(projectsRes.data || []);
        setSubscription(subRes.data?.[0] || null);
      } catch (error: any) {
        console.error("Error fetching client details:", error);
        showToast("Failed to load client details", "error");
      } finally {
        setLoading(false);
      }
    }

    fetchClientData();
  }, [params.id, showToast]);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-gray-400 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-baulin-gold" />
        <p className="animate-pulse">Retrieving client record...</p>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-gray-400">
        <h2 className="text-xl font-bold text-white mb-2">Client Not Found</h2>
        <p>The requested client record does not exist or has been removed.</p>
        <Link href="/clients" className="mt-4 text-baulin-gold hover:underline">Return to CRM</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/clients" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold font-display text-white">{client.business_name || client.full_name}</h1>
              <StatusPill status={(subscription?.status || 'pending') as any} />
            </div>
            <p className="text-sm text-gray-400">Client ID: <span className="font-mono text-[10px]">{client.id}</span></p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-baulin-gold text-black px-4 py-2 rounded-lg font-bold text-sm hover:bg-white transition-all active:scale-95">
            <Edit3 className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/5 rounded-xl border border-white/10 w-fit">
        <button 
          onClick={() => setActiveTab('overview')}
          className={clsx(
            "px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all",
            activeTab === 'overview' ? "bg-baulin-gold text-black" : "text-gray-400 hover:text-white"
          )}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('messages')}
          className={clsx(
            "px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all",
            activeTab === 'messages' ? "bg-baulin-gold text-black" : "text-gray-400 hover:text-white"
          )}
        >
          Messages
        </button>
      </div>

      {activeTab === 'messages' ? (
        <MessagingTab clientId={client.id} clientEmail={client.email} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (Contact & CRM details) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Contact Intelligence</h3>
              <div className="space-y-4 text-sm text-gray-300">
                <div className="flex items-center gap-3 group">
                  <div className="p-2 bg-white/5 rounded-xl text-gray-400 group-hover:text-baulin-gold transition-colors"><Mail className="w-4 h-4"/></div>
                  <div>
                    <p className="text-[10px] text-gray-600 uppercase font-bold tracking-tighter">Primary Email</p>
                    <a href={`mailto:${client.email}`} className="hover:text-baulin-gold transition-colors font-medium">{client.email}</a>
                  </div>
                </div>
                <div className="flex items-center gap-3 group">
                  <div className="p-2 bg-white/5 rounded-xl text-gray-400 group-hover:text-baulin-gold transition-colors"><Phone className="w-4 h-4"/></div>
                  <div>
                    <p className="text-[10px] text-gray-600 uppercase font-bold tracking-tighter">Phone</p>
                    <a href={`tel:${client.phone}`} className="hover:text-baulin-gold transition-colors font-medium">{client.phone || 'Not provided'}</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Financial State</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-gray-600 uppercase font-bold tracking-tighter">Current Plan</p>
                    <p className="text-lg font-bold text-white leading-none">{subscription?.tier || 'None'}</p>
                  </div>
                  <p className="text-baulin-gold font-bold">£{subscription?.monthly_amount || 0}/mo</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-600 uppercase font-bold tracking-tighter mb-2">Stripe Status</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400 font-mono bg-black/30 p-2 rounded-lg border border-white/5">
                    <CreditCard className="w-3.5 h-3.5 text-gray-600"/>
                    {subscription?.stripe_subscription_id ? subscription.stripe_subscription_id.substring(0, 16) + '...' : 'No subscription'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Notes & Projects & Tickets) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Projects Section */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Active Projects</h3>
                <button className="flex items-center gap-1.5 text-[10px] font-bold text-baulin-gold uppercase tracking-widest hover:text-white transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                  New Project
                </button>
              </div>
              
              {projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.map((proj) => (
                    <div key={proj.id} className="p-4 bg-white/[0.03] border border-white/5 rounded-xl hover:border-baulin-gold/20 transition-all group">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-white text-sm group-hover:text-baulin-gold transition-colors">{proj.name}</h4>
                        <span className="text-[9px] uppercase font-black text-baulin-gold bg-baulin-gold/10 px-1.5 py-0.5 rounded tracking-tighter">
                          {proj.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          {(() => {
                            const milestones = proj.project_milestones || [];
                            const completed = milestones.filter((m: any) => m.status === 'completed').length;
                            const total = milestones.length;
                            const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
                            return <div className="h-full bg-baulin-gold/60" style={{ width: `${pct}%` }} />;
                          })()}
                        </div>
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{proj.tier}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 border border-dashed border-white/5 rounded-xl bg-black/10">
                  <p className="text-xs text-gray-600 uppercase font-bold tracking-widest">No Active Projects</p>
                  <button className="mt-2 text-[10px] text-baulin-gold hover:underline">Launch first project</button>
                </div>
              )}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Internal Intelligence</h3>
              <div className="p-4 bg-black/20 border border-white/5 rounded-xl">
                <p className="text-sm text-gray-300 italic leading-relaxed">
                  {client.notes || 'No internal intelligence recorded for this client.'}
                </p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Communication History</h3>
                <button className="text-[10px] font-bold text-baulin-gold uppercase hover:text-white transition-colors">Audit trail</button>
              </div>
              <div className="text-[10px] text-gray-600 font-bold uppercase py-8 text-center border border-dashed border-white/10 rounded-xl bg-black/10 tracking-[0.2em]">
                Clear transmission history
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
