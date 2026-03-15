"use client";

import { CreditCard, TrendingUp, RefreshCcw } from "lucide-react";

export default function SubscriptionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Stripe Subscriptions</h1>
          <p className="text-sm text-gray-400">Manage recurring revenue and active billing plans</p>
        </div>
        <button className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/10 transition-colors">
          <RefreshCcw className="w-4 h-4" />
          Sync with Stripe
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-white/5 rounded-lg text-baulin-gold border border-white/10">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">£2,450</h3>
          <p className="text-sm text-gray-400 font-medium">Monthly Recurring Revenue</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-white/5 rounded-lg text-green-400 border border-white/10">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">12</h3>
          <p className="text-sm text-gray-400 font-medium">Active Subscribers</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-white/5 rounded-lg text-red-400 border border-white/10">
              <RefreshCcw className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">2</h3>
          <p className="text-sm text-gray-400 font-medium">Past Due</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">Recent Subscription Activity</h3>
        </div>
        <div className="p-8 text-center text-gray-500 text-sm">
          Connect your Stripe account to see live subscription events and renewals here.
        </div>
      </div>
    </div>
  );
}
