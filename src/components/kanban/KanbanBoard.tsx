"use client";

import { useState } from "react";
import { 
  DndContext, 
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import { 
  SortableContext, 
  horizontalListSortingStrategy, 
  verticalListSortingStrategy 
} from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";

export type ProjectTask = {
  id: string;
  title: string;
  client: string;
  priority: "low" | "medium" | "high";
};

type ColumnProps = {
  id: string;
  title: string;
  tasks: ProjectTask[];
};

const INITIAL_COLUMNS: ColumnProps[] = [
  {
    id: "brief",
    title: "Project Brief",
    tasks: [{ id: "t1", title: "Website Redesign", client: "Acme Legal", priority: "high" }]
  },
  {
    id: "design",
    title: "Design & UX",
    tasks: [{ id: "t2", title: "Logo Refresh", client: "Peak Consultants", priority: "medium" }]
  },
  {
    id: "build",
    title: "Development",
    tasks: [{ id: "t3", title: "E-Commerce Integration", client: "Local Plumbers", priority: "high" }]
  },
  {
    id: "review",
    title: "Client Review",
    tasks: []
  },
  {
    id: "launch",
    title: "Ready for Launch",
    tasks: [{ id: "t4", title: "SEO Migration", client: "Summit Accountants", priority: "low" }]
  }
];

export default function KanbanBoard() {
  const [columns, setColumns] = useState<ColumnProps[]>(INITIAL_COLUMNS);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    // For simplicity in this demo, we'll just log the drag end.
    // A fully featured board involves moving tasks between columns arrays.
    console.log(`Moved item ${active.id} over ${over.id}`);
  };

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 h-full items-start">
        {columns.map((column) => (
          <div key={column.id} className="w-80 flex-shrink-0 flex flex-col bg-white/5 border border-white/10 rounded-xl h-full max-h-[calc(100vh-12rem)]">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/50 rounded-t-xl">
              <h3 className="font-semibold text-white">{column.title}</h3>
              <span className="text-xs font-medium text-gray-500 bg-white/5 px-2 py-1 rounded">
                {column.tasks.length}
              </span>
            </div>
            
            <div className="flex-1 p-3 overflow-y-auto space-y-3">
              <SortableContext 
                items={column.tasks.map(t => t.id)} 
                strategy={verticalListSortingStrategy}
              >
                {column.tasks.map((task) => (
                  <SortableItem key={task.id} id={task.id} task={task} />
                ))}
              </SortableContext>
              
              {column.tasks.length === 0 && (
                <div className="h-24 border-2 border-dashed border-white/10 rounded-lg flex items-center justify-center text-sm text-gray-500">
                  Drop here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </DndContext>
  );
}
