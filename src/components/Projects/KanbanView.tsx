import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircleAlert, CircleHelp, CircleMinus } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface KanbanViewProps {
  projects: any[];
  navigate: (path: string) => void;
  emptyMessage: string;
  onClearFilters: () => void;
}

const KanbanView = ({ projects, navigate, emptyMessage, onClearFilters }: KanbanViewProps) => {
  const { currentTheme } = useTheme();

  if (projects.length === 0) {
    return (
      <div 
        className="text-center py-12 rounded-lg shadow-sm border"
        style={{ 
          backgroundColor: currentTheme.colors.background,
          borderColor: currentTheme.colors.border
        }}
      >
        <p style={{ color: currentTheme.colors.accent }} className="mb-4">{emptyMessage}</p>
        {emptyMessage.includes("criteria") && (
          <Button 
            onClick={onClearFilters} 
            style={{
              backgroundColor: currentTheme.colors.primary,
              color: currentTheme.colors.text
            }}
            className="hover:opacity-90"
          >
            Clear Filters
          </Button>
        )}
      </div>
    );
  }

  // Group projects by status
  const statusGroups = {
    "Planning": projects.filter(p => p.status === "Planning"),
    "In Progress": projects.filter(p => p.status === "In Progress"),
    "Review": projects.filter(p => p.status === "Review"),
    "Completed": projects.filter(p => p.status === "Completed"),
  };

  // Status column colors
  const statusColors = {
    "Planning": currentTheme.colors.primary,
    "In Progress": currentTheme.colors.accent,
    "Review": currentTheme.colors.secondary,
    "Completed": "#10B981",
  };

  const statusBgColors = {
    "Planning": `${currentTheme.colors.primary}20`,
    "In Progress": `${currentTheme.colors.accent}20`,
    "Review": `${currentTheme.colors.secondary}20`,
    "Completed": "#ECFDF5",
  };

  // Priority indicator renderer
  const renderPriorityIndicator = (priority: string | undefined) => {
    switch(priority?.toLowerCase()) {
      case 'high':
        return <CircleAlert className="text-red-500" size={18} />;
      case 'medium':
        return <CircleHelp className="text-amber-500" size={18} />;
      case 'low':
        return <CircleMinus style={{ color: currentTheme.colors.accent }} size={18} />;
      default:
        return <CircleMinus style={{ color: currentTheme.colors.accent }} size={18} />;
    }
  };

  return (
    <div className="grid grid-cols-4 gap-4 h-full">
      {Object.entries(statusGroups).map(([status, statusProjects]) => (
        <div key={status} className="flex flex-col">
          <div 
            className="px-4 py-2 rounded-t-lg font-medium text-sm"
            style={{ 
              backgroundColor: statusBgColors[status as keyof typeof statusBgColors],
              color: statusColors[status as keyof typeof statusColors]
            }}
          >
            {status} ({statusProjects.length})
          </div>
          
          <div className="flex-1 space-y-3 p-2 overflow-y-auto">
            {statusProjects.map((project) => (
              <Card 
                key={project.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/admin/projects/${project.id}`)}
              >
                <CardContent className="p-0">
                  <div 
                    className="h-1 w-full" 
                    style={{ backgroundColor: statusColors[status as keyof typeof statusColors] }}
                  ></div>
                  <div className="p-3">
                    <h4 style={{ color: currentTheme.colors.text }} className="font-medium text-sm">{project.name}</h4>
                    <p style={{ color: currentTheme.colors.accent }} className="text-xs line-clamp-2 mt-1">{project.description}</p>
                    
                    <div className="mt-3 flex justify-between items-center text-xs">
                      <span style={{ color: currentTheme.colors.accent }}>Due: {project.dueDate}</span>
                      <span style={{ color: currentTheme.colors.text }} className="font-medium">{Math.round(project.progress)}%</span>
                    </div>
                    
                    <div 
                      className="w-full rounded-full h-1.5 mt-1"
                      style={{ backgroundColor: currentTheme.colors.secondary }}
                    >
                      <div 
                        className="h-1.5 rounded-full" 
                        style={{ 
                          width: `${project.progress}%`,
                          backgroundColor: statusColors[status as keyof typeof statusColors]
                        }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanView;
