import { useState, useEffect } from "react";
import { CalendarIcon, Plus, Users, User } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Category {
  id: string;
  name: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
}

interface NewProjectDialogProps {
  addProject: (project: any) => void;
  categories: Category[];
}

const NewProjectDialog = ({ addProject, categories }: NewProjectDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [category, setCategory] = useState(categories[0]?.id || "");
  const [isGroupQuest, setIsGroupQuest] = useState(false);
  const { toast } = useToast();

  // Team member state
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [assignedMembers, setAssignedMembers] = useState<TeamMember[]>([]);
  const [individualAssigneeId, setIndividualAssigneeId] = useState("");

  useEffect(() => {
    const storedMembers = localStorage.getItem("fluxTeamMembers");
    if (storedMembers) {
      setTeamMembers(JSON.parse(storedMembers));
    }
  }, []);

  // Drag & Drop handlers for group quest members
  const onDragStart = (e: React.DragEvent, member: TeamMember) => {
    e.dataTransfer.setData("member", JSON.stringify(member));
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const member = JSON.parse(e.dataTransfer.getData("member")) as TeamMember;
    if (!assignedMembers.some(m => m.id === member.id)) {
      setAssignedMembers([...assignedMembers, member]);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeAssignedMember = (id: string) => {
    setAssignedMembers(assignedMembers.filter(member => member.id !== id));
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setDueDate(undefined);
    setCategory(categories[0]?.id || "");
    setIsGroupQuest(false);
    setAssignedMembers([]);
    setIndividualAssigneeId("");
    setOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: "Name is required",
        description: "Please enter a project name",
        variant: "destructive",
      });
      return;
    }

    // Quest assignment logic
    let isGroup = false;
    let assignedTo: string | string[] = [];
    let groupMembers: string[] = [];

    if (isGroupQuest) {
      if (assignedMembers.length > 0) {
        isGroup = true;
        assignedTo = assignedMembers.map(m => m.name);
        groupMembers = assignedMembers.map(m => m.name);
      }
    } else if (individualAssigneeId) {
      assignedTo = teamMembers.find(m => m.id === individualAssigneeId)?.name || "";
    }

    // If neither group nor individual - quest is open to everyone
    if (!isGroupQuest && !individualAssigneeId) {
      assignedTo = [];
    }

    const newProject = {
      id: Date.now().toString(),
      name,
      description,
      category,
      dueDate: dueDate ? format(dueDate, "MMMM dd, yyyy") : "No due date",
      tasks: [],
      status: "Planning",
      team: ["You"],
      progress: 0,
      isGroupQuest: isGroup,
    };

    // Quest logic
    if (isGroup || individualAssigneeId || (!isGroupQuest && !individualAssigneeId)) {
      const quest = {
        id: `quest-${newProject.id}`,
        title: name,
        description,
        assignedBy: "You",
        assignedTo: isGroup
          ? assignedTo
          : individualAssigneeId
          ? assignedTo
          : [],
        isGroupQuest: isGroup,
        groupMembers: isGroup ? groupMembers : [],
        difficulty: "MODERATE",
        status: "AVAILABLE",
        xpReward: 500,
        dueDate: newProject.dueDate,
        createdAt: new Date().toISOString(),
        projectId: newProject.id,
        projectName: name,
      };

      const existingQuests = JSON.parse(localStorage.getItem("fluxQuests") || "[]");
      localStorage.setItem("fluxQuests", JSON.stringify([...existingQuests, quest]));

      if (isGroup) {
        toast({
          title: "Group Quest Created",
          description: `${name} has been created as a group quest`,
        });
      } else if (individualAssigneeId) {
        toast({
          title: "Quest Assigned",
          description: `${name} has been assigned to ${
            teamMembers.find((m) => m.id === individualAssigneeId)?.name || "a team member"
          }`,
        });
      } else {
        toast({
          title: "Quest Available",
          description: `${name} is now available for anyone to take!`,
        });
      }
    }

    addProject(newProject);
    toast({
      title: "Project created",
      description: `${name} has been created successfully`,
    });

    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new project. Only the project name is required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="name" className="text-left">
              Project Name *
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
              required
            />
          </div>

          <div className="grid w-full items-center gap-2">
            <Label htmlFor="description" className="text-left">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter project description"
            />
          </div>

          <div className="grid w-full items-center gap-2">
            <Label htmlFor="category" className="text-left">
              Category *
            </Label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
              required
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="grid w-full items-center gap-2">
            <Label className="text-left">Due Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* NEW: Quest Assignment Section */}
          <div className="rounded-lg border px-4 py-3 bg-gray-50">
            <Label className="flex items-center gap-2 font-medium mb-2">Quest Assignment</Label>

            <div className="flex flex-wrap gap-2 items-center mb-3">
              <Button
                type="button"
                variant={isGroupQuest ? "default" : "outline"}
                className={cn("flex items-center gap-2", isGroupQuest ? "bg-[#9b87f5] text-white" : "")}
                onClick={() => {
                  setIsGroupQuest(!isGroupQuest);
                  setAssignedMembers([]);
                  setIndividualAssigneeId("");
                }}
              >
                <Users className="h-4 w-4" />
                Create as Group Quest
              </Button>
              <Button
                type="button"
                variant={!isGroupQuest && !individualAssigneeId ? "default" : "outline"}
                className={cn(
                  "flex items-center gap-2",
                  !isGroupQuest && !individualAssigneeId ? "bg-[#9b87f5] text-white" : ""
                )}
                onClick={() => {
                  setIsGroupQuest(false);
                  setIndividualAssigneeId("");
                  setAssignedMembers([]);
                }}
              >
                <Badge className="bg-blue-200 text-blue-900 px-2 py-0.5">Available for Everyone</Badge>
              </Button>
            </div>

            {/* Show assignment UI if group or individual */}
            {isGroupQuest ? (
              <div className="mt-2">
                <div className="flex gap-3">
                  <div className="w-2/5">
                    <Label className="mb-2 block text-sm text-gray-700">Team Members</Label>
                    <div className="flex flex-col gap-2 max-h-44 overflow-y-auto border rounded p-2 bg-white">
                      {teamMembers.length === 0 ? (
                        <span className="text-xs text-gray-400">No team members available</span>
                      ) : (
                        teamMembers.map(member => (
                          <div
                            key={member.id}
                            draggable
                            onDragStart={e => onDragStart(e, member)}
                            className="flex items-center cursor-grab gap-2 px-2 py-1 hover:bg-gray-100 rounded transition"
                          >
                            <Avatar className="h-7 w-7">
                              <AvatarFallback>
                                {member.name.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{member.name}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  <div
                    className="w-3/5 min-h-[90px] border rounded bg-gray-100 p-2"
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                  >
                    <Label className="block text-xs text-gray-800 mb-2">Assigned to Group Quest</Label>
                    <div className="flex flex-wrap gap-2 min-h-[40px]">
                      {assignedMembers.length === 0 ? (
                        <span className="text-xs text-gray-400">Drag members here</span>
                      ) : (
                        assignedMembers.map(member => (
                          <Badge key={member.id} className="flex items-center px-2 py-1">
                            <span>{member.name}</span>
                            <button
                              type="button"
                              onClick={() => removeAssignedMember(member.id)}
                              className="ml-2 text-gray-500 hover:text-red-400 text-xs"
                              title="Remove"
                            >
                              ×
                            </button>
                          </Badge>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-2 grid grid-cols-1 gap-1">
                <Label htmlFor="individual-assignee" className="text-xs text-gray-700 mb-1">
                  Assign to Individual (Optional)
                </Label>
                <select
                  id="individual-assignee"
                  value={individualAssigneeId}
                  onChange={e => setIndividualAssigneeId(e.target.value)}
                  className="border px-3 py-2 rounded-md bg-white focus:outline-none text-sm text-gray-700"
                >
                  <option value="">-- Unassigned (Available for Everyone) --</option>
                  {teamMembers.map(member => (
                    <option key={member.id} value={member.id}>{member.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              className="mt-2"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-[#9b87f5] hover:bg-[#7E69AB] mt-2">
              Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectDialog;

