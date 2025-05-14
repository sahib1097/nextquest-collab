import { UserLevel } from "@/types/quest";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, TrendingUp, Zap, Star, UserRound } from "lucide-react";
import { calculateLevelProgress } from "@/utils/questUtils";
import { Progress } from "@/components/ui/progress"; 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfilePictureUploader } from "@/components/Settings/ProfilePictureUploader";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AchievementShowcase from "@/components/Social/AchievementShowcase";
import React, { useEffect, useState } from "react";

// Dummy type for quest activity data (fetch from your quest system in real use)
type ActivityQuest = {
  id: string;
  name: string;
  status: string;
  progress?: number;
  startedAt?: string;
};

interface UserProfileProps {
  userLevel?: UserLevel;
  publicProfile?: boolean; // optional: if true, show Activity tab
}

const UserProfile = ({ userLevel, publicProfile = false }: UserProfileProps) => {
  // Default values if userLevel is undefined
  const defaultUserLevel: UserLevel = {
    userId: 'guest',
    username: 'Guest User',
    xp: 0,
    level: 1,
    nextLevelXp: 100,
    profilePicture: undefined
  };

  // Use provided userLevel or fallback to default
  const safeUserLevel = userLevel || defaultUserLevel;
  const progress = calculateLevelProgress(safeUserLevel.xp, safeUserLevel.level);

  // Calculate how many XP needed for next level
  const xpForNextLevel = safeUserLevel.level >= 100 
    ? 0 
    : safeUserLevel.nextLevelXp - safeUserLevel.xp;
    
  // Handle profile picture upload
  const handleProfilePictureUpload = (imageUrl: string) => {
    // Update the userLevel object with the new profile picture
    const updatedUserLevel = {
      ...safeUserLevel,
      profilePicture: imageUrl
    };
    localStorage.setItem("fluxUserLevel", JSON.stringify(updatedUserLevel));
    toast.success("Profile picture updated!");
    setTimeout(() => window.location.reload(), 500);
  };

  // Recent quests for activity tab
  const [activityQuests, setActivityQuests] = useState<ActivityQuest[]>([]);

  useEffect(() => {
    if (publicProfile && safeUserLevel.userId) {
      // Example: You may have a more sophisticated filter based on real quest data schema
      const quests = JSON.parse(localStorage.getItem("fluxQuests") || "[]");
      const activeQuests = quests
        .filter((q: { assignedTo?: string; status: string }) =>
          (q.assignedTo === safeUserLevel.userId || !q.assignedTo) &&
          (q.status === "In Progress" || q.status === "Available")
        )
        .slice(0, 5) // most recent 5 activities
        .map((q: { id: string; name: string; status: string; progress?: number; startedAt?: string; createdAt?: string }) => ({
          id: q.id,
          name: q.name,
          status: q.status,
          progress: q.progress || 0,
          startedAt: q.startedAt || q.createdAt,
        }));
      setActivityQuests(activeQuests);
    }
  }, [publicProfile, safeUserLevel.userId]);

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="mb-4 grid grid-cols-3 w-full max-w-sm mx-auto bg-white rounded-md border">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="achievements">Achievements</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <Card className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-2 border-blue-100 shadow-md overflow-hidden">
          <CardHeader className="pb-2 border-b border-blue-100">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center">
                <Award className="h-6 w-6 mr-2 text-yellow-500" /> 
                {safeUserLevel.username}
              </CardTitle>
              <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 px-3 py-1">
                <Star className="h-3 w-3 mr-1 inline" /> Level {safeUserLevel.level}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-start">
              {/* Profile Picture */}
              <ProfilePictureUploader onUpload={handleProfilePictureUpload}>
                <div className="relative mr-4 flex-shrink-0">
                  <Avatar className="h-16 w-16 border-2 border-purple-200 shadow-sm">
                    {safeUserLevel.profilePicture ? (
                      <AvatarImage src={safeUserLevel.profilePicture} alt={safeUserLevel.username || 'User'} />
                    ) : (
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-xl font-medium">
                        {(safeUserLevel.username || 'U').charAt(0).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 rounded-full bg-white p-0.5 shadow-sm">
                    <div className="rounded-full bg-purple-500 p-1">
                      <UserRound className="h-3 w-3 text-white" />
                    </div>
                  </div>
                </div>
              </ProfilePictureUploader>
              
              <div className="flex-1">
                <div className="mb-3 flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <Zap className="h-4 w-4 mr-1 text-amber-500" />
                    <span className="font-medium">{safeUserLevel.xp} XP</span>
                  </div>
                  {safeUserLevel.level < 100 && (
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1 text-blue-500" />
                      <span>{xpForNextLevel} XP to Level {safeUserLevel.level + 1}</span>
                    </div>
                  )}
                </div>
                
                {/* Enhanced XP Progress Bar */}
                <div className="relative pt-1">
                  <Progress
                    value={progress}
                    className="h-3 bg-blue-100"
                  />
                  <div 
                    className="absolute top-1 left-0 h-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                  />
                  <div className="absolute top-1 left-0 h-3 w-full">
                    {[25, 50, 75].map(milestone => (
                      <div 
                        key={milestone}
                        className={`absolute top-0 w-0.5 h-full bg-white opacity-70 ${milestone <= progress ? "animate-pulse" : ""}`}
                        style={{ left: `${milestone}%` }}
                      />
                    ))}
                  </div>
                  <div className="text-right text-xs mt-1 text-gray-500 font-medium">{progress}%</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="achievements">
        <div className="pt-2">
          <AchievementShowcase userId={safeUserLevel.userId} expanded={true} />
        </div>
      </TabsContent>
      {publicProfile && (
        <TabsContent value="activity">
          <div className="pt-2">
            <Card className="border-2 border-blue-100 bg-white">
              <CardHeader className="pb-2 flex flex-row items-center gap-2">
                <Award className="h-5 w-5 text-purple-600" />
                <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-2">
                {activityQuests.length === 0 ? (
                  <div className="text-sm text-gray-500 py-6 text-center">No recent activity or in-progress quests.</div>
                ) : (
                  <div className="space-y-3">
                    {activityQuests.map((quest) => (
                      <div
                        key={quest.id}
                        className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between px-4 py-2 bg-blue-50 rounded-lg border border-blue-100"
                      >
                        <div className="font-medium text-sm flex items-center gap-1">
                          <Star className="h-4 w-4 text-amber-400 mr-1" />
                          {quest.name}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              quest.status === "Available" ? "bg-gray-200 text-gray-600" :
                              quest.status === "In Progress" ? "bg-blue-200 text-blue-800" : 
                              quest.status === "Completed" ? "bg-green-100 text-green-700" :
                              "bg-gray-100 text-gray-400"
                            }
                          >
                            {quest.status}
                          </Badge>
                          {quest.progress !== undefined && (
                            <span className="text-xs text-gray-500">{quest.progress}%</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      )}
    </Tabs>
  );
};

export default UserProfile;

