import React, { useState, useEffect } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Search, Link, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { getAvailableProjects, getLinkedProjectsForItem, linkProjectsToRoadmapItem } from "@/services/roadmapService";
import { ProjectLinkOption } from "@/types/roadmap";
import { toast } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";

interface LinkProjectsDialogProps {
  open: boolean;
  onClose: () => void;
  roadmapId: string;
  itemId: string;
  itemTitle: string;
}

const LinkProjectsDialog = ({
  open,
  onClose,
  roadmapId,
  itemId,
  itemTitle,
}: LinkProjectsDialogProps) => {
  const { currentTheme } = useTheme();
  const [availableProjects, setAvailableProjects] = useState<ProjectLinkOption[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [linkedProjects, setLinkedProjects] = useState<ProjectLinkOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (open) {
      try {
        const projects = getAvailableProjects();
        setAvailableProjects(projects);
        
        const currentlyLinkedProjects = getLinkedProjectsForItem(itemId);
        setLinkedProjects(currentlyLinkedProjects);
        setSelectedProjects(currentlyLinkedProjects.map(p => p.id));
      } catch (error) {
        console.error("Error loading projects:", error);
        toast.error("Failed to load projects");
      }
    }
  }, [open, itemId]);
  
  const filteredProjects = availableProjects.filter(
    project => project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleToggleProject = (projectId: string) => {
    setSelectedProjects(prev => {
      if (prev.includes(projectId)) {
        return prev.filter(id => id !== projectId);
      } else {
        return [...prev, projectId];
      }
    });
  };
  
  const handleSave = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      linkProjectsToRoadmapItem(roadmapId, itemId, selectedProjects);
      toast.success("Projects linked successfully");
      onClose();
    } catch (error) {
      console.error("Error linking projects:", error);
      toast.error("Failed to link projects");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "planning":
        return {
          background: `${currentTheme.colors.primary}20`,
          text: currentTheme.colors.primary
        };
      case "in progress":
      case "in-progress":
        return {
          background: `${currentTheme.colors.accent}20`,
          text: currentTheme.colors.accent
        };
      case "review":
        return {
          background: `${currentTheme.colors.secondary}20`,
          text: currentTheme.colors.secondary
        };
      case "completed":
        return {
          background: "#ECFDF5",
          text: "#10B981"
        };
      default:
        return {
          background: `${currentTheme.colors.secondary}20`,
          text: currentTheme.colors.secondary
        };
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="sm:max-w-md"
        style={{
          backgroundColor: currentTheme.colors.background,
          borderColor: currentTheme.colors.border
        }}
      >
        <DialogHeader>
          <DialogTitle 
            className="flex items-center gap-2"
            style={{ color: currentTheme.colors.text }}
          >
            <Link className="h-5 w-5" />
            Link Projects to Roadmap Item
          </DialogTitle>
          <DialogDescription 
            className="text-sm"
            style={{ color: currentTheme.colors.accent }}
          >
            Link existing projects to track progress on this roadmap item.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Roadmap Item</h3>
          <p className="text-base font-medium">{itemTitle}</p>
          
          {linkedProjects.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Currently Linked</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {linkedProjects.map(project => (
                  <Badge key={project.id} className={getStatusBadgeColor(project.status)}>
                    {project.name}
                  </Badge>
                ))}
              </div>
              <div className="mt-2">
                <span className="text-sm text-gray-500">Progress: </span>
                <div className="flex items-center gap-2">
                  <Progress 
                    value={linkedProjects.filter(p => p.status.toLowerCase() === "completed").length / linkedProjects.length * 100}
                    className="h-2"
                  />
                  <span className="text-xs text-gray-500">
                    {Math.round(linkedProjects.filter(p => p.status.toLowerCase() === "completed").length / linkedProjects.length * 100)}%
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-4 mb-2">
            <div className="relative flex items-center">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search projects..."
                className="pl-10 bg-background border-muted-foreground/20 focus-visible:ring-1"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="max-h-60 overflow-y-auto mt-2">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <AlertCircle className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                {searchQuery ? "No projects match your search" : "No projects available"}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredProjects.map(project => (
                  <div 
                    key={project.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                    style={{ 
                      backgroundColor: currentTheme.colors.background,
                      borderColor: currentTheme.colors.border
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedProjects.includes(project.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedProjects([...selectedProjects, project.id]);
                          } else {
                            setSelectedProjects(selectedProjects.filter(id => id !== project.id));
                          }
                        }}
                      />
                      <div>
                        <h4 
                          className="font-medium"
                          style={{ color: currentTheme.colors.text }}
                        >
                          {project.name}
                        </h4>
                        <div 
                          className="text-xs mt-1 px-2 py-0.5 rounded-full inline-block"
                          style={{
                            backgroundColor: getStatusBadgeColor(project.status).background,
                            color: getStatusBadgeColor(project.status).text
                          }}
                        >
                          {project.status}
                        </div>
                      </div>
                    </div>
                    <div 
                      className="text-sm"
                      style={{ color: currentTheme.colors.accent }}
                    >
                      {Math.round(project.progress)}%
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            style={{
              borderColor: currentTheme.colors.border,
              color: currentTheme.colors.text
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            style={{
              backgroundColor: currentTheme.colors.primary,
              color: currentTheme.colors.text
            }}
          >
            {isSubmitting ? "Linking..." : "Link Projects"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LinkProjectsDialog;
