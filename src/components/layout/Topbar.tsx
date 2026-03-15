import { signOut } from "next-auth/react";
import { LogOut, Menu, Bell, X, CheckSquare, UserPlus, CreditCard } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { formatDistanceToNow } from "date-fns";

export default function Topbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotifications();
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function fetchNotifications() {
    try {
      const { data, error } = await supabase
        .from("activity_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      setNotifications(data || []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  }

  const getIcon = (action: string) => {
    if (action.includes("client")) return <UserPlus className="w-4 h-4 text-blue-400" />;
    if (action.includes("subscription") || action.includes("invoice")) return <CreditCard className="w-4 h-4 text-green-400" />;
    return <CheckSquare className="w-4 h-4 text-amber-400" />;
  };

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-white/10 bg-black/80 backdrop-blur-md z-30 sticky top-0">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-gray-400 hover:text-white">
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-semibold text-white truncate hidden sm:block">
          Baulin Tech Internal
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`text-gray-400 hover:text-white transition-colors relative p-2 rounded-lg ${showNotifications ? 'bg-white/10 text-white' : ''}`}
          >
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-baulin-gold rounded-full border border-black shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-[#1A1A1A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                <span className="text-xs font-bold text-white uppercase tracking-widest">Recent Activity</span>
                <span className="text-[10px] text-baulin-gold bg-baulin-gold/10 px-2 py-0.5 rounded-full border border-baulin-gold/20 mr-4">Live</span>
              </div>
              <div className="max-h-[350px] overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div key={n.id} className="p-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                        {getIcon(n.action)}
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-white leading-relaxed">
                          <span className="font-semibold">{n.entity_type}</span> {n.action.replace(/_/g, " ")}
                        </p>
                        <p className="text-[10px] text-gray-500 uppercase font-medium">
                          {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center text-gray-500 text-xs italic">
                    No recent notifications
                  </div>
                )}
              </div>
              <div className="p-3 bg-black/40 text-center">
                <button className="text-[10px] font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest">View All Notifications</button>
              </div>
            </div>
          )}
        </div>
        
        <div className="h-6 w-px bg-white/10 mx-2" />

        <div className="flex items-center gap-3">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-white">Baffour Ampaw</p>
            <p className="text-xs text-gray-500 uppercase tracking-tighter">Owner</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-baulin-gold/40 to-baulin-gold/10 border border-baulin-gold/30 flex items-center justify-center text-baulin-gold font-bold text-sm shadow-[0_0_15px_rgba(212,175,55,0.1)]">
            BA
          </div>
        </div>

        <button 
          onClick={() => signOut()}
          className="ml-2 text-gray-400 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-400/10"
          title="Sign out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
