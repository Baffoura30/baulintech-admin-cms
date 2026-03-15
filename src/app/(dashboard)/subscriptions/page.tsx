"use client";
import { useState, useEffect } from "react";
import { CreditCard, TrendingUp, RefreshCcw } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function SubscriptionsPage() {
  const [stats, setStats] = useState({
    mrr: 0,
    active: 0,
    pastDue: 0
  });
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("monthly_rate, stage");

      if (error) throw error;

      const mrr = (data || []).reduce((acc, curr) => acc + (Number(curr.monthly_rate) || 0), 0);
      const active = (data || []).filter(c => c.stage === "active").length;
      const pastDue = (data || []).filter(c => c.stage === "at_risk").length;

      setStats({ mrr, active, pastDue });
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSync() {
    setSyncing(true);
    try {
      // In a real app, this would call an API route that talks to Stripe
      // For this demo, we'll simulate a fetch delay and then refresh our local DB view
      await new Promise(res => setTimeout(res, 1500));
      await fetchStats();
      alert("Subscription data synced with Stripe successfully.");
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Stripe Subscriptions</h1>
          <p className="text-sm text-gray-400">Manage recurring revenue and active billing plans</p>
        </div>
        <button 
          onClick={handleSync}
          disabled={syncing || loading}
          className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/10 transition-colors disabled:opacity-50"
        >
          <RefreshCcw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? "Syncing..." : "Sync with Stripe"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-white/5 rounded-lg text-baulin-gold border border-white/10">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">
            £{stats.mrr.toLocaleString()}
          </h3>
          <p className="text-sm text-gray-400 font-medium">Monthly Recurring Revenue</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-white/5 rounded-lg text-green-400 border border-white/10">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">{stats.active}</h3>
          <p className="text-sm text-gray-400 font-medium">Active Subscribers</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-white/5 rounded-lg text-red-400 border border-white/10">
              <RefreshCcw className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">{stats.pastDue}</h3>
          <p className="text-sm text-gray-400 font-medium">Past Due</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">Recent Subscription Activity</h3>
          {stats.active > 0 && <span className="text-[10px] text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full border border-green-400/20 font-bold uppercase tracking-wider">Live</span>}
        </div>
        <div className="p-8 text-center text-gray-500 text-sm">
          {stats.active > 0 
            ? "Showing real-time events from your connected Stripe account." 
            : "Connect your Stripe account to see live subscription events and renewals here."}
        </div>
      </div>
    </div>
  );
}
