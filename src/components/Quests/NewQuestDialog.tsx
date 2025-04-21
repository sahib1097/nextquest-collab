
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, User, Users } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Quest, QuestDifficulty, QuestStatus } from "@/types/quest";
import { generateXpReward } from "@/utils/questUtils";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const NewQuestDialog = () => {
  const [open, setOpen] = useState(false);
  const [questType, setQuestType] = useState<"individual" | "group">("individual");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [groupMembers, setGroupMembers] = useState<string[]>([]);
  const [newGroupMember, setNewGroupMember] = useState("");
  const [difficulty, setDifficulty] = useState<QuestDifficulty>(QuestDifficulty.MODERATE);
  const [dueDate, setDueDate] = useState("");
  const [projectId, setProjectId] = useState<string>("");
  const [projects, setProjects] = useState<any[]>([]);
  const [createNewProject, setCreateNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  useEffect(() => {
    // Load projects from localStorage
    const storedProjects = localStorage.getItem("fluxProjects");
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    }
  }, []);

  const handleAddGroupMember = () => {
    if (newGroupMember.trim() && !groupMembers.includes(newGroupMember.trim())) {
      setGroupMembers([...groupMembers, newGroupMember.trim()]);
      setNewGroupMember("");
    }
  };

  const handleRemoveGroupMember = (member: string) => {
    setGroupMembers(groupMembers.filter(m => m !== member));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!title || !description || !difficulty || !dueDate) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (questType === "individual" && !assignedTo) {
      toast.error("Please specify who the quest is assigned to");
      return;
    }

    if (questType === "group" && groupMembers.length === 0) {
      toast.error("Please add at least one group member");
      return;
    }
    
    let finalProjectId = projectId;
    let projectName = "";
    
    // Create new project if selected
    if (createNewProject && newProjectName) {
      const newProject = {
        id: uuidv4(),
        name: newProjectName,
        description: `Created from ${questType === "group" ? "group" : ""} quest: ${title}`,
        status: "Planning",
        startDate: new Date().toISOString().split('T')[0],
        dueDate: dueDate,
        category: "development",
        tasks: []
      };
      
      // Save new project to localStorage
      const updatedProjects = [...projects, newProject];
      localStorage.setItem("fluxProjects", JSON.stringify(updatedProjects));
      
      finalProjectId = newProject.id;
      projectName = newProject.name;
      
      toast.success("New project created!");
    } else if (projectId) {
      // Find project name if existing project selected
      const selectedProject = projects.find(p => p.id === projectId);
      if (selectedProject) {
        projectName = selectedProject.name;
      }
    }
    
    // Generate XP reward based on difficulty
    // For group quests, increase the reward to make it worthwhile for the group
    let xpReward = generateXpReward(difficulty);
    if (questType === "group") {
      xpReward = Math.round(xpReward * (1 + (groupMembers.length * 0.5)));
    }
    
    // Get username from UserLevel
    const storedUserLevel = localStorage.getItem("fluxUserLevel");
    const username = storedUserLevel ? JSON.parse(storedUserLevel).username : "Admin";
    
    // Create new quest
    const newQuest: Quest = {
      id: uuidv4(),
      title,
      description,
      assignedBy: username,
      assignedTo: questType === "group" ? groupMembers : assignedTo,
      isGroupQuest: questType === "group",
      groupMembers: questType === "group" ? groupMembers : undefined,
      difficulty,
      status: QuestStatus.AVAILABLE,
      xpReward,
      dueDate,
      createdAt: new Date().toISOString(),
      projectId: finalProjectId || undefined,
      projectName: projectName || undefined
    };
    
    // Save to localStorage
    const storedQuests = localStorage.getItem("fluxQuests");
    const quests = storedQuests ? [...JSON.parse(storedQuests), newQuest] : [newQuest];
    localStorage.setItem("fluxQuests", JSON.stringify(quests));
    
    toast.success(`${questType === "group" ? "Group" : ""} Quest created successfully!`);
    
    // Reset form and close dialog
    setTitle("");
    setDescription("");
    setAssignedTo("");
    setGroupMembers([]);
    setDifficulty(QuestDifficulty.MODERATE);
    setDueDate("");
    setProjectId("");
    setCreateNewProject(false);
    setNewProjectName("");
    setQuestType("individual");
    setOpen(false);
    
    // Force a reload to update the UI
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild id="new-quest-dialog">
        <Button>
          <Plus className="h-4 w-4 mr-2" /> New Quest
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Quest</DialogTitle>
          <DialogDescription>
            Create a new quest to assign tasks to team members in a fun RPG style.
          </DialogDescription>
        </DialogHeader>
        
        {/* Quest Type Tabs */}
        <Tabs value={questType} onValueChange={(value) => setQuestType(value as "individual" | "group")} className="mt-4">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="individual" className="flex items-center justify-center">
              <User className="h-4 w-4 mr-2" /> Individual Quest
            </TabsTrigger>
            <TabsTrigger value="group" className="flex items-center justify-center">
              <Users className="h-4 w-4 mr-2" /> Group Quest
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Quest Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter an epic quest title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Quest Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the quest in detail"
              />
            </div>
            
            {questType === "individual" ? (
              <div className="grid gap-2">
                <Label htmlFor="assignedTo">Assigned To</Label>
                <Input
                  id="assignedTo"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  placeholder="Team member name"
                />
              </div>
            ) : (
              <div className="grid gap-2">
                <Label>Group Members</Label>
                <div className="flex gap-2">
                  <Input
                    value={newGroupMember}
                    onChange={(e) => setNewGroupMember(e.target.value)}
                    placeholder="Add a team member"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddGroupMember();
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    onClick={handleAddGroupMember}
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {groupMembers.length === 0 ? (
                    <p className="text-sm text-gray-500">No members added yet</p>
                  ) : (
                    groupMembers.map((member, index) => (
                      <Badge key={index} variant="secondary" className="px-2 py-1">
                        {member}
                        <button
                          type="button"
                          className="ml-2 text-gray-500 hover:text-gray-800"
                          onClick={() => handleRemoveGroupMember(member)}
                        >
                          ×
                        </button>
                      </Badge>
                    ))
                  )}
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                  value={difficulty}
                  onValueChange={(value) => setDifficulty(value as QuestDifficulty)}
                >
                  <SelectTrigger id="difficulty">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={QuestDifficulty.SIMPLE}>
                      Simple {questType === "group" ? "(75-150 XP)" : "(50-100 XP)"}
                    </SelectItem>
                    <SelectItem value={QuestDifficulty.MODERATE}>
                      Moderate {questType === "group" ? "(225-450 XP)" : "(150-300 XP)"}
                    </SelectItem>
                    <SelectItem value={QuestDifficulty.DIFFICULT}>
                      Difficult {questType === "group" ? "(600-1200 XP)" : "(400-800 XP)"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
            
            {/* Project linking options */}
            <div className="grid gap-2 border-t pt-3 mt-2">
              <Label>Link to Project</Label>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input 
                    type="radio" 
                    id="existing-project" 
                    name="project-type" 
                    checked={!createNewProject} 
                    onChange={() => setCreateNewProject(false)}
                    className="mr-2"
                  />
                  <Label htmlFor="existing-project">Existing Project</Label>
                </div>
                <div>
                  <input 
                    type="radio" 
                    id="new-project" 
                    name="project-type" 
                    checked={createNewProject} 
                    onChange={() => setCreateNewProject(true)}
                    className="mr-2"
                  />
                  <Label htmlFor="new-project">Create New Project</Label>
                </div>
              </div>
              
              {createNewProject ? (
                <div className="grid gap-2 mt-2">
                  <Label htmlFor="new-project-name">New Project Name</Label>
                  <Input
                    id="new-project-name"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="Enter project name"
                  />
                </div>
              ) : (
                <div className="grid gap-2 mt-2">
                  <Label htmlFor="project">Select Project (Optional)</Label>
                  <Select
                    value={projectId}
                    onValueChange={(value) => setProjectId(value)}
                  >
                    <SelectTrigger id="project">
                      <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {projects.map(project => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              Create {questType === "group" ? "Group " : ""}Quest
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewQuestDialog;
