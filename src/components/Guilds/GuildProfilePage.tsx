import React, { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Castle, 
  Users, 
  Trophy, 
  Award,
  BarChart3,
  MessageSquare,
  Shield,
  Flame,
  Globe2,
  CalendarClock,
  ChevronLeft,
  Lock,
  Zap,
  Clock,
  Medal
} from "lucide-react";

import { calculateXpForLevel } from "./schema/guildFormSchema";
import { GuildProgressBar } from "./GuildProgressBar";
import { GuildAchievements } from "./GuildAchievements";
import { GuildMembersList, GuildMember } from "./GuildMembersList";

export interface GuildProfileProps {
  id: string;
  onClose: () => void;
  guild: any;
}

const mockGuildData = {
  id: "guild-1",
  name: "Code Crusaders",
  description: "A legendary band of developers questing for clean code and epic deployments.",
  logo: "/lovable-uploads/f44da06d-430c-4883-a4c2-fc7c23f90541.png",
  banner: "bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500",
  createdAt: "2025-01-15",
  level: 15,
  xp: 2250000,
  memberCount: 42,
  memberCapacity: 50,
  focus: "Work",
  region: "Global",
  tags: ["#RemoteWork", "#NightOwls"],
  isUserMember: true,
  isUserLeader: true,
  activeQuests: [
    {
      id: "gq-1",
      title: "Collectively Code 1,000 Lines",
      difficulty: "Heroic",
      reward: 500,
      progress: 78,
      deadline: "2025-05-01"
    },
    {
      id: "gq-2",
      title: "Weekend Quest Marathon",
      difficulty: "Normal",
      reward: 300,
      progress: 25,
      deadline: "2025-04-30"
    }
  ],
  chatMessages: [
    {
      id: "cm-1",
      author: "Aragorn",
      avatar: "/lovable-uploads/f44da06d-430c-4883-a4c2-fc7c23f90541.png",
      content: "Welcome to our guild hall, brave adventurers!",
      timestamp: "2025-04-15T14:30:00Z",
      reactions: ["👋", "🎉"]
    },
    {
      id: "cm-2",
      author: "Gimli",
      avatar: "/lovable-uploads/5324e09e-faa9-409b-8b3c-5eb4cb764e77.png",
      content: "Just completed the 'Debug Dragon' quest! +200 XP for our guild!",
      timestamp: "2025-04-15T15:45:00Z",
      reactions: ["🐉", "💪", "🎯"]
    }
  ],
  analytics: {
    xpPerHour: 50,
    completionRate: 85,
    topContributor: "Aragorn",
    activeDays: ["Monday", "Wednesday", "Friday"]
  }
};

const mockAchievements = [
  {
    id: "streak-masters",
    name: "Streak Masters",
    description: "Maintain a 30-day guild activity streak",
    icon: <Zap className="h-6 w-6 text-yellow-500" />,
    earned: true,
    earnedAt: "2025-03-15"
  },
  {
    id: "boss-raid",
    name: "Boss Raid Champions",
    description: "Complete a Legendary difficulty guild quest",
    icon: <Trophy className="h-6 w-6 text-purple-600" />,
    earned: false,
    progress: 65
  },
  {
    id: "night-owls",
    name: "Night Owls",
    description: "Complete 10 quests between midnight and 5 AM",
    icon: <Clock className="h-6 w-6 text-indigo-600" />,
    earned: false,
    progress: 40
  },
  {
    id: "first-recruit",
    name: "First Recruit",
    description: "Add your first guild member",
    icon: <Medal className="h-6 w-6 text-amber-600" />,
    earned: true,
    earnedAt: "2025-02-28"
  }
];

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

export function GuildProfilePage({ id, onClose, guild }: GuildProfileProps) {
  const [activeTab, setActiveTab] = useState("hall");
  const guildData = guild || mockGuildData;
  
  const nextLevelXp = calculateXpForLevel(guildData.level + 1);
  const prevLevelXp = calculateXpForLevel(guildData.level);
  
  const handleManageMember = (member: any, action: string) => {
    switch (action) {
      case "promote":
        toast.success(`${member.name} has been promoted to Officer!`);
        break;
      case "demote":
        toast.success(`${member.name} has been demoted to Member.`);
        break;
      case "kick":
        toast.success(`${member.name} has been removed from the guild.`);
        break;
      case "message":
        toast.success(`Message sent to ${member.name}.`);
        break;
    }
  };

  const handleStartQuest = (questId: string) => {
    toast.success(`You've joined the guild quest! Good luck, adventurer!`);
  };
  
  return (
    <motion.div
      className="guild-profile-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-4">
        <Button 
          variant="ghost" 
          onClick={onClose} 
          className="flex items-center text-amber-700"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Guild Hall
        </Button>
      </div>
      
      <div className={cn("p-6 mb-6 rounded-lg text-white relative overflow-hidden", guildData.banner)}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex items-start">
          <Avatar className="h-20 w-20 border-4 border-white/40 shadow-lg">
            {guildData.logo ? (
              <AvatarImage src={guildData.logo} alt={guildData.name} />
            ) : null}
            <AvatarFallback className="text-3xl bg-amber-800 text-amber-100">
              {guildData.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="ml-4 flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-1">{guildData.name}</h1>
                <div className="flex items-center text-amber-100 text-sm mb-2">
                  <div className="flex items-center">
                    <Trophy className="h-4 w-4 mr-1" />
                    Level {guildData.level} Guild
                  </div>
                  <span className="mx-2">•</span>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {guildData.memberCount}/{guildData.memberCapacity} Members
                  </div>
                  <span className="mx-2">•</span>
                  <div className="flex items-center">
                    <Globe2 className="h-4 w-4 mr-1" />
                    {guildData.region}
                  </div>
                </div>
                
                <p className="text-sm text-white/80 max-w-2xl">
                  {guildData.description}
                </p>
              </div>
              
              {guildData.isUserMember ? (
                <Badge variant="outline" className="bg-green-500/20 text-white border-green-400">
                  Member
                </Badge>
              ) : (
                <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                  Request to Join
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="hall" className="flex items-center gap-1">
                <Castle className="h-4 w-4" /> Guild Hall
              </TabsTrigger>
              <TabsTrigger value="quests" className="flex items-center gap-1">
                <Flame className="h-4 w-4" /> Quests
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex items-center gap-1">
                <Award className="h-4 w-4" /> Achievements
              </TabsTrigger>
              {guildData.isUserLeader && (
                <TabsTrigger value="analytics" className="flex items-center gap-1">
                  <BarChart3 className="h-4 w-4" /> Analytics
                </TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="hall" className="mt-6">
              <Card className="border-amber-200">
                <CardHeader className="pb-3 bg-amber-50">
                  <CardTitle className="text-lg flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-amber-600" />
                    Guild Chat
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    {guildData.level < 10 ? (
                      <div className="text-center py-8">
                        <Lock className="h-12 w-12 mx-auto text-amber-300 mb-3" />
                        <h3 className="text-lg font-semibold text-amber-800 mb-1">Guild Hall Locked</h3>
                        <p className="text-sm text-gray-600 max-w-md mx-auto">
                          Reach Guild Level 10 to unlock the Guild Hall with shared chat, GIF battles, and more features!
                        </p>
                        <div className="mt-4">
                          <GuildProgressBar 
                            currentXp={guildData.xp} 
                            level={guildData.level} 
                            className="max-w-md mx-auto"
                            showUnlocks={false}
                          />
                        </div>
                      </div>
                    ) : (
                      guildData.chatMessages.map((message) => (
                        <div key={message.id} className="flex gap-3">
                          <Avatar className="h-8 w-8">
                            {message.avatar && <AvatarImage src={message.avatar} />}
                            <AvatarFallback>{message.author.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center">
                              <span className="font-medium">{message.author}</span>
                              <span className="text-xs text-gray-500 ml-2">
                                {new Date(message.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-gray-700">{message.content}</p>
                            {message.reactions && message.reactions.length > 0 && (
                              <div className="flex gap-1 mt-1">
                                {message.reactions.map((reaction, i) => (
                                  <span key={i} className="bg-gray-100 rounded-full px-1.5 py-0.5 text-xs">
                                    {reaction}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-gray-50">
                  {guildData.level >= 10 ? (
                    <div className="flex w-full gap-2">
                      <input 
                        type="text" 
                        placeholder="Send a message..." 
                        className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm"
                      />
                      <Button>Send</Button>
                    </div>
                  ) : null}
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="quests" className="mt-6 space-y-4">
              {guildData.activeQuests.map((quest) => (
                <Card key={quest.id} className="border-amber-200">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="text-lg">{quest.title}</CardTitle>
                        <CardDescription>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "mt-1", 
                              quest.difficulty === "Heroic" 
                                ? "border-purple-200 text-purple-700" 
                                : "border-blue-200 text-blue-700"
                            )}
                          >
                            {quest.difficulty} Difficulty
                          </Badge>
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-amber-600 font-bold flex items-center justify-end">
                          <Trophy className="h-4 w-4 mr-1" />
                          {quest.reward} XP
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Due: {new Date(quest.deadline).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="mb-1 flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{quest.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-amber-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-500" 
                        style={{ width: `${quest.progress}%` }}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button 
                      onClick={() => handleStartQuest(quest.id)} 
                      className="w-full bg-amber-500 hover:bg-amber-600"
                    >
                      Join Quest
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              {guildData.activeQuests.length === 0 && (
                <div className="text-center py-12">
                  <div className="bg-gray-100 p-6 rounded-full inline-block mb-4">
                    <Flame className="h-10 w-10 text-amber-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Active Guild Quests</h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-6">
                    Guild quests will appear here when they become available or when you create them.
                  </p>
                  {guildData.isUserLeader && (
                    <Button>Create Guild Quest</Button>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="achievements" className="mt-6">
              <GuildAchievements achievements={mockAchievements} />
            </TabsContent>
            
            {guildData.isUserLeader && (
              <TabsContent value="analytics" className="mt-6">
                <Card className="border-amber-200">
                  <CardHeader className="pb-3 bg-amber-50">
                    <CardTitle className="text-lg flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2 text-amber-600" />
                      Guild Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                        <div className="text-sm font-medium text-amber-800 mb-1">XP Per Hour</div>
                        <div className="text-2xl font-bold">{guildData.analytics.xpPerHour} XP</div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="text-sm font-medium text-blue-800 mb-1">Completion Rate</div>
                        <div className="text-2xl font-bold">{guildData.analytics.completionRate}%</div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <div className="text-sm font-medium text-purple-800 mb-1">Top Contributor</div>
                        <div className="text-2xl font-bold">{guildData.analytics.topContributor}</div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="text-sm font-medium mb-3">Activity Heatmap</h4>
                      <div className="flex items-center justify-between">
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                          <div 
                            key={day}
                            className={cn(
                              "h-16 w-10 rounded-md flex items-center justify-center",
                              guildData.analytics.activeDays.includes(day.substr(0, day.length - 1) as any)
                                ? "bg-amber-500 text-white"
                                : "bg-gray-100 text-gray-400"
                            )}
                          >
                            {day}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
        
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <GuildProgressBar 
            currentXp={guildData.xp} 
            level={guildData.level} 
          />
          <GuildMembersList 
            members={mockMembers} 
            isLeader={guildData.isUserLeader} 
            onManageMember={handleManageMember}
          />
        </div>
      </div>
    </motion.div>
  );
}

import { cn } from "@/lib/utils";
