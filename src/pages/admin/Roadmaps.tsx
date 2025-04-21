import { useState, useEffect } from "react";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RoadmapBarView from "@/components/Roadmaps/RoadmapBarView";
import RoadmapLinearView from "@/components/Roadmaps/RoadmapLinearView";
import NewRoadmapDialog from "@/components/Roadmaps/NewRoadmapDialog";
import NewRoadmapItemDialog from "@/components/Roadmaps/NewRoadmapItemDialog";
import { Share, BarChart, LineChart, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Roadmap, RoadmapItem } from "@/types/roadmap";
import {
  getRoadmaps,
  createRoadmap,
  addRoadmapItem,
  deleteRoadmapItem,
  deleteRoadmap,
  filterRoadmapItemsByYear,
} from "@/services/roadmapService";
import { exportRoadmapToPDF } from "@/utils/pdfExport";

const Roadmaps = () => {
  const [activeView, setActiveView] = useState<string>("bar");
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [currentRoadmapId, setCurrentRoadmapId] = useState<string>("");
  const [newRoadmapDialogOpen, setNewRoadmapDialogOpen] = useState<boolean>(false);
  const [newItemDialogOpen, setNewItemDialogOpen] = useState<boolean>(false);

  // Load roadmaps from localStorage on component mount
  useEffect(() => {
    const loadedRoadmaps = getRoadmaps();
    setRoadmaps(loadedRoadmaps);
    if (loadedRoadmaps.length > 0) {
      setCurrentRoadmapId(loadedRoadmaps[0].id);
    }
  }, []);

  // Get current roadmap and its items filtered by year
  const currentRoadmap = roadmaps.find(r => r.id === currentRoadmapId);
  const filteredItems = currentRoadmap 
    ? filterRoadmapItemsByYear(currentRoadmap.items, currentYear)
    : [];

  // Handlers for roadmap operations
  const handleAddRoadmap = (name: string) => {
    const newRoadmap = createRoadmap(name);
    setRoadmaps([...roadmaps, newRoadmap]);
    setCurrentRoadmapId(newRoadmap.id);
    toast.success(`Roadmap "${name}" created`);
  };

  const handleAddRoadmapItem = (itemData: Omit<RoadmapItem, "id" | "color">) => {
    if (currentRoadmapId) {
      const newItem = addRoadmapItem(currentRoadmapId, itemData);
      
      // Update local state to avoid reloading from localStorage
      setRoadmaps(currentRoadmaps => 
        currentRoadmaps.map(roadmap => {
          if (roadmap.id === currentRoadmapId) {
            return {
              ...roadmap,
              items: [...roadmap.items, newItem]
            };
          }
          return roadmap;
        })
      );
      
      toast.success("New roadmap item added");
    }
  };

  const handleDeleteRoadmapItem = (itemId: string) => {
    if (currentRoadmapId) {
      deleteRoadmapItem(currentRoadmapId, itemId);
      
      // Update local state to avoid reloading from localStorage
      setRoadmaps(currentRoadmaps => 
        currentRoadmaps.map(roadmap => {
          if (roadmap.id === currentRoadmapId) {
            return {
              ...roadmap,
              items: roadmap.items.filter(item => item.id !== itemId)
            };
          }
          return roadmap;
        })
      );
    }
  };

  const handleDeleteRoadmap = () => {
    if (!currentRoadmapId || roadmaps.length <= 1) return;
    
    const roadmapToDelete = roadmaps.find(r => r.id === currentRoadmapId);
    
    if (roadmapToDelete && confirm(`Are you sure you want to delete the "${roadmapToDelete.name}" roadmap?`)) {
      deleteRoadmap(currentRoadmapId);
      
      // Update local state
      const updatedRoadmaps = roadmaps.filter(r => r.id !== currentRoadmapId);
      setRoadmaps(updatedRoadmaps);
      
      // Select another roadmap
      if (updatedRoadmaps.length > 0) {
        setCurrentRoadmapId(updatedRoadmaps[0].id);
      }
      
      toast.success(`Roadmap "${roadmapToDelete.name}" deleted`);
    }
  };

  // Handle year change
  const handleYearChange = (year: number) => {
    setCurrentYear(year);
  };

  const handleExportRoadmap = () => {
    if (!currentRoadmap) return;
    exportRoadmapToPDF(currentRoadmap);
    toast.success("Roadmap exported successfully!");
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">
            {currentRoadmap?.name || "Roadmaps"}
          </h1>
          
          {roadmaps.length > 1 && (
            <div className="w-[200px]">
              <Select
                value={currentRoadmapId}
                onValueChange={(value) => setCurrentRoadmapId(value)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select roadmap" />
                </SelectTrigger>
                <SelectContent>
                  {roadmaps.map((roadmap) => (
                    <SelectItem key={roadmap.id} value={roadmap.id}>
                      {roadmap.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {currentRoadmap && (
            <div className="flex gap-2">
              <Button
                variant="ghost" 
                size="icon"
                className="text-primary hover:text-primary/90 hover:bg-primary/10"
                onClick={handleExportRoadmap}
                title="Export roadmap"
              >
                <Share className="h-4 w-4" />
              </Button>
              
              {roadmaps.length > 1 && (
                <Button
                  variant="ghost" 
                  size="icon"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={handleDeleteRoadmap}
                  title="Delete roadmap"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button 
            className="flex items-center gap-1"
            onClick={() => setNewItemDialogOpen(true)}
            disabled={!currentRoadmapId}
          >
            <Plus className="h-4 w-4" />
            New Item
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={() => setNewRoadmapDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            New Roadmap
          </Button>
        </div>
      </div>

      <Tabs 
        value={activeView} 
        onValueChange={setActiveView} 
        className="w-full mb-6"
      >
        <TabsList className="w-full max-w-md mb-6">
          <TabsTrigger 
            value="bar" 
            className="flex items-center gap-2 w-full"
          >
            <BarChart className="h-4 w-4" />
            Bar View
          </TabsTrigger>
          <TabsTrigger 
            value="linear" 
            className="flex items-center gap-2 w-full"
          >
            <LineChart className="h-4 w-4" />
            Linear View
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="bar" className="mt-2">
          <RoadmapBarView 
            items={filteredItems} 
            currentYear={currentYear} 
            onYearChange={handleYearChange}
            onDeleteItem={handleDeleteRoadmapItem}
            roadmapId={currentRoadmapId}
          />
        </TabsContent>
        
        <TabsContent value="linear" className="mt-2">
          <RoadmapLinearView 
            items={filteredItems}
            currentYear={currentYear}
            onDeleteItem={handleDeleteRoadmapItem}
            roadmapId={currentRoadmapId}
          />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <NewRoadmapDialog
        open={newRoadmapDialogOpen}
        onClose={() => setNewRoadmapDialogOpen(false)}
        onAdd={handleAddRoadmap}
      />

      <NewRoadmapItemDialog
        open={newItemDialogOpen}
        onClose={() => setNewItemDialogOpen(false)}
        onAdd={handleAddRoadmapItem}
      />
    </DashboardLayout>
  );
};

export default Roadmaps;
