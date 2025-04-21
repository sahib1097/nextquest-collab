import React, { useState, useEffect } from "react";
import { GripVertical, UserPlus, Users, Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { QuestDifficulty } from "@/types/quest";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface TeamMember {
  id: string;
  name: string;
  email: string;
}

interface GroupQuestAssignDialogProps {
  open: boolean;
  onClose: () => void;
  project: any;
}

const GroupQuestAssignDialog = ({ open, onClose, project }: GroupQuestAssignDialogProps) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [assignedMembers, setAssignedMembers] = useState<TeamMember[]>([]);
  const [difficulty, setDifficulty] = useState<string>(QuestDifficulty.MODERATE);
  const { toast } = useToast();
  
  useEffect(() => {
    const storedMembers = localStorage.getItem("fluxTeamMembers");
    if (storedMembers) {
      const parsed = JSON.parse(storedMembers);
      setTeamMembers(parsed);
    }
  }, []);

  const onDragStart = (e: React.DragEvent, member: TeamMember) => {
    e.dataTransfer.setData("member", JSON.stringify(member));
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const member = JSON.parse(e.dataTransfer.getData("member")) as TeamMember;
    
    if (!assignedMembers.some(m => m.id === member.id)) {
      setAssignedMembers([...assignedMembers, member]);
    }
  };

  const removeMember = (id: string) => {
    setAssignedMembers(assignedMembers.filter(member => member.id !== id));
  };

  const createGroupQuest = () => {
    if (assignedMembers.length === 0) {
      toast({
        title: "No members assigned",
        description: "Please assign at least one member to the group quest",
        variant: "destructive",
      });
      return;
    }

    const baseDifficultyXP = {
      [QuestDifficulty.SIMPLE]: 100,
      [QuestDifficulty.MODERATE]: 300,
      [QuestDifficulty.DIFFICULT]: 600,
    }[difficulty];
    
    const groupSizeMultiplier = 1 + ((assignedMembers.length - 1) * 0.2);
    const xpReward = Math.round(baseDifficultyXP * groupSizeMultiplier);

    const quest = {
      id: `quest-${project.id}-group-${Date.now()}`,
      title: project.name,
      description: project.description,
      assignedBy: "You",
      assignedTo: [],
      isGroupQuest: true,
      groupMembers: assignedMembers.map(member => member.name),
      difficulty: difficulty,
      status: "AVAILABLE",
      xpReward: xpReward,
      dueDate: project.dueDate,
      createdAt: new Date().toISOString(),
      projectId: project.id,
      projectName: project.name
    };

    const existingQuests = JSON.parse(localStorage.getItem("fluxQuests") || "[]");
    localStorage.setItem("fluxQuests", JSON.stringify([...existingQuests, quest]));

    const existingProjects = JSON.parse(localStorage.getItem("fluxProjects") || "[]");
    const updatedProjects = existingProjects.map((p: any) => 
      p.id === project.id ? { ...p, isGroupQuest: true } : p
    );
    localStorage.setItem("fluxProjects", JSON.stringify(updatedProjects));

    toast({
      title: "Group Quest Created",
      description: `${project.name} has been converted to a group quest with ${assignedMembers.length} member${assignedMembers.length > 1 ? 's' : ''}`,
    });

    onClose();
    
    window.location.reload();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Team Members to Group Quest</DialogTitle>
          <DialogDescription>
            Drag and drop team members to assign them to this group quest.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="border rounded-md p-3">
            <h3 className="text-sm font-medium mb-2 flex items-center">
              <Users className="h-4 w-4 mr-1" /> Available Team Members
            </h3>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {teamMembers.map(member => (
                <div
                  key={member.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, member)}
                  className="flex items-center p-2 border rounded-md bg-white cursor-grab hover:bg-gray-50 transition-colors"
                >
                  <GripVertical className="h-4 w-4 text-gray-400 mr-2" />
                  <Avatar className="h-7 w-7 mr-2">
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.email}</p>
                  </div>
                </div>
              ))}
              {teamMembers.length === 0 && (
                <div className="text-center py-4 text-sm text-gray-500">
                  No team members available
                </div>
              )}
            </div>
          </div>

          <div 
            className="border rounded-md p-3 bg-gray-50 min-h-[200px]"
            onDrop={onDrop}
            onDragOver={onDragOver}
          >
            <h3 className="text-sm font-medium mb-2 flex items-center">
              <UserPlus className="h-4 w-4 mr-1" /> Assigned to Quest
            </h3>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {assignedMembers.map(member => (
                <div
                  key={member.id}
                  className="flex justify-between items-center p-2 border rounded-md bg-white"
                >
                  <div className="flex items-center">
                    <Avatar className="h-7 w-7 mr-2">
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium">{member.name}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeMember(member.id)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              {assignedMembers.length === 0 && (
                <div className="text-center py-8 text-sm text-gray-500 border-2 border-dashed rounded-md flex flex-col items-center justify-center">
                  <UserPlus className="h-6 w-6 mb-2 text-gray-400" />
                  Drop team members here
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="my-4 border-t pt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Quest Difficulty</h3>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="text-sm">
                XP Reward: {assignedMembers.length > 0 ? 
                  `${Math.round((assignedMembers.length * 100) * (difficulty === QuestDifficulty.SIMPLE ? 1 : difficulty === QuestDifficulty.MODERATE ? 3 : 6))}` : 
                  "Set difficulty & assign members"}
              </span>
            </div>
          </div>
          <Select 
            value={difficulty} 
            onValueChange={setDifficulty}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={QuestDifficulty.SIMPLE}>
                <div className="flex items-center">
                  <Badge className="bg-green-500 mr-2">Simple</Badge>
                  <span>Lower XP, easier task</span>
                </div>
              </SelectItem>
              <SelectItem value={QuestDifficulty.MODERATE}>
                <div className="flex items-center">
                  <Badge className="bg-yellow-500 mr-2">Moderate</Badge>
                  <span>Medium XP, balanced task</span>
                </div>
              </SelectItem>
              <SelectItem value={QuestDifficulty.DIFFICULT}>
                <div className="flex items-center">
                  <Badge className="bg-red-500 mr-2">Difficult</Badge>
                  <span>Higher XP, challenging task</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={createGroupQuest}
            disabled={assignedMembers.length === 0}
          >
            Create Group Quest
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GroupQuestAssignDialog;
