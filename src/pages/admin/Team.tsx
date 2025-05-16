import { useEffect, useState, useCallback } from "react";
import { X, Mail, UserPlus, Search } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import RoleSelector from "@/components/Team/RoleSelector";
import { TeamMember, UserRole } from "@/types/quest";

const Team = () => {
  const [teamId, setTeamId] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [inviteEmail, setInviteEmail] = useState<string>("");
  const [inviteRole, setInviteRole] = useState<UserRole>(UserRole.USER);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const apiUrl = import.meta.env.VITE_API_URL || "";
  const token = localStorage.getItem("jwt") || "";

  // Fetch members once teamId is set
  const fetchMembers = useCallback(async () => {
    if (!teamId) return;
    try {
      const res = await fetch(`${apiUrl}/teams/${teamId}/members`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error();
      const data: TeamMember[] = await res.json();
      setTeamMembers(data);
    } catch {
      toast.error("Failed to load team members");
    }
  }, [apiUrl, token, teamId]);

  // On mount: read teamId from localStorage
  useEffect(() => {
    const t = localStorage.getItem("teamId");
    if (!t) {
      toast.error("No team selected. Please sign up or invite first.");
    }
    setTeamId(t);
  }, []);

  // Fetch members whenever teamId changes
  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleInvite = async () => {
    if (!inviteEmail.includes("@")) {
      return toast.error("Please enter a valid email");
    }
    try {
      const res = await fetch(`${apiUrl}/invites`, {
        method:      "POST",
        credentials: "include",
        headers:     { "Content-Type": "application/json" },
        body:        JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Invitation sent to ${inviteEmail}`);
      setInviteEmail("");
      setInviteRole(UserRole.USER);
      await fetchMembers();
    } catch {
      toast.error("Failed to send invite");
    }
  };

  const handleRoleChange = (memberId: string, newRole: UserRole) => {
    setTeamMembers((members) =>
      members.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
    );
    toast.success("Role updated");
    // TODO: persist change to backend
  };

  const handleRemoveMember = (memberId: string) => {
    setTeamMembers((members) => members.filter((m) => m.id !== memberId));
    toast.success("Member removed");
    // TODO: persist removal to backend
  };

  const filtered = teamMembers.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) =>
    name.split(" ").map((p) => p[0]).join("").toUpperCase();

  const getRandomColor = (id: string) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
    ];
    return colors[id.charCodeAt(0) % colors.length];
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        {/* Header & Search/Invite */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Team</h1>
            <p className="text-gray-500">Manage your team and assign roles</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search members..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={handleInvite} className="flex items-center gap-2">
              <UserPlus size={18} /> Invite
            </Button>
          </div>
        </div>

        {/* Invite Form + Member Cards */}
        <div className="flex flex-wrap gap-6">
          <Card className="w-full lg:w-[360px] border-dashed border-gray-300 bg-gray-50 p-6">
            <CardContent className="p-0 flex flex-col h-full">
              <h3 className="text-lg font-medium mb-4">Invite Member</h3>
              <div className="space-y-4 mb-4">
                <Input
                  placeholder="email@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
                <RoleSelector
                  currentRole={inviteRole}
                  onRoleChange={setInviteRole}
                  currentUserRole={UserRole.ADMIN}
                />
              </div>
              <Button onClick={handleInvite} className="w-full">
                <Mail className="mr-2 h-4 w-4" /> Send Invite
              </Button>
            </CardContent>
          </Card>

          {filtered.map((member) => (
            <Card key={member.id} className="w-full lg:w-[360px]">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <Avatar className="h-16 w-16 border-2 border-white shadow">
                    {member.avatar ? (
                      <AvatarImage src={member.avatar} alt={member.name} />
                    ) : (
                      <AvatarFallback className={getRandomColor(member.id)}>
                        {getInitials(member.name)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  {/* <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveMember(member.id)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <X />
                  </Button> */}
                </div>
                <h3 className="text-lg font-medium">{member.name}</h3>
                <p className="text-gray-500">{member.email}</p>
                <div className="mt-4">
                  <RoleSelector
                    currentRole={member.role}
                    onRoleChange={(r) => handleRoleChange(member.id, r)}
                    disabled={false}
                    currentUserRole={UserRole.ADMIN}
                  />
                </div>
                <div className="flex justify-between items-center mt-4">
                  <Badge
                    className={
                      member.status === "active"
                        ? "bg-green-100 text-green-800"
                        : member.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  >
                    {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                  </Badge>
                  {member.joinedDate && (
                    <span className="text-xs text-gray-500">
                      Joined {new Date(member.joinedDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {filtered.length === 0 && searchQuery && (
            <div className="w-full text-center py-10">
              <p className="text-gray-500">No members match your search</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Team;