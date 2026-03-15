"use client";

import { 
  ArrowUpRight, 
  Users, 
  CreditCard, 
  AlertCircle,
  Loader2
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
interface KpiItem {
  label: string;
  value: string | number;
  change: string;
  icon: any;
  trend: "up" | "down";
}

interface ActivityLog {
  id: string;
  action: string;
  details: string;
  created_at: string;
}

export default function DashboardHome() {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<KpiItem[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch KPI counts
        const [
          { count: clientsCount },
          { count: ticketsCount },
          { count: projectsCount }
        ] = await Promise.all([
          supabase.from('clients').select('*', { count: 'exact', head: true }),
          supabase.from('tickets').select('*', { count: 'exact', head: true }),
          supabase.from('projects').select('*', { count: 'exact', head: true }),
        ]);

        // Fetch clients with monthly_rate for MRR
        const { data: clientData } = await supabase
          .from('clients')
          .select('id, monthly_rate');

        const mrr = (clientData || []).reduce((acc, curr) => acc + (Number(curr.monthly_rate) || 0), 0);

        setKpis([
          { label: "Active MRR", value: `£${mrr.toLocaleString()}`, change: "Live", icon: ArrowUpRight, trend: "up" },
          { label: "Active Clients", value: clientsCount || 0, change: "Live", icon: Users, trend: "up" },
          { label: "Pipeline Value", value: `£${(projectsCount || 0) * 500}`, change: "Est", icon: CreditCard, trend: "up" },
          { label: "Open Tickets", value: ticketsCount || 0, change: "Live", icon: AlertCircle, trend: "down" },
        ]);

        // Fetch Recent Activity
        const { data: logData } = await supabase
          .from('activity_log')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        setActivities(logData || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-gray-400 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-baulin-gold" />
        <p className="animate-pulse">Loading live dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">Welcome back, Baffour</h1>
        <p className="text-gray-400">Here's what's happening with Baulin Technologies today.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm self-start">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-white/5 rounded-lg text-baulin-gold border border-white/10">
                <kpi.icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full ${
                kpi.trend === "up" ? "bg-green-500/10 text-green-400" : "bg-baulin-gold/10 text-baulin-gold"
              }`}>
                {kpi.change}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{kpi.value}</h3>
            <p className="text-sm text-gray-400 font-medium">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Placeholder for MRR Chart */}
        <div className="col-span-1 lg:col-span-2 bg-white/5 border border-white/10 rounded-xl p-6 min-h-[400px]">
          <h3 className="text-lg font-semibold text-white mb-4">Live Performance</h3>
          <div className="w-full h-[300px] flex items-center justify-center border border-dashed border-white/10 rounded-lg bg-black/20">
            <div className="text-center">
              <p className="text-gray-500 text-sm mb-2">Analytics stream active</p>
              <span className="text-[10px] text-baulin-gold border border-baulin-gold/20 px-2 py-1 rounded tracking-tighter uppercase font-bold">Waiting for events...</span>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="col-span-1 bg-white/5 border border-white/10 rounded-xl p-6 min-h-[400px]">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-5">
            {activities.length > 0 ? (
              activities.map((log) => (
                <div key={log.id} className="flex gap-3 pb-4 border-b border-white/5 last:border-0 relative">
                  <div className="w-1.5 h-1.5 rounded-full bg-baulin-gold mt-1.5 flex-shrink-0 shadow-[0_0_8px_rgba(212,175,55,0.5)]" />
                  <div>
                    <p className="text-sm text-white font-medium leading-tight">{log.action}</p>
                    <p className="text-xs text-gray-500 mt-1">{log.details}</p>
                    <p className="text-[10px] text-gray-600 mt-1 uppercase font-semibold">
                      {new Date(log.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center">
                <p className="text-gray-600 text-sm">No recent activity found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
