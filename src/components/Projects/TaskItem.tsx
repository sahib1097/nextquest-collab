import { useState } from "react";
import { Check, Tag, Trash2, AlertCircle, Circle } from "lucide-react";
import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import TeamMemberSelect from "./TeamMemberSelect";
import { toast } from "sonner";
import { QuestDifficulty, QuestStatus } from "@/types/quest";
import { v4 as uuidv4 } from "uuid";
import { generateXpReward } from "@/utils/questUtils";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export const PRIORITY_LEVELS = [
  { value: "low", label: "Low", color: "#0EA5E9" },
  { value: "medium", label: "Medium", color: "#F97316" },
  { value: "high", label: "High", color: "#ea384c" },
  { value: "critical", label: "Critical", color: "#D946EF" },
];

export const AVAILABLE_TAGS = [
  "bug", 
  "feature", 
  "documentation", 
  "enhancement", 
  "design", 
  "testing",
  "backend",
  "frontend"
];

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority?: string;
  tags?: string[];
  assignedTo?: string;
  questId?: string;
}

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  projectId?: string;
  projectName?: string;
}

const TaskItem = ({ 
  task, 
  onToggleComplete, 
  onDeleteTask, 
  onUpdateTask,
  projectId,
  projectName
}: TaskItemProps) => {
  const [showTagMenu, setShowTagMenu] = useState(false);
  const [questDialogOpen, setQuestDialogOpen] = useState(false);
  const [questDifficulty, setQuestDifficulty] = useState<QuestDifficulty>(QuestDifficulty.MODERATE);
  
  const handleTagSelect = (tag: string) => {
    const currentTags = task.tags || [];
    const updatedTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    
    onUpdateTask(task.id, { tags: updatedTags });
  };
  
  const handlePriorityChange = (value: string) => {
    onUpdateTask(task.id, { priority: value });
  };

  const handleAssigneeChange = (memberId: string | undefined) => {
    onUpdateTask(task.id, { assignedTo: memberId });
  };
  
  const priorityColor = PRIORITY_LEVELS.find(p => p.value === task.priority)?.color || "#9b87f5";

  const createQuestFromTask = () => {
    const storedUserLevel = localStorage.getItem("fluxUserLevel");
    const username = storedUserLevel ? JSON.parse(storedUserLevel).username : "Admin";
    
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
    const dueDateStr = dueDate.toISOString().split('T')[0];
    
    const xpReward = generateXpReward(questDifficulty);
    
    const questId = uuidv4();
    
    const newQuest = {
      id: questId,
      title: task.title,
      description: `Complete this task from project: ${projectName || "Unknown"}`,
      assignedBy: username,
      assignedTo: task.assignedTo || "",
      difficulty: questDifficulty,
      status: QuestStatus.AVAILABLE,
      xpReward,
      dueDate: dueDateStr,
      createdAt: new Date().toISOString(),
      projectId: projectId,
      projectName: projectName,
      linkedTaskId: task.id
    };
    
    const storedQuests = localStorage.getItem("fluxQuests");
    const quests = storedQuests ? [...JSON.parse(storedQuests), newQuest] : [newQuest];
    localStorage.setItem("fluxQuests", JSON.stringify(quests));
    
    onUpdateTask(task.id, { questId });
    
    setQuestDialogOpen(false);
    toast.success("Quest created from task!");
  };
  
  const isLinkedToQuest = () => {
    if (!task.questId) return false;
    
    const storedQuests = localStorage.getItem("fluxQuests");
    if (!storedQuests) return false;
    
    const quests = JSON.parse(storedQuests);
    return quests.some((q: any) => q.id === task.questId);
  };

  const updateTaskFromQuests = () => {
    const storedQuests = localStorage.getItem("fluxQuests");
    if (!storedQuests || !task.questId) return;
    
    const quests = JSON.parse(storedQuests);
    const linkedQuest = quests.find((q: any) => q.id === task.questId);
    
    if (linkedQuest && linkedQuest.status === QuestStatus.COMPLETED && !task.completed) {
      onToggleComplete(task.id);
    }
  };
  
  if (task.questId) {
    updateTaskFromQuests();
  }
  
  const questLinked = isLinkedToQuest();
  
  return (
    <div 
      className={`flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 ${
        task.completed ? "opacity-70" : ""
      }`}
    >
      <div className="relative cursor-pointer" onClick={() => onToggleComplete(task.id)}>
        {task.completed ? (
          <div className="relative">
            <Circle className="h-5 w-5 text-green-500 fill-green-500" />
            <Check className="h-3 w-3 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
        ) : (
          <Circle className="h-5 w-5 text-gray-900" />
        )}
        
        {task.completed && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 500, 
              damping: 15 
            }}
            className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5 opacity-0"
          >
            <Check className="h-2 w-2 text-white" />
          </motion.div>
        )}
      </div>
      
      <label 
        htmlFor={`task-${task.id}`}
        className={`flex-1 cursor-pointer ${task.completed ? "line-through text-gray-400" : ""}`}
      >
        {task.title}
      </label>
      
      <div className="flex items-center gap-2">
        {task.tags && task.tags.length > 0 && (
          <div className="flex gap-1 flex-wrap max-w-[150px]">
            {task.tags.map(tag => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="text-xs py-0 px-1 bg-gray-50"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        <TeamMemberSelect 
          value={task.assignedTo} 
          onChange={handleAssigneeChange}
          taskId={task.id}
          taskTitle={task.title}
          projectId={projectId}
          projectName={projectName}
        />
        
        <Popover open={showTagMenu} onOpenChange={setShowTagMenu}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <Tag className="h-3.5 w-3.5 text-gray-500" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-52 p-2" align="end">
            <div className="space-y-1">
              <p className="text-xs text-gray-500 mb-2">Select tags:</p>
              {AVAILABLE_TAGS.map(tag => (
                <div key={tag} className="flex items-center">
                  <Checkbox 
                    id={`tag-${task.id}-${tag}`} 
                    checked={(task.tags || []).includes(tag)}
                    onCheckedChange={() => handleTagSelect(tag)}
                  />
                  <label 
                    htmlFor={`tag-${task.id}-${tag}`}
                    className="ml-2 text-sm cursor-pointer"
                  >
                    {tag}
                  </label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className={`h-7 w-7 p-0 ${questLinked ? 'text-purple-500' : 'text-gray-500 hover:text-purple-500'}`}
          onClick={() => setQuestDialogOpen(true)}
          disabled={task.completed}
          title={questLinked ? "Task linked to quest" : "Create quest from task"}
        >
          <AlertCircle className="h-3.5 w-3.5" />
        </Button>
        
        <Select 
          value={task.priority || "none"} 
          onValueChange={handlePriorityChange}
        >
          <SelectTrigger className="h-7 w-[90px] border-0 p-0 pl-2 focus:ring-0">
            <div 
              className="w-2 h-2 rounded-full mr-2" 
              style={{ backgroundColor: priorityColor }}
            />
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {PRIORITY_LEVELS.map(priority => (
              <SelectItem key={priority.value} value={priority.value}>
                <div className="flex items-center">
                  <div 
                    className="w-2 h-2 rounded-full mr-2" 
                    style={{ backgroundColor: priority.color }}
                  />
                  {priority.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 w-7 p-0 text-gray-500 hover:text-red-500"
          onClick={() => onDeleteTask(task.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      
      <Dialog open={questDialogOpen} onOpenChange={setQuestDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{questLinked ? "Quest Details" : "Create Quest from Task"}</DialogTitle>
          </DialogHeader>
          
          {questLinked ? (
            <div className="py-4">
              <p>This task is already linked to a quest.</p>
              <p className="mt-2">When the quest is completed, this task will be automatically marked as complete.</p>
              <div className="mt-4">
                <Button 
                  onClick={() => {
                    setQuestDialogOpen(false);
                    window.location.href = '/admin/quests';
                  }}
                  className="w-full"
                >
                  View Quest Board
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="task-title">Task</Label>
                  <p className="text-sm font-medium mt-1">{task.title}</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="quest-difficulty">Quest Difficulty</Label>
                  <Select 
                    value={questDifficulty} 
                    onValueChange={(value) => setQuestDifficulty(value as QuestDifficulty)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={QuestDifficulty.SIMPLE}>Simple (50-100 XP)</SelectItem>
                      <SelectItem value={QuestDifficulty.MODERATE}>Moderate (150-300 XP)</SelectItem>
                      <SelectItem value={QuestDifficulty.DIFFICULT}>Difficult (400-800 XP)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => setQuestDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={createQuestFromTask}>
                  Create Quest
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskItem;
