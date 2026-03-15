"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Trello, 
  CreditCard, 
  Receipt, 
  LifeBuoy, 
  BarChart, 
  Settings 
} from "lucide-react";
import clsx from "clsx";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Clients", href: "/clients", icon: Users },
  { label: "Pipeline", href: "/pipeline", icon: Trello },
  { label: "Subscriptions", href: "/subscriptions", icon: CreditCard },
  { label: "Invoices", href: "/invoices", icon: Receipt },
  { label: "Tickets", href: "/tickets", icon: LifeBuoy },
  { label: "Analytics", href: "/analytics", icon: BarChart },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 bg-black border-r border-white/10 hidden md:flex flex-col h-full z-20">
      {/* Brand logo area */}
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <div className="font-display font-bold text-xl tracking-tight text-white flex items-center gap-1">
          baulin<span className="text-baulin-gold">.</span>
          <span className="text-[10px] text-gray-500 font-sans tracking-widest uppercase ml-2 mt-1 hidden lg:inline">Admin</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 scrollbar-hide">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-baulin-gold/10 text-baulin-gold" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Settings */}
      <div className="p-4 border-t border-white/10">
        <Link
          href="/settings"
          className={clsx(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
            pathname === "/settings" 
              ? "bg-baulin-gold/10 text-baulin-gold" 
              : "text-gray-400 hover:text-white hover:bg-white/5"
          )}
        >
          <Settings className="w-5 h-5" />
          Settings
        </Link>
      </div>
    </aside>
  );
}
