"use client";

import { 
  ArrowUpRight, 
  Users, 
  CreditCard, 
  AlertCircle 
} from "lucide-react";

const kpiData = [
  { label: "Active MRR", value: "£2,450", change: "+£198", icon: ArrowUpRight, trend: "up" },
  { label: "Active Clients", value: "24", change: "+2", icon: Users, trend: "up" },
  { label: "Pipeline Value", value: "£1,200", change: "+£300", icon: CreditCard, trend: "up" },
  { label: "Overdue Tasks", value: "3", change: "-1", icon: AlertCircle, trend: "down" },
];

export default function DashboardHome() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">Welcome back, Baffour</h1>
        <p className="text-gray-400">Here's what's happening with Baulin Technologies today.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm self-start">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-white/5 rounded-lg text-baulin-gold border border-white/10">
                <kpi.icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                kpi.trend === "up" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
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
          <h3 className="text-lg font-semibold text-white mb-4">MRR Growth</h3>
          <div className="w-full h-[300px] flex items-center justify-center border border-dashed border-white/10 rounded-lg">
            <p className="text-gray-500 text-sm">MRR Chart Component will live here (Recharts)</p>
          </div>
        </div>

        {/* Activity Feed Placeholder */}
        <div className="col-span-1 bg-white/5 border border-white/10 rounded-xl p-6 min-h-[400px]">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex gap-3 pb-4 border-b border-white/5 last:border-0">
                <div className="w-2 h-2 rounded-full bg-baulin-gold mt-2 flex-shrink-0" />
                <div>
                  <p className="text-sm text-white">Client onboarding complete</p>
                  <p className="text-xs text-gray-500 mt-1">Acme Corp Law ~ 2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
