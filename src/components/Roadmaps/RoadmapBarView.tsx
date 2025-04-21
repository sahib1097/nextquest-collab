import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  MoreHorizontal,
  Trash2,
  Link,
  Palette
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
import ColorPickerPopover from './ColorPickerPopover';
import { updateRoadmapItemColor } from "@/services/roadmapService";

type TimeScale = "months" | "quarters" | "halves";

interface RoadmapBarViewProps {
  items: RoadmapItem[];
  currentYear: number;
  onYearChange: (year: number) => void;
  onDeleteItem: (itemId: string) => void;
  roadmapId: string;
}

const RoadmapBarView = ({ 
  items = [], 
  currentYear,
  onYearChange,
  onDeleteItem,
  roadmapId
}: RoadmapBarViewProps) => {
  const [timeScale, setTimeScale] = React.useState<TimeScale>("quarters");
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{id: string; title: string} | null>(null);
  const [itemColors, setItemColors] = useState<Record<string, string>>({});

  React.useEffect(() => {
    const colorMap: Record<string, string> = {};
    items.forEach(item => {
      colorMap[item.id] = item.color || "#9b87f5";
    });
    setItemColors(colorMap);
  }, [items]);

  const timeScales = {
    months: Array.from({ length: 12 }, (_, i) => {
      const date = new Date(currentYear, i);
      return date.toLocaleString('default', { month: 'short' });
    }),
    quarters: ["Q1", "Q2", "Q3", "Q4"],
    halves: ["H1", "H2"]
  };

  const handlePrevYear = () => onYearChange(currentYear - 1);
  const handleNextYear = () => onYearChange(currentYear + 1);

  const getColumnSpan = (item: RoadmapItem): { start: number, span: number } => {
    const startDate = new Date(item.startDate);
    const endDate = new Date(item.endDate);

    if (
      startDate.getFullYear() > currentYear || 
      endDate.getFullYear() < currentYear
    ) {
      return { start: 0, span: 0 };
    }

    const adjustedStartDate = startDate.getFullYear() < currentYear 
      ? new Date(currentYear, 0, 1) 
      : startDate;
      
    const adjustedEndDate = endDate.getFullYear() > currentYear 
      ? new Date(currentYear, 11, 31) 
      : endDate;
    
    let divisions: number;
    let startPosition: number;
    let endPosition: number;

    if (timeScale === "months") {
      divisions = 12;
      startPosition = adjustedStartDate.getMonth();
      endPosition = adjustedEndDate.getMonth();
    } else if (timeScale === "quarters") {
      divisions = 4;
      startPosition = Math.floor(adjustedStartDate.getMonth() / 3);
      endPosition = Math.floor(adjustedEndDate.getMonth() / 3);
    } else { // halves
      divisions = 2;
      startPosition = Math.floor(adjustedStartDate.getMonth() / 6);
      endPosition = Math.floor(adjustedEndDate.getMonth() / 6);
    }

    const span = Math.max(1, endPosition - startPosition + 1);
    return { start: startPosition + 1, span };
  };

  const handleDeleteItem = (itemId: string, itemTitle: string) => {
    if (confirm(`Are you sure you want to delete "${itemTitle}"?`)) {
      onDeleteItem(itemId);
      toast.success(`"${itemTitle}" was deleted`);
    }
  };

  const handleLinkProjects = (itemId: string, itemTitle: string) => {
    setSelectedItem({ id: itemId, title: itemTitle });
    setLinkDialogOpen(true);
  };

  const handleColorChange = (itemId: string, newColor: string) => {
    try {
      setItemColors(prev => ({
        ...prev,
        [itemId]: newColor
      }));
      
      updateRoadmapItemColor(roadmapId, itemId, newColor);
      toast.success("Color updated");
    } catch (error) {
      toast.error("Failed to update color");
      setItemColors(prev => ({
        ...prev,
        [itemId]: items.find(item => item.id === itemId)?.color || "#9b87f5"
      }));
    }
  };

  return (
    <>
      <Card className="p-4 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handlePrevYear}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-bold text-lg">{currentYear}</span>
            <Button variant="outline" size="icon" onClick={handleNextYear}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <Tabs value={timeScale} onValueChange={(value) => setTimeScale(value as TimeScale)} className="w-auto">
            <TabsList>
              <TabsTrigger value="months" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Months
              </TabsTrigger>
              <TabsTrigger value="quarters" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Quarters
              </TabsTrigger>
              <TabsTrigger value="halves" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Halves
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="overflow-x-auto">
          <div className="min-w-[768px]">
            <div className="grid grid-cols-12 gap-2 mb-4">
              {timeScales[timeScale].map((label, index) => (
                <div 
                  key={label}
                  className={`text-center font-medium text-sm border-b pb-2`}
                  style={{ 
                    gridColumn: timeScale === "months" ? `span 1` : 
                              (timeScale === "quarters" ? `span 3` : `span 6`) 
                  }}
                >
                  {label}
                </div>
              ))}
            </div>
            
            <div className="space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No roadmap items for {currentYear}. Add an item to get started.
                </div>
              ) : (
                items.map((item) => {
                  const { start, span } = getColumnSpan(item);
                  
                  if (span === 0) return null;
                  
                  const hasLinkedProjects = item.linkedProjects && item.linkedProjects.length > 0;
                  const itemColor = itemColors[item.id] || item.color || "#9b87f5";
                  
                  return (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-3 pr-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium text-sm">{item.title}</div>
                            <div className="text-xs text-gray-500">{item.description}</div>
                            {hasLinkedProjects && (
                              <div className="flex items-center gap-1 text-xs text-primary mt-1">
                                <Link className="h-3.5 w-3.5" />
                                <span>{item.linkedProjects!.length} project{item.linkedProjects!.length !== 1 ? 's' : ''}</span>
                              </div>
                            )}
                            {hasLinkedProjects && item.progress > 0 && (
                              <div className="mt-1 flex items-center gap-2 w-full max-w-[120px]">
                                <Progress value={item.progress} className="h-1.5 flex-1" />
                                <span className="text-xs">{item.progress}%</span>
                              </div>
                            )}
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                className="cursor-pointer flex items-center"
                                onClick={() => handleLinkProjects(item.id, item.title)}
                              >
                                <Link className="h-4 w-4 mr-2" />
                                Link Projects
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer flex items-center text-red-600"
                                onClick={() => handleDeleteItem(item.id, item.title)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <div 
                        className="rounded-md h-12 overflow-hidden relative grid place-items-center cursor-pointer"
                        style={{ 
                          gridColumn: `${start} / span ${span}`,
                          backgroundColor: itemColor,
                          opacity: 0.8 + (item.progress ? item.progress * 0.002 : 0)
                        }}
                      >
                        <ColorPickerPopover
                          currentColor={itemColor}
                          onColorChange={(newColor) => handleColorChange(item.id, newColor)}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </Card>

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

export default RoadmapBarView;
