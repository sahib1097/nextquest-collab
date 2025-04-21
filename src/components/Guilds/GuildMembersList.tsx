
import React from "react";
import { 
  Shield, 
  Sword, 
  UserCheck, 
  Clock, 
  Gamepad2, 
  Trophy,
  MoreHorizontal,
  Crown 
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type GuildMemberStatus = "Online" | "Questing" | "AFK" | "Offline";

export interface GuildMember {
  id: string;
  name: string;
  avatar?: string;
  role: "Leader" | "Officer" | "Member";
  status: GuildMemberStatus;
  xpContribution: number;
  joinedAt: string;
}

interface GuildMembersListProps {
  members: GuildMember[];
  className?: string;
  isLeader?: boolean;
  onManageMember?: (member: GuildMember, action: string) => void;
}

const mockMembers: GuildMember[] = [
  {
    id: "1",
    name: "Aragorn",
    avatar: "/lovable-uploads/f44da06d-430c-4883-a4c2-fc7c23f90541.png",
    role: "Leader",
    status: "Online",
    xpContribution: 12500,
    joinedAt: "2025-01-15"
  },
  {
    id: "2",
    name: "Gimli",
    avatar: "/lovable-uploads/5324e09e-faa9-409b-8b3c-5eb4cb764e77.png",
    role: "Officer",
    status: "Questing",
    xpContribution: 8750,
    joinedAt: "2025-01-20"
  },
  {
    id: "3",
    name: "Legolas",
    avatar: "/lovable-uploads/7e8f508b-4ea9-4ff0-869a-00e88d532275.png",
    role: "Officer",
    status: "Online",
    xpContribution: 9200,
    joinedAt: "2025-01-18"
  },
  {
    id: "4",
    name: "Frodo",
    avatar: undefined,
    role: "Member",
    status: "AFK",
    xpContribution: 3400,
    joinedAt: "2025-02-05"
  },
  {
    id: "5",
    name: "Sam",
    avatar: undefined,
    role: "Member",
    status: "Offline",
    xpContribution: 5100,
    joinedAt: "2025-02-01"
  }
];

export function GuildMembersList({ 
  members = mockMembers, 
  className,
  isLeader = false,
  onManageMember
}: GuildMembersListProps) {
  const getStatusColor = (status: GuildMemberStatus) => {
    switch (status) {
      case "Online": return "text-green-500";
      case "Questing": return "text-blue-500";
      case "AFK": return "text-amber-500";
      case "Offline": return "text-gray-400";
    }
  };
  
  const getStatusIcon = (status: GuildMemberStatus) => {
    switch (status) {
      case "Online": return <UserCheck className="h-3 w-3" />;
      case "Questing": return <Gamepad2 className="h-3 w-3" />;
      case "AFK": return <Clock className="h-3 w-3" />;
      case "Offline": return <div className="h-3 w-3 rounded-full bg-current" />;
    }
  };
  
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Leader": return <Crown className="h-4 w-4 text-amber-500" />;
      case "Officer": return <Sword className="h-4 w-4 text-blue-500" />;
      case "Member": return <Shield className="h-4 w-4 text-gray-500" />;
      default: return <Shield className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const handleAction = (member: GuildMember, action: string) => {
    if (onManageMember) {
      onManageMember(member, action);
    }
  };
  
  return (
    <Card className={cn("border-amber-200", className)}>
      <CardHeader className="pb-2 bg-amber-50">
        <CardTitle className="text-lg flex items-center">
          <Shield className="h-5 w-5 mr-2 text-amber-600" />
          Members
          <span className="ml-auto text-sm font-normal text-amber-700">
            {members.length} Adventurers
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          {members.map((member, idx) => (
            <motion.div 
              key={member.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center justify-between bg-white p-3 rounded-md border border-slate-200"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-slate-200">
                  {member.avatar ? (
                    <AvatarImage src={member.avatar} alt={member.name} />
                  ) : null}
                  <AvatarFallback className="text-lg bg-gradient-to-br from-amber-100 to-amber-200 text-amber-800">
                    {member.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <div className="flex items-center">
                    <span className="font-medium text-slate-900">{member.name}</span>
                    <Badge variant="outline" className="ml-2 px-2 py-0 h-5 text-xs flex items-center gap-1">
                      {getRoleIcon(member.role)}
                      {member.role}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center text-xs text-slate-500 mt-0.5">
                    <span className={cn("flex items-center gap-1", getStatusColor(member.status))}>
                      {getStatusIcon(member.status)}
                      {member.status}
                    </span>
                    <span className="mx-2">•</span>
                    <span className="flex items-center gap-1">
                      <Trophy className="h-3 w-3 text-amber-500" />
                      {member.xpContribution.toLocaleString()} XP
                    </span>
                  </div>
                </div>
              </div>
              
              {isLeader && member.role !== "Leader" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {member.role === "Member" && (
                      <DropdownMenuItem onClick={() => handleAction(member, "promote")}>
                        Promote to Officer
                      </DropdownMenuItem>
                    )}
                    {member.role === "Officer" && (
                      <DropdownMenuItem onClick={() => handleAction(member, "demote")}>
                        Demote to Member
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => handleAction(member, "message")}>
                      Send Message
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleAction(member, "kick")}
                      className="text-red-600"
                    >
                      Remove from Guild
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
