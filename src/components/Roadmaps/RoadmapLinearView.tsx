
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CircleCheck, 
  CircleDashed, 
  Circle, 
  CalendarClock, 
  Clock,
  MoreHorizontal,
  Trash2,
  Link as LinkIcon
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { RoadmapItem } from "@/types/roadmap";
import LinkProjectsDialog from "./LinkProjectsDialog";
import { Progress } from "@/components/ui/progress";

interface RoadmapLinearViewProps {
  items: RoadmapItem[];
  currentYear: number;
  onDeleteItem: (itemId: string) => void;
  roadmapId: string;
}

const RoadmapLinearView = ({ 
  items = [], 
  currentYear,
  onDeleteItem,
  roadmapId
}: RoadmapLinearViewProps) => {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{id: string; title: string} | null>(null);

  const getStatusIcon = (progress: number) => {
    if (progress === 100) {
      return <CircleCheck className="h-6 w-6 text-green-500" />;
    } else if (progress > 0) {
      return <CircleDashed className="h-6 w-6 text-amber-500" />;
    } else {
      return <Circle className="h-6 w-6 text-gray-300" />;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Handle item deletion with confirmation
  const handleDeleteItem = (itemId: string, itemTitle: string) => {
    if (confirm(`Are you sure you want to delete "${itemTitle}"?`)) {
      onDeleteItem(itemId);
      toast.success(`"${itemTitle}" was deleted`);
    }
  };

  // Handle linking projects
  const handleLinkProjects = (itemId: string, itemTitle: string) => {
    setSelectedItem({ id: itemId, title: itemTitle });
    setLinkDialogOpen(true);
  };

  // Sort items by start date
  const sortedItems = [...items].sort(
    (a, b) => a.startDate.getTime() - b.startDate.getTime()
  );

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            {sortedItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No roadmap items for {currentYear}. Add an item to get started.
              </div>
            ) : (
              sortedItems.map((item, index) => (
                <div key={item.id} className="relative">
                  {/* Timeline connector */}
                  {index < sortedItems.length - 1 && (
                    <div 
                      className="absolute left-3 top-6 w-0.5 bg-gray-200 dark:bg-gray-700" 
                      style={{ height: "calc(100% + 1.5rem)" }}
                    ></div>
                  )}
                  
                  <div className="flex gap-6">
                    <div className="z-10">
                      {getStatusIcon(item.progress)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-medium mb-1">{item.title}</h3>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              onClick={() => handleLinkProjects(item.id, item.title)}
                            >
                              <LinkIcon className="h-4 w-4 mr-2" />
                              Link Projects
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600 cursor-pointer"
                              onClick={() => handleDeleteItem(item.id, item.title)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{item.description}</p>
                      
                      {item.linkedProjects && item.linkedProjects.length > 0 && (
                        <div className="mb-3">
                          <div className="flex items-center gap-1 text-xs text-primary mb-2">
                            <LinkIcon className="h-3.5 w-3.5" />
                            <span>{item.linkedProjects.length} project{item.linkedProjects.length !== 1 ? 's' : ''} linked</span>
                          </div>
                          {item.progress > 0 && (
                            <div className="flex items-center gap-2">
                              <Progress value={item.progress} className="h-2 flex-1" />
                              <span className="text-xs font-medium">{item.progress}%</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <CalendarClock className="h-3.5 w-3.5" />
                          <span>{formatDate(item.startDate)} - {formatDate(item.endDate)}</span>
                        </div>
                        {!(item.linkedProjects && item.linkedProjects.length > 0) && item.progress > 0 && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{item.progress}% complete</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Link Projects Dialog */}
      {selectedItem && (
        <LinkProjectsDialog
          open={linkDialogOpen}
          onClose={() => setLinkDialogOpen(false)}
          roadmapId={roadmapId}
          itemId={selectedItem.id}
          itemTitle={selectedItem.title}
        />
      )}
    </>
  );
};

export default RoadmapLinearView;
