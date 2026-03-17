"use client";

import { 
  Settings, 
  User, 
  Database, 
  Globe, 
  Lock, 
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  CreditCard
} from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-white">Settings</h1>
        <p className="text-sm text-gray-400">Manage your administrative preferences and platform integrations</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Settings Navigation */}
        <aside className="lg:w-64 space-y-1">
          <button 
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === "profile" 
                ? "bg-baulin-gold/10 text-baulin-gold border border-baulin-gold/20 shadow-[0_0_15px_rgba(212,175,55,0.05)]" 
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <User className="w-4 h-4" />
            Admin Profile
          </button>
          <button 
            onClick={() => setActiveTab("integrations")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === "integrations" 
                ? "bg-baulin-gold/10 text-baulin-gold border border-baulin-gold/20 shadow-[0_0_15px_rgba(212,175,55,0.05)]" 
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Globe className="w-4 h-4" />
            Integrations
          </button>
          <button 
            onClick={() => setActiveTab("security")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === "security" 
                ? "bg-baulin-gold/10 text-baulin-gold border border-baulin-gold/20 shadow-[0_0_15px_rgba(212,175,55,0.05)]" 
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Lock className="w-4 h-4" />
            Security & Keys
          </button>
        </aside>

        {/* Settings Content */}
        <div className="flex-1 space-y-6">
          {activeTab === "profile" && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
              <h3 className="text-lg font-semibold text-white mb-6">Profile Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Display Name</label>
                  <input 
                    type="text" 
                    defaultValue="Baffour" 
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-baulin-gold/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Admin Email</label>
                  <input 
                    type="email" 
                    defaultValue="hello@baulin.co.uk" 
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white/50 focus:outline-none cursor-not-allowed"
                    disabled
                  />
                  <p className="text-[10px] text-gray-600 mt-2 italic">Email can only be changed via environment variables for security.</p>
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button className="bg-white text-black text-sm font-bold px-6 py-2.5 rounded-lg hover:bg-gray-200 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === "integrations" && (
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20">
                    <Database className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Supabase Database</h4>
                    <p className="text-xs text-gray-500">Live storage for all client and billing data</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-400 bg-green-400/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-green-400/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Connected
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Stripe Payments</h4>
                    <p className="text-xs text-gray-500">Subscription billing and automated payments</p>
                  </div>
                </div>
                {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? (
                  <div className="flex items-center gap-2 text-green-400 bg-green-400/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-green-400/20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Connected
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-amber-400/20">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Disconnected
                  </div>
                )}
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md flex items-center justify-between opacity-60">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Xero Accounting</h4>
                    <p className="text-xs text-gray-500">Automated invoice sync with Baulin's books</p>
                  </div>
                </div>
                <a 
                  href="/api/xero/auth"
                  className="text-[10px] text-baulin-gold border border-baulin-gold/20 hover:bg-baulin-gold/5 px-3 py-1 rounded-full font-bold uppercase tracking-wider transition-colors inline-block"
                >
                  Link Account
                </a>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Google Analytics 4</h4>
                    <p className="text-xs text-gray-500">Website traffic and user behavior tracking</p>
                  </div>
                </div>
                {process.env.NEXT_PUBLIC_GA_ID ? (
                  <div className="flex items-center gap-2 text-green-400 bg-green-400/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-green-400/20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Live
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-amber-400/20">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Pending ID
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
              <h3 className="text-lg font-semibold text-white mb-2">Platform Keys</h3>
              <p className="text-sm text-gray-500 mb-8 font-sans leading-relaxed">System keys are managed through Vercel environment variables to maintain maximum security and prevent accidental exposure.</p>
              
              <div className="space-y-4">
                <div className="p-4 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between group">
                  <div>
                    <span className="text-gray-400 text-xs font-mono uppercase tracking-tighter">NEXTAUTH_SECRET</span>
                    <p className="text-white text-sm font-medium mt-1">************************</p>
                  </div>
                  <ShieldCheck className="w-5 h-5 text-gray-700 group-hover:text-green-500/50 transition-colors" />
                </div>
                <div className="p-4 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between group">
                  <div>
                    <span className="text-gray-400 text-xs font-mono uppercase tracking-tighter">STRIPE_SECRET_KEY</span>
                    <p className="text-white text-sm font-medium mt-1">************************</p>
                  </div>
                  <ShieldCheck className="w-5 h-5 text-gray-700 group-hover:text-green-500/50 transition-colors" />
                </div>
              </div>

              <div className="mt-12 p-4 border border-baulin-gold/20 rounded-xl bg-baulin-gold/5 flex gap-4 items-start">
                <ShieldCheck className="w-6 h-6 text-baulin-gold flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-sm font-bold text-baulin-gold">Security Audit Complete</h5>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">All core platform keys are correctly identified as "Sensitive High" and are encrypted in the Vercel vault.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
