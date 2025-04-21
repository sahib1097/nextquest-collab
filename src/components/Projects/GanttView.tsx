
import React from "react";
import { Button } from "@/components/ui/button";

interface GanttViewProps {
  projects: any[];
  navigate: (path: string) => void;
  emptyMessage: string;
  onClearFilters: () => void;
}

const GanttView = ({ projects, navigate, emptyMessage, onClearFilters }: GanttViewProps) => {
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
  
  // Get date ranges for the chart
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 3, 0);
  
  // Generate days for the timeline
  const days: Date[] = [];
  for (let d = new Date(startOfMonth); d <= endOfMonth; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }
  
  // Group days by week
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  
  days.forEach((day, index) => {
    currentWeek.push(day);
    if (day.getDay() === 6 || index === days.length - 1) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });
  
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
        case "In Progress": return "#F59E0B";
        case "Review": return "#8B5CF6"; 
        default: return "#007AFF";
      }
    };
    
    return {
      gridColumn: `span ${durationDays}`,
      marginLeft: `${startOffset * 2.5}%`,
      width: `${durationDays * 2.5}%`,
      backgroundColor: getColorByStatus(project.status)
    };
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 overflow-x-auto border border-[#E5E5EA]">
      <div className="min-w-[1200px]">
        {/* Timeline Header */}
        <div className="grid grid-cols-12 mb-4 pb-2 border-b border-[#E5E5EA] text-sm">
          {/* Project Names Column */}
          <div className="col-span-2 font-medium text-[#1D1D1F]">Project</div>
          
          {/* Timeline Columns */}
          <div className="col-span-10">
            <div className="grid grid-cols-12">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="col-span-4 text-center font-medium text-[#1D1D1F]">
                  Week {weekIndex + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Projects Timeline */}
        {projects.map((project) => (
          <div 
            key={project.id} 
            className="grid grid-cols-12 mb-4 hover:bg-[#F5F5F7] cursor-pointer transition-colors rounded"
            onClick={() => navigate(`/admin/projects/${project.id}`)}
          >
            {/* Project Info */}
            <div className="col-span-2 flex flex-col justify-center pr-4 py-2">
              <h4 className="font-medium text-[#1D1D1F]">{project.name}</h4>
              <p className="text-xs text-[#86868B] truncate">{project.description}</p>
            </div>
            
            {/* Project Timeline */}
            <div className="col-span-10 relative h-12 flex items-center">
              {/* Timeline Grid */}
              <div className="absolute left-0 right-0 top-0 bottom-0 grid grid-cols-84">
                {Array.from({ length: 84 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`border-l ${i % 7 === 0 ? 'border-[#E5E5EA]' : 'border-[#F5F5F7]'}`}
                  />
                ))}
              </div>
              
              {/* Today Marker */}
              <div className="absolute top-0 bottom-0 border-l-2 border-[#007AFF] left-[30%] z-10" />
              
              {/* Project Bar */}
              <div 
                className="absolute z-20 h-6 rounded-md shadow-sm flex items-center px-2 text-white text-sm"
                style={getProjectStyle(project)}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/admin/projects/${project.id}`);
                }}
              >
                {project.name}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GanttView;
