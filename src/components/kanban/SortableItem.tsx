"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ProjectTask } from "./KanbanBoard";
import { GripVertical } from "lucide-react";
import clsx from "clsx";

export function SortableItem({ id, task }: { id: string; task: ProjectTask }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(
        "bg-baulin-dark border rounded-lg p-3 group relative cursor-grab active:cursor-grabbing",
        isDragging ? "opacity-50 border-baulin-gold" : "border-white/10 hover:border-white/20"
      )}
      {...attributes}
      {...listeners}
    >
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-gray-400 transition-opacity">
        <GripVertical className="w-4 h-4" />
      </div>
      
      <div className="flex gap-2 text-[10px] font-medium uppercase tracking-wider mb-2">
        <span className={clsx(
          "px-1.5 py-0.5 rounded",
          task.priority === "high" && "bg-red-500/20 text-red-400",
          task.priority === "medium" && "bg-amber-500/20 text-amber-400",
          task.priority === "low" && "bg-green-500/20 text-green-400"
        )}>
          {task.priority}
        </span>
      </div>
      
      <h4 className="text-sm font-semibold text-white mb-1 leading-tight">{task.title}</h4>
      <p className="text-xs text-gray-400">{task.client}</p>
    </div>
  );
}
