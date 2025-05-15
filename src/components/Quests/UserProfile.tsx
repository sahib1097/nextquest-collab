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
  userLevel: UserLevel;
  publicProfile?: boolean; // optional: if true, show Activity tab
}

const UserProfile = ({ userLevel, publicProfile = false }: UserProfileProps) => {
  const progress = calculateLevelProgress(userLevel.xp, userLevel.level);

  // Calculate how many XP needed for next level
  const xpForNextLevel = userLevel.level >= 100 
    ? 0 
    : userLevel.nextLevelXp - userLevel.xp;
    
  // Handle profile picture upload
  const handleProfilePictureUpload = (imageUrl: string) => {
    // Update the userLevel object with the new profile picture
    const updatedUserLevel = {
      ...userLevel,
      profilePicture: imageUrl
    };
    localStorage.setItem("fluxUserLevel", JSON.stringify(updatedUserLevel));
    toast.success("Profile picture updated!");
    setTimeout(() => window.location.reload(), 500);
  };

  // Recent quests for activity tab
  const [activityQuests, setActivityQuests] = useState<ActivityQuest[]>([]);

  useEffect(() => {
    if (publicProfile && userLevel.userId) {
      // Example: You may have a more sophisticated filter based on real quest data schema
      const quests = JSON.parse(localStorage.getItem("fluxQuests") || "[]");
      const activeQuests = quests
        .filter((q: any) =>
          (q.assignedTo === userLevel.userId || !q.assignedTo) &&
          (q.status === "In Progress" || q.status === "Available")
        )
        .slice(0, 5) // most recent 5 activities
        .map((q: any) => ({
          id: q.id,
          name: q.name,
          status: q.status,
          progress: q.progress || 0,
          startedAt: q.startedAt || q.createdAt,
        }));
      setActivityQuests(activeQuests);
    }
  }, [publicProfile, userLevel.userId]);

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="mb-4 grid grid-cols-3 w-full max-w-sm mx-auto bg-background rounded-md border">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="achievements">Achievements</TabsTrigger>
        {publicProfile && <TabsTrigger value="activity">Activity</TabsTrigger>}
      </TabsList>
      <TabsContent value="overview">
        <Card className="bg-card border-2 shadow-md overflow-hidden">
          <CardHeader className="pb-2 border-b border-border">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center">
                <Award className="h-6 w-6 mr-2 text-primary" /> 
                {userLevel.username}
              </CardTitle>
              <Badge className="bg-primary hover:bg-primary/90 px-3 py-1">
                <Star className="h-3 w-3 mr-1 inline" /> Level {userLevel.level}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-start">
              {/* Profile Picture */}
              <ProfilePictureUploader onUpload={handleProfilePictureUpload}>
                <div className="relative mr-4 flex-shrink-0">
                  <Avatar className="h-16 w-16 border-2 border-border shadow-sm">
                    {userLevel.profilePicture ? (
                      <AvatarImage src={userLevel.profilePicture} alt={userLevel.username} />
                    ) : (
                      <AvatarFallback className="bg-primary text-primary-foreground text-xl font-medium">
                        {userLevel.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-0.5 shadow-sm">
                    <div className="rounded-full bg-primary p-1">
                      <UserRound className="h-3 w-3 text-primary-foreground" />
                    </div>
                  </div>
                </div>
              </ProfilePictureUploader>
              
              <div className="flex-1">
                <div className="mb-3 flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <Zap className="h-4 w-4 mr-1 text-accent-foreground" />
                    <span className="font-medium">{userLevel.xp} XP</span>
                  </div>
                  {userLevel.level < 100 && (
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1 text-primary" />
                      <span>{xpForNextLevel} XP to Level {userLevel.level + 1}</span>
                    </div>
                  )}
                </div>
                
                {/* Enhanced XP Progress Bar */}
                <div className="relative pt-1">
                  <Progress
                    value={progress}
                    className="h-3 bg-secondary"
                  />
                  <div 
                    className="absolute top-1 left-0 h-3 bg-primary rounded-full transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                  />
                  <div className="absolute top-1 left-0 h-3 w-full">
                    {[25, 50, 75].map(milestone => (
                      <div 
                        key={milestone}
                        className={`absolute top-0 w-0.5 h-full bg-background opacity-70 ${milestone <= progress ? "animate-pulse" : ""}`}
                        style={{ left: `${milestone}%` }}
                      />
                    ))}
                  </div>
                  <div className="text-right text-xs mt-1 text-muted-foreground font-medium">{progress}%</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="achievements">
        <div className="pt-2">
          <AchievementShowcase userId={userLevel.userId} expanded={true} />
        </div>
      </TabsContent>
      {publicProfile && (
        <TabsContent value="activity">
          <div className="pt-2">
            <Card className="border-2 border-border bg-card">
              <CardHeader className="pb-2 flex flex-row items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-2">
                {activityQuests.length === 0 ? (
                  <div className="text-sm text-muted-foreground py-6 text-center">No recent activity or in-progress quests.</div>
                ) : (
                  <div className="space-y-3">
                    {activityQuests.map((quest) => (
                      <div
                        key={quest.id}
                        className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between px-4 py-2 bg-muted rounded-lg border border-border"
                      >
                        <div className="font-medium text-sm flex items-center gap-1">
                          <Star className="h-4 w-4 text-primary mr-1" />
                          {quest.name}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              quest.status === "Available" ? "secondary" :
                              quest.status === "In Progress" ? "default" : 
                              quest.status === "Completed" ? "outline" :
                              "secondary"
                            }
                          >
                            {quest.status}
                          </Badge>
                          {quest.progress !== undefined && (
                            <span className="text-xs text-muted-foreground">{quest.progress}%</span>
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

