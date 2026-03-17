"use client";

import { BarChart3, LineChart, Globe, Zap, Users, Timer, Target } from "lucide-react";
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

export default function AnalyticsPage() {
  const trafficData = [
    { name: '01/03', value: 450 },
    { name: '05/03', value: 680 },
    { name: '10/03', value: 520 },
    { name: '15/03', value: 940 },
    { name: '20/03', value: 810 },
    { name: '25/03', value: 1200 },
    { name: '30/03', value: 1100 },
  ];

  const pageData = [
    { name: '/solutions', value: 85, color: '#D4AF37' },
    { name: '/blog', value: 65, color: '#white' },
    { name: '/contact', value: 45, color: '#D4AF37' },
    { name: '/portfolio', value: 35, color: '#white' },
  ];

  const stats = [
    { label: "Active Sessions", value: "24", icon: Users, color: "text-blue-400" },
    { label: "Avg. Duration", value: "3m 42s", icon: Timer, color: "text-green-400" },
    { label: "Bounce Rate", value: "28.4%", icon: Zap, color: "text-baulin-gold" },
    { label: "Conv. Rate", value: "4.2%", icon: Target, color: "text-purple-400" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-white tracking-tight">Market Analytics</h1>
          <p className="text-sm text-gray-400">Integrated Google Analytics 4 (GA4) stream</p>
        </div>
        <div className="flex items-center gap-2 bg-green-500/10 text-green-400 border border-green-500/20 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest">
          <Globe className="w-4 h-4 animate-pulse" />
          Stream Active
        </div>
      </div>

      {/* Mini Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Chart */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 min-h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-baulin-gold/10 rounded-lg text-baulin-gold">
                <LineChart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white font-display">Traffic Velocity</h3>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Sessions per 5-day interval</p>
              </div>
            </div>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 700 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }}
                  cursor={{ stroke: '#D4AF37', strokeDasharray: '4 4' }}
                />
                <Area type="monotone" dataKey="value" stroke="#D4AF37" strokeWidth={3} fillOpacity={1} fill="url(#colorTraffic)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Pages Chart */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 min-h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-baulin-gold/10 rounded-lg text-baulin-gold">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white font-display">Conversion Hotspots</h3>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Percentage of total conversions</p>
              </div>
            </div>
          </div>
          <div className="h-[280px] w-full text-white">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pageData} layout="vertical" margin={{ top: 0, right: 30, left: 30, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 600 }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                  {pageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#D4AF37' : '#ffffff20'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
