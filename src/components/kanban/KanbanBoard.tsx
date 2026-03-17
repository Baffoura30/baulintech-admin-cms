"use client";
import { useState, useEffect } from "react";
import { 
  DndContext, 
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent
} from "@dnd-kit/core";
import { 
  SortableContext, 
  arrayMove,
  verticalListSortingStrategy 
} from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";
import { supabase } from "@/lib/supabase";

export type ProjectTask = {
  id: string;
  title: string;
  client: string;
  priority: "low" | "medium" | "high";
  stage: string;
};

type ColumnProps = {
  id: string;
  title: string;
  tasks: ProjectTask[];
};

const STAGES = [
  { id: "brief", title: "Project Brief" },
  { id: "design", title: "Design & UX" },
  { id: "build", title: "Development" },
  { id: "review", title: "Client Review" },
  { id: "revisions", title: "Revisions" },
  { id: "pre_launch", title: "Pre-Launch" },
  { id: "live", title: "Live" },
  { id: "maintenance", title: "Maintenance" }
];

export default function KanbanBoard() {
  const [columns, setColumns] = useState<ColumnProps[]>(
    STAGES.map(stage => ({ ...stage, tasks: [] }))
  );
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const { data, error } = await supabase
        .from("client_projects")
        .select("*, profiles(full_name, business_name)");

      if (error) throw error;

      const newColumns = STAGES.map(stage => ({
        ...stage,
        tasks: (data || [])
          .filter(p => p.status === stage.id)
          .map(p => ({
            id: p.id,
            title: p.name,
            client: p.profiles?.business_name || p.profiles?.full_name || "Unknown Client",
            priority: (p.tier || "normal") as any,
            stage: p.status
          }))
      }));

      setColumns(newColumns);
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    // Find the columns
    const activeColumn = columns.find(col => col.tasks.some(t => t.id === activeId));
    const overColumn = columns.find(col => col.id === overId || col.tasks.some(t => t.id === overId));

    if (!activeColumn || !overColumn || activeColumn === overColumn) return;

    setColumns(prev => {
      const activeTasks = [...activeColumn.tasks];
      const overTasks = [...overColumn.tasks];
      
      const taskIndex = activeTasks.findIndex(t => t.id === activeId);
      const [movedTask] = activeTasks.splice(taskIndex, 1);
      
      // Update task's internal stage (optional but helps keep state consistent)
      movedTask.stage = overColumn.id;
      
      overTasks.push(movedTask);

      return prev.map(col => {
        if (col.id === activeColumn.id) return { ...col, tasks: activeTasks };
        if (col.id === overColumn.id) return { ...col, tasks: overTasks };
        return col;
      });
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    // Find column where task ended up
    const column = columns.find(col => col.tasks.some(t => t.id === activeId));
    if (!column) return;

    // Persist to Supabase
    try {
      const { error } = await supabase
        .from("client_projects")
        .update({ status: column.id })
        .eq("id", activeId);

      if (error) throw error;

      // Log activity
      await supabase.from("activity_log").insert([{
        entity_type: "Project",
        action: `moved_to_${column.id}`,
        details: { project_id: activeId, stage: column.title }
      }]);
    } catch (err) {
      console.error("Error updating project stage:", err);
      // Optional: Rollback state if server fails
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading pipeline...</div>;

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 h-full items-start">
        {columns.map((column) => (
          <div key={column.id} id={column.id} className="w-80 flex-shrink-0 flex flex-col bg-white/5 border border-white/10 rounded-xl h-full max-h-[calc(100vh-12rem)]">
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
