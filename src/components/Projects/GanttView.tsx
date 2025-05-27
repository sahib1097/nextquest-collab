import React from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

interface GanttViewProps {
  projects: any[];
  navigate: (path: string) => void;
  emptyMessage: string;
  onClearFilters: () => void;
}

const GanttView = ({ projects, navigate, emptyMessage, onClearFilters }: GanttViewProps) => {
  const { currentTheme } = useTheme();

  // Custom function to determine project duration and position
  const getProjectStyle = (project: any) => {
    // In a real app, you'd parse actual dates
    // For this example, we'll create a random duration and position
    const durationDays = Math.max(3, Math.floor(Math.random() * 14)); // 3-14 days
    const startOffset = Math.floor(Math.random() * 30); // Start somewhere in the first month
    
    // Get status-based colors
    const getColorByStatus = (status: string) => {
      switch(status) {
        case "Completed": return "#10B981";
        case "In Progress": return currentTheme.colors.accent;
        case "Review": return currentTheme.colors.secondary;
        default: return currentTheme.colors.primary;
      }
    };
    
    return {
      gridColumn: `span ${durationDays}`,
      marginLeft: `${startOffset * 2.5}%`,
      width: `${durationDays * 2.5}%`,
      backgroundColor: getColorByStatus(project.status)
    };
  };

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

  return (
    <div className="space-y-4">
      <div 
        className="grid grid-cols-30 gap-4 p-4 rounded-lg border"
        style={{ 
          backgroundColor: currentTheme.colors.background,
          borderColor: currentTheme.colors.border
        }}
      >
        {projects.map((project) => (
          <div 
            key={project.id}
            className="relative group"
            onClick={() => navigate(`/admin/projects/${project.id}`)}
          >
            <div 
              className="h-12 rounded-md cursor-pointer transition-all duration-200 hover:shadow-lg"
              style={getProjectStyle(project)}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span 
                  className="text-sm font-medium px-2"
                  style={{ color: currentTheme.colors.text }}
                >
                  {project.name}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GanttView;
