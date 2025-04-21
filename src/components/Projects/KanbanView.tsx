
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircleAlert, CircleHelp, CircleMinus } from "lucide-react";

interface KanbanViewProps {
  projects: any[];
  navigate: (path: string) => void;
  emptyMessage: string;
  onClearFilters: () => void;
}

const KanbanView = ({ projects, navigate, emptyMessage, onClearFilters }: KanbanViewProps) => {
  if (projects.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-[#E5E5EA]">
        <p className="text-[#86868B] mb-4">{emptyMessage}</p>
        {emptyMessage.includes("criteria") && (
          <Button onClick={onClearFilters} className="bg-[#007AFF] hover:opacity-90 text-white">
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
    "Planning": "#007AFF",
    "In Progress": "#F59E0B",
    "Review": "#8B5CF6",
    "Completed": "#10B981",
  };

  const statusBgColors = {
    "Planning": "#EBF5FF",
    "In Progress": "#FEF3C7",
    "Review": "#F3F0FF",
    "Completed": "#ECFDF5",
  };

  // Priority indicator renderer
  const renderPriorityIndicator = (priority: string | undefined) => {
    switch(priority?.toLowerCase()) {
      case 'high':
        return <CircleAlert className="text-[#EF4444]" size={18} />;
      case 'medium':
        return <CircleHelp className="text-[#F59E0B]" size={18} />;
      case 'low':
        return <CircleMinus className="text-[#86868B]" size={18} />;
      default:
        return <CircleMinus className="text-[#86868B]" size={18} />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {Object.entries(statusGroups).map(([status, statusProjects]) => (
        <div key={status} className="flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium" style={{ color: statusColors[status as keyof typeof statusColors] }}>
              {status} ({statusProjects.length})
            </h3>
          </div>
          <div className="bg-[#F5F5F7] rounded-lg p-3 h-full min-h-[70vh] flex flex-col gap-3">
            {statusProjects.map((project) => (
              <Card 
                key={project.id} 
                className="overflow-hidden border border-[#E5E5EA] hover:shadow-md transition-all duration-200 hover:scale-[1.005] cursor-pointer"
                onClick={() => navigate(`/admin/projects/${project.id}`)}
              >
                <CardContent className="p-0">
                  <div 
                    className="h-1 w-full" 
                    style={{ backgroundColor: statusColors[status as keyof typeof statusColors] }}
                  ></div>
                  <div className="p-3">
                    <h4 className="font-medium text-sm">{project.name}</h4>
                    <p className="text-xs text-[#86868B] line-clamp-2 mt-1">{project.description}</p>
                    
                    <div className="mt-3 flex justify-between items-center text-xs">
                      <span className="text-[#86868B]">Due: {project.dueDate}</span>
                      <span className="font-medium">{Math.round(project.progress)}%</span>
                    </div>
                    
                    <div className="w-full bg-[#F5F5F7] rounded-full h-1.5 mt-1">
                      <div 
                        className="h-1.5 rounded-full" 
                        style={{ 
                          width: `${project.progress}%`,
                          backgroundColor: statusColors[status as keyof typeof statusColors]
                        }}
                      ></div>
                    </div>
                    
                    <div className="mt-3 flex justify-between items-center">
                      <div className="flex items-center">
                        {renderPriorityIndicator(project.priority)}
                      </div>
                      <div className="flex -space-x-2">
                        {(project.team || []).slice(0, 3).map((member: string, i: number) => (
                          <div 
                            key={i}
                            className="w-6 h-6 rounded-full bg-[#007AFF] flex items-center justify-center text-white text-xs border border-white"
                            title={member}
                          >
                            {member.charAt(0)}
                          </div>
                        ))}
                        {(project.team || []).length > 3 && (
                          <div className="w-6 h-6 rounded-full bg-[#F5F5F7] flex items-center justify-center text-[#86868B] text-xs border border-white">
                            +{project.team.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {statusProjects.length === 0 && (
              <div className="text-center py-4 text-sm text-[#86868B] italic">
                No projects
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanView;
