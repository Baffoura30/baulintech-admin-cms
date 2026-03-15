"use client";

import { BarChart3, LineChart, Globe } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Google Analytics</h1>
          <p className="text-sm text-gray-400">Live website traffic and engagement data</p>
        </div>
        <div className="flex items-center gap-2 bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1.5 rounded-lg text-sm font-medium">
          <Globe className="w-4 h-4" />
          GA4 Connected
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 min-h-[300px]">
          <div className="flex items-center gap-2 mb-6">
            <LineChart className="w-5 h-5 text-baulin-gold" />
            <h3 className="font-semibold text-white">Traffic Overview (Last 30 Days)</h3>
          </div>
          <div className="w-full h-[200px] border border-dashed border-white/10 rounded-lg flex items-center justify-center text-gray-500 text-sm">
            GA4 Line Chart Placeholder
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6 min-h-[300px]">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-baulin-gold" />
            <h3 className="font-semibold text-white">Top Converting Pages</h3>
          </div>
          <div className="w-full h-[200px] border border-dashed border-white/10 rounded-lg flex items-center justify-center text-gray-500 text-sm">
            GA4 Bar Chart Placeholder
          </div>
        </div>
      </div>
    </div>
  );
}
