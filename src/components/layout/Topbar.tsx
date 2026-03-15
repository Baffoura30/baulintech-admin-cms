"use client";

import { signOut } from "next-auth/react";
import { LogOut, Menu, Bell } from "lucide-react";

export default function Topbar() {
  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-white/10 bg-black/80 backdrop-blur-md z-10 sticky top-0">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-gray-400 hover:text-white">
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-semibold text-white truncate hidden sm:block">
          Baulin Tech Internal
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-gray-400 hover:text-white transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-baulin-gold rounded-full" />
        </button>
        
        <div className="h-6 w-px bg-white/10 mx-2" />

        <div className="flex items-center gap-3">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-white">Baffour Ampaw</p>
            <p className="text-xs text-gray-500">Owner</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-baulin-gold font-bold text-sm">
            BA
          </div>
        </div>

        <button 
          onClick={() => signOut()}
          className="ml-2 text-gray-400 hover:text-red-400 transition-colors"
          title="Sign out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
