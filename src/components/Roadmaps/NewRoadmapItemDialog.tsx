
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { RoadmapItem, ProjectLinkOption } from "@/types/roadmap";
import { getAvailableProjects } from "@/services/roadmapService";
import { Checkbox } from "@/components/ui/checkbox";
import ColorPickerPopover from './ColorPickerPopover';

interface NewRoadmapItemDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (item: Omit<RoadmapItem, "id">) => void;
}

const NewRoadmapItemDialog: React.FC<NewRoadmapItemDialogProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [color, setColor] = useState("#9b87f5");
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [availableProjects, setAvailableProjects] = useState<ProjectLinkOption[]>([]);

  React.useEffect(() => {
    if (open) {
      const projects = getAvailableProjects();
      setAvailableProjects(projects);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !startDate || !endDate) return;

    onAdd({
      title,
      description,
      startDate,
      endDate,
      progress: 0,
      color,
      linkedProjects: selectedProjects
    });

    // Reset form
    setTitle("");
    setDescription("");
    setStartDate(undefined);
    setEndDate(undefined);
    setColor("#9b87f5");
    setSelectedProjects([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Roadmap Item</DialogTitle>
            <DialogDescription>
              Create a new item for your roadmap. Fill out the details below.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Feature name or milestone"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      disabled={(date) =>
                        startDate ? date < startDate : false
                      }
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex items-center gap-3">
                <Button 
                  type="button"
                  variant="outline" 
                  className="p-1 h-auto"
                  onClick={() => {}}
                >
                  <div 
                    className="w-8 h-8 rounded-md"
                    style={{ backgroundColor: color }}
                  />
                </Button>
                <ColorPickerPopover
                  currentColor={color}
                  onColorChange={setColor}
                />
                <span className="text-sm text-muted-foreground">
                  Select a color for the roadmap item
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Link Project(s)</Label>
              <div className="max-h-32 overflow-y-auto border rounded-md p-2">
                {availableProjects.length === 0 ? (
                  <p className="text-sm text-muted-foreground p-2">No projects available</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {availableProjects.map((project) => (
                      <div key={project.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`project-${project.id}`}
                          checked={selectedProjects.includes(project.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedProjects(prev => [...prev, project.id]);
                            } else {
                              setSelectedProjects(prev => prev.filter(id => id !== project.id));
                            }
                          }}
                        />
                        <label
                          htmlFor={`project-${project.id}`}
                          className="text-sm cursor-pointer truncate"
                        >
                          {project.name}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Item</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewRoadmapItemDialog;
