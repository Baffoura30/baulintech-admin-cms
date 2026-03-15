"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type ClientFormInput = {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  businessType: string;
  tier: string;
};

export default function NewClientPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<ClientFormInput>();

  const onSubmit = async (data: ClientFormInput) => {
    try {
      const { error } = await supabase
        .from("clients")
        .insert([
          {
            business_name: data.businessName,
            contact_name: data.contactName,
            email: data.email,
            phone: data.phone,
            business_type: data.businessType,
            tier: data.tier,
            stage: "onboarding", // Default stage for new manual entries
          },
        ]);

      if (error) throw error;
      
      router.push("/clients");
      router.refresh();
    } catch (err: any) {
      console.error("Error saving client:", err);
      alert("Failed to save client: " + err.message);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/clients" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Add New Client</h1>
          <p className="text-sm text-gray-400">Manually onboard a new client to the pipeline</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white/5 border border-white/10 rounded-xl p-6 md:p-8 backdrop-blur-sm">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Business Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Business Name *</label>
              <input 
                {...register("businessName", { required: true })}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-baulin-gold"
                placeholder="e.g. Acme Solicitors LTD"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Business Type</label>
              <select 
                {...register("businessType")}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-baulin-gold appearance-none"
              >
                <option value="">Select industry...</option>
                <option value="Lawyer">Lawyer / Legal Services</option>
                <option value="Accountant">Accountant / Finance</option>
                <option value="Consultant">Consultant</option>
                <option value="Startup">Startup / Tech</option>
                <option value="Other">Other SME</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Subscription Tier</label>
              <select 
                {...register("tier")}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-baulin-gold appearance-none"
              >
                <option value="">Select tier...</option>
                <option value="Presence">Presence (£99/mo)</option>
                <option value="Authority">Authority (£199/mo)</option>
                <option value="Prestige">Prestige (£349/mo)</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Primary Contact</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Contact Name *</label>
              <input 
                {...register("contactName", { required: true })}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-baulin-gold"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email Address *</label>
              <input 
                type="email"
                {...register("email", { required: true })}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-baulin-gold"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
              <input 
                type="tel"
                {...register("phone")}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-baulin-gold"
                placeholder="+44 7123 456789"
              />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex justify-end gap-3">
          <Link href="/clients" className="px-6 py-2 rounded-lg font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
            Cancel
          </Link>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? "Saving..." : "Save Client"}
          </button>
        </div>
      </form>
    </div>
  );
}
