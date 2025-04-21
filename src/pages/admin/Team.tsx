import { useState } from "react";
import { X, Mail, UserPlus, Search } from "lucide-react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import RoleSelector from "@/components/Team/RoleSelector";
import { TeamMember, UserRole } from "@/types/quest";

const Team = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "Alex Johnson",
      email: "alex@nextquest.com",
      role: UserRole.ADMIN,
      avatar: "https://i.pravatar.cc/150?img=1",
      status: "active",
      joinedDate: "2023-01-15"
    },
    {
      id: "2",
      name: "Jamie Smith",
      email: "jamie@nextquest.com",
      role: UserRole.USER,
      avatar: "https://i.pravatar.cc/150?img=2",
      status: "active",
      joinedDate: "2023-02-10"
    },
    {
      id: "3",
      name: "Taylor Reed",
      email: "taylor@nextquest.com",
      role: UserRole.USER,
      avatar: "https://i.pravatar.cc/150?img=3",
      status: "active",
      joinedDate: "2023-01-20"
    },
  ]);

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<UserRole>(UserRole.USER);
  const [searchQuery, setSearchQuery] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("fluxUser") || "{}");
  const currentUserRole = currentUser.role || UserRole.USER;

  const handleInvite = () => {
    if (!inviteEmail || !inviteRole) {
      toast.error("Please provide both email and role");
      return;
    }

    if (!inviteEmail.includes('@') || !inviteEmail.includes('.')) {
      toast.error("Please enter a valid email address");
      return;
    }

    const newMember: TeamMember = {
      id: uuidv4(),
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      status: "pending",
    };

    setTeamMembers([...teamMembers, newMember]);
    setInviteEmail("");
    setInviteRole(UserRole.USER);
    
    toast.success(`Invitation sent to ${inviteEmail}`);
  };

  const handleRoleChange = (memberId: string, newRole: UserRole) => {
    setTeamMembers(members =>
      members.map(member =>
        member.id === memberId
          ? { ...member, role: newRole }
          : member
      )
    );
    toast.success(`Role updated successfully`);
  };

  const handleRemoveMember = (id: string) => {
    const memberToRemove = teamMembers.find(member => member.id === id);
    if (!memberToRemove) return;

    setTeamMembers(teamMembers.filter(member => member.id !== id));
    toast.success(`${memberToRemove.name} has been removed from the team`);
  };

  const filteredMembers = teamMembers.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  const getRandomColor = (id: string) => {
    const colors = [
      "bg-blue-500", "bg-green-500", "bg-yellow-500", 
      "bg-purple-500", "bg-pink-500", "bg-indigo-500"
    ];
    const index = id.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Team</h1>
            <p className="text-gray-500">Manage your team and assign roles</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input 
                placeholder="Search team members..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button className="gap-2">
              <UserPlus size={18} />
              Invite Team
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          <Card className="w-full lg:w-[360px] border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors p-6">
            <CardContent className="p-0 h-full flex flex-col">
              <div className="flex-1">
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-4">Invite a team member</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="email" className="text-sm font-medium text-gray-700 block mb-1">
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="teammate@example.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="role" className="text-sm font-medium text-gray-700 block mb-1">
                        Role
                      </label>
                      <RoleSelector
                        currentRole={inviteRole}
                        onRoleChange={(newRole) => setInviteRole(newRole)}
                        currentUserRole={currentUserRole as UserRole}
                      />
                    </div>
                  </div>
                </div>
                <Button onClick={handleInvite} className="w-full">
                  <Mail className="mr-2 h-4 w-4" />
                  Send Invite
                </Button>
              </div>
            </CardContent>
          </Card>

          {filteredMembers.map((member) => (
            <Card key={member.id} className="w-full lg:w-[360px] overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Avatar className="h-16 w-16 border-2 border-white shadow-md">
                    {member.avatar ? (
                      <AvatarImage src={member.avatar} alt={member.name} />
                    ) : (
                      <AvatarFallback className={getRandomColor(member.id)}>
                        {getInitials(member.name)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveMember(member.id)}
                    className="text-gray-500 hover:text-red-500"
                    title="Remove team member"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="space-y-2 mt-2">
                  <h3 className="font-medium text-lg">{member.name}</h3>
                  <p className="text-gray-500 text-sm">{member.email}</p>
                  
                  <div className="mt-4">
                    <RoleSelector
                      currentRole={member.role}
                      onRoleChange={(newRole) => handleRoleChange(member.id, newRole)}
                      disabled={currentUserRole === UserRole.USER}
                      currentUserRole={currentUserRole as UserRole}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <Badge 
                      className={`${
                        member.status === "active" ? "bg-green-100 text-green-800" :
                        member.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                        "bg-gray-100 text-gray-800"
                      } hover:bg-opacity-80`}
                    >
                      {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                    </Badge>
                    {member.joinedDate && (
                      <span className="text-xs text-gray-500">
                        Joined {new Date(member.joinedDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredMembers.length === 0 && searchQuery && (
          <div className="text-center py-10">
            <p className="text-gray-500">No team members match your search</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Team;
