"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import KanbanBoard from "@/components/kanban/KanbanBoard";

export default function PipelinePage() {
  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Project Pipeline</h1>
          <p className="text-sm text-gray-400">Track and manage active projects across all clients</p>
        </div>
        <button className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors">
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        <KanbanBoard />
      </div>
    </div>
  );
}
