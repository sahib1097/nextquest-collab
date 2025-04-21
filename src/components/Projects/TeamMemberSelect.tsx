
import { useState } from "react";
import { Check, User, X } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { addActivity } from "@/utils/activityLogger";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface TeamMemberSelectProps {
  value?: string;
  onChange: (value: string | undefined) => void;
  taskId: string;
  taskTitle: string;
  projectId?: string;
  projectName?: string;
}

const TeamMemberSelect = ({
  value,
  onChange,
  taskId,
  taskTitle,
  projectId,
  projectName
}: TeamMemberSelectProps) => {
  const [open, setOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    const storedMembers = localStorage.getItem("fluxTeamMembers");
    if (storedMembers) {
      return JSON.parse(storedMembers);
    }
    
    // Default team members if none exist
    const defaultMembers = [
      { id: "1", name: "Jane Doe", email: "jane@example.com" },
      { id: "2", name: "John Smith", email: "john@example.com" },
      { id: "3", name: "Alex Johnson", email: "alex@example.com" },
    ];
    localStorage.setItem("fluxTeamMembers", JSON.stringify(defaultMembers));
    return defaultMembers;
  });
  
  const selectedMember = teamMembers.find((member) => member.id === value);

  const handleSelect = (memberId: string) => {
    if (value === memberId) {
      // Unassign
      onChange(undefined);
      addActivity({
        type: "task_unassigned",
        details: `Unassigned member from task "${taskTitle}"${projectName ? ` in project "${projectName}"` : ""}`,
        timestamp: new Date().toISOString(),
        projectId
      });
    } else {
      // Assign
      onChange(memberId);
      const member = teamMembers.find((m) => m.id === memberId);
      addActivity({
        type: "task_assigned",
        details: `Assigned "${member?.name}" to task "${taskTitle}"${projectName ? ` in project "${projectName}"` : ""}`,
        timestamp: new Date().toISOString(),
        projectId
      });
    }
    setOpen(false);
  };

  const clearAssignment = () => {
    onChange(undefined);
    addActivity({
      type: "task_unassigned",
      details: `Unassigned member from task "${taskTitle}"${projectName ? ` in project "${projectName}"` : ""}`,
      timestamp: new Date().toISOString(),
      projectId
    });
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-gray-500 hover:text-gray-700"
          aria-label="Assign team member"
        >
          {selectedMember ? (
            <Avatar className="h-5 w-5 text-xs">
              <AvatarFallback className="bg-[#9b87f5] text-white">
                {selectedMember.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          ) : (
            <User className="h-4 w-4" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search team members..." />
          <CommandEmpty>No team member found</CommandEmpty>
          <CommandGroup>
            {selectedMember && (
              <div className="px-2 py-1.5">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={clearAssignment}
                >
                  <X className="mr-2 h-4 w-4" />
                  Unassign
                </Button>
              </div>
            )}
            {teamMembers.map(member => (
              <CommandItem
                key={member.id}
                value={member.name}
                onSelect={() => handleSelect(member.id)}
              >
                <Avatar className="mr-2 h-5 w-5 text-xs">
                  <AvatarFallback className="bg-[#9b87f5] text-white">
                    {member.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="flex-1 truncate">{member.name}</span>
                {value === member.id && <Check className="ml-2 h-4 w-4" />}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default TeamMemberSelect;
