
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
import SpriteIcon from "../ui/SpriteIcon";

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
  const getPersistedIndex = (key: string, max: number): number => {
    const stored = localStorage.getItem(key);
    if (stored !== null) return parseInt(stored, 10);
    const randomIndex = Math.floor(Math.random() * max);
    localStorage.setItem(key, String(randomIndex));
    return randomIndex;
  };
  
  const objectIconIndex = getPersistedIndex("objectIconIndex", 64); // Assuming 8x8 grid
  const gemIconIndex = getPersistedIndex("gemIconIndex", 40); // Assuming 8x5 grid
  
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
      <div className="flex items-stretch justify-center w-full max-w-3xl mx-auto mb-8 gap-0">
        {/* Left Banner */}
        <img
          src="/assets/F_UI_RedBannerB-Left.png"
          alt="Left Banner"
          className="h-32 w-auto object-cover"
        />

        {/* Tabs */}
        <TabsList className="flex w-full max-w-md bg-[#d6c8a2] border-4 border-[#5c4a2b] rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] overflow-hidden">
          <TabsTrigger value="overview"
            className="flex-1 text-s font-bold py-4 bg-[#d6c8a2] hover:bg-[#b8a778] active:translate-y-[2px] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5)] transition-none"
          >
            Overview
          </TabsTrigger>

          <TabsTrigger value="achievements"
            className="flex-1 text-s font-bold py-4 bg-[#d6c8a2] hover:bg-[#b8a778] active:translate-y-[2px] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5)] transition-none"
          >
            Achievements
          </TabsTrigger>
          <TabsTrigger value="activity"
            className="flex-1 text-s font-bold py-4 bg-[#d6c8a2] hover:bg-[#b8a778] active:translate-y-[2px] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5)] transition-none"
          >
            Activity
          </TabsTrigger>
        </TabsList>

        {/* Right Banner */}
        <img
          src="/assets/F_UI_RedBannerB.png"
          alt="Right Banner"
          className="h-32 w-auto object-cover"
        />
      </div>

      <TabsContent value="overview">
        
      <Card className="bg-[#fefefe] border-4 border-[#8b7b5b] rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)] overflow-hidden relative">
        {/* Inner pixel bevel frame */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="border-2 border-[#d6c8a2] m-1 h-full w-full" />
        </div>
          <CardHeader className="bg-[#d6c8a2] border-b-4 border-[#8b7b5b] px-4 py-2 relative z-10">
            <div className="flex justify-between items-center">
              <CardTitle className="text-md font-bold flex items-center text-[#4b3f2b]">
                <SpriteIcon 
                  src="/assets/F_U_ObjectIconTileMap1.png"
                  index={objectIconIndex}
                  size={22}
                  columns={18}
                  className="h-6 w-6 mr-2"
                />
                {userLevel.username}
              </CardTitle>
              <Badge className="bg-[#8b7b5b] text-white text-xs px-3 py-1 border-2 border-[#4b3f2b]">
                <Star className="h-3 w-3 mr-1 inline" /> Level {userLevel.level}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="px-4 py-6 bg-[#fcf9f0] text-[#4b3f2b] relative z-10">
            <div className="flex items-start">
              {/* Profile Picture */}
              <ProfilePictureUploader onUpload={handleProfilePictureUpload}>
                <div className="relative mr-4 flex-shrink-0">
                  <Avatar className="h-16 w-16 border-2 border-purple-200 shadow-sm">
                    {userLevel.profilePicture ? (
                      <AvatarImage src={userLevel.profilePicture} alt={userLevel.username} />
                    ) : (
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-xl font-medium">
                        {userLevel.username.charAt(0).toUpperCase()}
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
                    <span className="font-medium">{userLevel.xp} XP</span>
                  </div>
                  {userLevel.level < 100 && (
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1 text-blue-500" />
                      <span>{xpForNextLevel} XP to Level {userLevel.level + 1}</span>
                    </div>
                  )}
                </div>
                
                {/* Enhanced XP Progress Bar */}
                <div className="relative w-full max-w-[1000px] h-8 flex items-center">
                  {/* Full Bar Track */}
                  <div className="absolute inset-0 flex">
                    {/* Left cap */}
                    <img src="/assets/tile000.png" className="h-full w-auto" alt="bar-left" />

                    {/* Middle stretchable background */}
                    <div
                      className="flex-1 h-full bg-repeat-x"
                      style={{
                        backgroundImage: "url('/assets/tile001.png')",
                        backgroundSize: "auto 100%",
                      }}
                    />

                    {/* Right cap */}
                    <img src="/assets/tile002.png" className="h-full w-auto" alt="bar-right" />
                  </div>

                  {/* Progress Fill */}
                  <div
                    className="absolute inset-y-0 left-0 flex items-center overflow-hidden"
                    style={{ width: `${progress}%` }}
                  >
                    {/* Left cap */}
                    <img src="/assets/GreenBar3.png" className="h-2 w-auto ml-8 pl-5" alt="bar-left" />

                    {/* Middle fill */}
                    <div
                      className="flex-1 h-2 bg-repeat-x"
                      style={{
                        backgroundImage: "url('/assets/F_UI_GreenBar.png')",
                        backgroundSize: "auto 100%",
                      }}
                    />

                    {/* Right cap */}
                    <img src="/assets/GreenBar2.png" className="h-2 w-auto" alt="bar-right" />
                  </div>

                  {/* Optional milestone markers 
                  {[25, 50, 75].map((milestone) => (
                    <div
                      key={milestone}
                      className={`absolute top-0 w-0.5 h-full bg-white opacity-70 ${
                        milestone <= progress ? "animate-pulse" : ""
                      }`}
                      style={{ left: `${milestone}%` }}
                    />
                  ))}*/}

                  {/* Text */}
                  <div className="absolute -bottom-5 right-0 text-xs text-gray-500 font-medium">
                    {progress}%
                  </div>
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

