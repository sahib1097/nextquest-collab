import { useState, useEffect } from "react";
import { Check, User, X } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { addActivity } from "@/utils/activityLogger";
import {API} from "@/config"

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
  const [searchQuery, setSearchQuery] = useState("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  // Fetch team members only once when component mounts
  useEffect(() => {
    const fetchTeamMembers = async () => {
      const user = JSON.parse(localStorage.getItem("fluxUser") || "{}");
      try {
        const res = await fetch(`${API}/api/teaminfo/fetch-team-members`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            teamId: user.teamId?.[0]
          }),
        });

        if (!res.ok) {
          console.error('Failed to fetch team members:', res.statusText);
          return;
        }

        const data = await res.json();
        const members = data.teamMembers.map((member: any) => ({
          id: member._id,
          name: member.username || member.email,
          email: member.email,
          avatar: member.avatar
        }));
        setTeamMembers(members);
      } catch (error) {
        console.error("Error fetching team members:", error);
      }
    };

    fetchTeamMembers();
  }, []); // Only run once when component mounts

  // Fetch quest assignment when taskId changes or after initial team members fetch
  useEffect(() => {
    const fetchQuestAssignment = async () => {
      if (!teamMembers.length) return; // Wait for team members to be loaded

      try {
        const assignmentRes = await fetch(`${API}/api/teaminfo/fetch-quest-assignment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            questId: taskId
          }),
        });

        if (assignmentRes.ok) {
          const assignmentData = await assignmentRes.json();
          if (assignmentData.assignedTo && !initialFetchDone) {
            // Find the team member by email/name and set their ID as the value
            const assignedMember = teamMembers.find(
              m => m.email === assignmentData.assignedTo || m.name === assignmentData.assignedTo
            );
            if (assignedMember) {
              onChange(assignedMember.id);
              setInitialFetchDone(true);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching quest assignment:", error);
      }
    };

    fetchQuestAssignment();
  }, [taskId, teamMembers.length]); // Only run when taskId or teamMembers changes

  const selectedMember = teamMembers.find((member) => member.id === value);

  const filteredMembers = teamMembers.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = async (memberId: string) => {
    try {
      const user = JSON.parse(localStorage.getItem("fluxUser") || "{}");
      const selectedMember = teamMembers.find((m) => m.id === memberId);
      
      const res = await fetch(`${API}/api/teaminfo/update-quest-assignment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questId: taskId,
          assignedTo: value === memberId ? undefined : selectedMember?.name,
          assignedBy: user.username || user.email
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update quest assignment');
      }

      // If the update was successful, update the local state
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
        addActivity({
          type: "task_assigned",
          details: `Assigned "${selectedMember?.name}" to task "${taskTitle}"${projectName ? ` in project "${projectName}"` : ""}`,
          timestamp: new Date().toISOString(),
          projectId
        });
      }
    } catch (error) {
      console.error('Error updating quest assignment:', error);
      // You might want to show a toast or error message to the user here
    }
    
    setOpen(false);
  };

  const clearAssignment = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("fluxUser") || "{}");
      
      const res = await fetch(`${API}/api/teaminfo/update-quest-assignment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questId: taskId,
          assignedTo: undefined,
          assignedBy: user.username || user.email
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to clear quest assignment');
      }

      onChange(undefined);
      addActivity({
        type: "task_unassigned",
        details: `Unassigned member from task "${taskTitle}"${projectName ? ` in project "${projectName}"` : ""}`,
        timestamp: new Date().toISOString(),
        projectId
      });
    } catch (error) {
      console.error('Error clearing quest assignment:', error);
      // You might want to show a toast or error message to the user here
    }

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
          <CommandInput 
            placeholder="Search team members..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
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
              {filteredMembers.map(member => (
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
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default TeamMemberSelect;

