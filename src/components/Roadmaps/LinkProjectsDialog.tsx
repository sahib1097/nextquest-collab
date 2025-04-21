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
        return "bg-blue-100 text-blue-800";
      case "in progress":
      case "in-progress":
        return "bg-amber-100 text-amber-800";
      case "review":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Link Projects to Roadmap Item
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
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
                  <div key={project.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                    <Checkbox
                      id={`project-${project.id}`}
                      checked={selectedProjects.includes(project.id)}
                      onCheckedChange={() => handleToggleProject(project.id)}
                    />
                    <label
                      htmlFor={`project-${project.id}`}
                      className="flex flex-1 items-center justify-between text-sm font-medium cursor-pointer"
                    >
                      <span>{project.name}</span>
                      <Badge className={getStatusBadgeColor(project.status)}>
                        {project.status}
                      </Badge>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? "Linking..." : "Link Projects"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LinkProjectsDialog;
