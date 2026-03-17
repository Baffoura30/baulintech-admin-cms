"use client";

import { 
  ArrowUpRight, 
  Users, 
  CreditCard, 
  AlertCircle,
  Loader2,
  PlusCircle,
  Receipt,
  LifeBuoy,
  Briefcase
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import Link from "next/link";

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
  details: any;
  created_at: string;
}

export default function DashboardHome() {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<KpiItem[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [chartData, setChartData] = useState<{name: string, value: number}[]>([]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [
          { count: clientsCount },
          { count: ticketsCount },
          { count: projectsCount },
          { data: subscriptionData },
          { data: invoiceData },
          { data: logData }
        ] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'client'),
          supabase.from('support_tickets').select('*', { count: 'exact', head: true }),
          supabase.from('client_projects').select('*', { count: 'exact', head: true }),
          supabase.from('client_subscriptions').select('monthly_amount, status'),
          supabase.from('invoices').select('amount, created_at, status'),
          supabase.from('activity_log').select('*').order('created_at', { ascending: false }).limit(5)
        ]);

        // Calculate Metrics
        const mrr = (subscriptionData || [])
          .filter(s => s.status === 'active')
          .reduce((acc, curr) => acc + (Number(curr.monthly_amount) || 0), 0);
        const pipelineValue = (invoiceData || [])
          .filter(inv => inv.status !== 'paid')
          .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

        setKpis([
          { label: "Active MRR", value: `£${mrr.toLocaleString()}`, change: "Live", icon: ArrowUpRight, trend: "up" },
          { label: "Total Clients", value: clientsCount || 0, change: "CRM", icon: Users, trend: "up" },
          { label: "Pipeline Value", value: `£${pipelineValue.toLocaleString()}`, change: "Pending", icon: CreditCard, trend: "up" },
          { label: "Open Tickets", value: ticketsCount || 0, change: "Support", icon: AlertCircle, trend: "down" },
        ]);

        setActivities(logData || []);

        // Process Chart Data (Invoices by Month)
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentMonth = new Date().getMonth();
        const last6Months = Array.from({length: 6}, (_, i) => {
          const m = (currentMonth - 5 + i + 12) % 12;
          return { name: months[m], value: 0 };
        });

        (invoiceData || []).forEach(inv => {
          const date = new Date(inv.created_at);
          const monthName = months[date.getMonth()];
          const chartPoint = last6Months.find(p => p.name === monthName);
          if (chartPoint) chartPoint.value += Number(inv.amount);
        });

        setChartData(last6Months);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const quickActions = [
    { label: "New Client", href: "/clients/new", icon: PlusCircle, color: "text-blue-400" },
    { label: "Create Invoice", href: "/invoices", icon: Receipt, color: "text-green-400" },
    { label: "Launch Project", href: "/pipeline", icon: Briefcase, color: "text-baulin-gold" },
    { label: "Support Ticket", href: "/tickets", icon: LifeBuoy, color: "text-purple-400" },
  ];

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-gray-400 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-baulin-gold" />
        <p className="animate-pulse">Loading live dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2 tracking-tight">Welcome back, Baffour</h1>
          <p className="text-gray-400">Your agency is performing well. Here's the snapshot for today.</p>
        </div>
        <div className="flex -space-x-2">
          {[1,2,3,4].map(i => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-baulin-dark bg-baulin-gold/20 flex items-center justify-center text-[10px] font-bold text-baulin-gold">
              T{i}
            </div>
          ))}
          <div className="w-8 h-8 rounded-full border-2 border-baulin-dark bg-white/10 flex items-center justify-center text-[10px] font-bold text-white">+5</div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="group bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm self-start hover:bg-white/[0.08] transition-all cursor-default">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-baulin-gold/10 rounded-xl text-baulin-gold border border-baulin-gold/20 group-hover:scale-110 transition-transform">
                <kpi.icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full ${
                kpi.trend === "up" ? "bg-green-500/10 text-green-400 border border-green-500/10" : "bg-baulin-gold/10 text-baulin-gold border border-baulin-gold/10"
              }`}>
                {kpi.change}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1 group-hover:text-baulin-gold transition-colors">{kpi.value}</h3>
            <p className="text-sm text-gray-400 font-medium tracking-wide">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Performance Chart */}
        <div className="col-span-1 lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-1 overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-white font-display">Revenue Performance</h3>
                <p className="text-xs text-gray-500">Invoiced revenue flow over the last 6 months</p>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-baulin-gold/10 rounded-full border border-baulin-gold/10">
                  <div className="w-1.5 h-1.5 rounded-full bg-baulin-gold animate-pulse" />
                  <span className="text-[10px] text-baulin-gold font-bold uppercase tracking-wider">Live Sync</span>
                </div>
              </div>
            </div>
            <div className="h-[320px] w-full">
              <PerformanceChart data={chartData} loading={false} />
            </div>
          </div>
        </div>

        {/* Action Panel & Activity */}
        <div className="col-span-1 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, i) => (
                <Link 
                  key={i} 
                  href={action.href}
                  className="flex flex-col items-center justify-center p-4 bg-white/[0.03] border border-white/5 rounded-xl hover:bg-white/[0.06] hover:border-white/10 transition-all active:scale-95 group"
                >
                  <action.icon className={`w-5 h-5 mb-2 ${action.color} group-hover:scale-110 transition-transform`} />
                  <span className="text-[10px] font-bold text-white uppercase tracking-tighter text-center">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Recent Events</h3>
            <div className="space-y-4">
              {activities.length > 0 ? (
                activities.map((log) => (
                  <div key={log.id} className="flex gap-3 pb-3 border-b border-white/[0.03] last:border-0 relative group">
                    <div className="w-1 h-8 bg-baulin-gold/20 rounded-full group-hover:bg-baulin-gold transition-colors" />
                    <div className="flex-1">
                      <p className="text-xs text-white font-bold tracking-tight uppercase leading-none mb-1">
                        {log.action.replace(/_/g, ' ')}
                      </p>
                      <p className="text-[11px] text-gray-500 line-clamp-1 italic">
                        {typeof log.details === 'object' ? 
                          (log.details?.business || log.details?.subject || JSON.stringify(log.details)) : 
                          log.details}
                      </p>
                      <p className="text-[9px] text-gray-600 mt-1 uppercase font-bold tracking-widest">
                        {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center">
                  <p className="text-gray-600 text-[10px] uppercase font-bold">Quiescent State</p>
                </div>
              )}
            </div>
            <Link href="/leads" className="mt-4 block w-full py-2 text-center text-[10px] font-bold text-baulin-gold uppercase tracking-[0.2em] hover:text-white transition-colors border border-baulin-gold/10 rounded-lg hover:border-baulin-gold/30">
              View All Logs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
