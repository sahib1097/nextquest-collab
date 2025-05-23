import { UserLevel } from "@/types/quest";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, TrendingUp, Zap, Star, UserRound, Trophy } from "lucide-react";
import { calculateLevelProgress } from "@/utils/questUtils";
import { Progress } from "@/components/ui/progress"; 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfilePictureUploader } from "@/components/Settings/ProfilePictureUploader";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AchievementShowcase from "@/components/Social/AchievementShowcase";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

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
  const { currentTheme } = useTheme();
  const isMedievalTheme = currentTheme.name === "Medieval";
  const isCyberpunkTheme = currentTheme.name === "Cyberpunk";

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
      {isMedievalTheme ? (
        <div className="flex items-stretch justify-center w-full max-w-3xl mx-auto mb-8">
          {/* Left Banner */}
          <img
            src="/assets/themes/medieval/sprites/F_UI_RedBannerB-Left.png"
            alt="Left Banner"
            className="h-32 w-auto object-contain"
          />

          {/* Pixel-RPG Tabs */}
          <TabsList className="flex w-full max-w-md bg-[#d6c8a2] border-4 border-[#5c4a2b] rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] overflow-hidden">
            <TabsTrigger
              value="overview"
              className="relative z-10 flex-1 text-s font-bold py-4 border-r-2 border-[#5c4a2b] bg-[#d6c8a2] hover:bg-[#b8a778] active:translate-y-[2px] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5)] transition-none data-[state=active]:border-r-0 data-[state=active]:border-l-0 data-[state=active]:rounded-none"
            >
              <UserRound className="h-3 w-3 mx-1" /> Overview
            </TabsTrigger>
            <TabsTrigger
              value="achievements"
              className="relative z-10 flex-1 text-s font-bold py-4 border-r-2 border-[#5c4a2b] bg-[#d6c8a2] hover:bg-[#b8a778] active:translate-y-[2px] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5)] transition-none data-[state=active]:border-r-0 data-[state=active]:rounded-none"
            >
              <Trophy className="h-3 w-3 mx-1" /> Achievements
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="relative z-10 flex-1 text-s font-bold py-4 bg-[#d6c8a2] hover:bg-[#b8a778] active:translate-y-[2px] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5)] transition-none data-[state=active]:border-l-0 data-[state=active]:rounded-none"
            >
              <Star className="h-3 w-3 mx-1" /> Activity
            </TabsTrigger>
          </TabsList>

          {/* Right Banner */}
          <img
            src="/assets/themes/medieval/sprites/F_UI_RedBannerB.png"
            alt="Right Banner"
            className="h-32 w-auto object-contain"
          />
        </div>
      ) : isCyberpunkTheme ? (
        <div className="flex items-stretch justify-center w-full max-w-3xl mx-auto mb-8">
          <TabsList className="flex w-full max-w-md bg-[#141622] border-2 border-[#2DE2E6] rounded-lg shadow-[0_0_20px_rgba(45,226,230,0.2)] overflow-hidden backdrop-blur-sm">
            <TabsTrigger
              value="overview"
              className="relative z-10 flex-1 text-sm font-bold py-4 border-r border-[#2DE2E6] bg-transparent data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF2E97] data-[state=active]:to-[#2DE2E6] data-[state=active]:text-white data-[state=active]:shadow-[0_0_15px_rgba(45,226,230,0.3)] hover:bg-[#261D54] transition-all duration-300 data-[state=active]:border-r-0 data-[state=active]:border-l-0 data-[state=active]:rounded-l-lg data-[state=active]:-ml-1"
            >
              <UserRound className="h-4 w-4 mr-2" /> Overview
            </TabsTrigger>
            <TabsTrigger
              value="achievements"
              className="relative z-10 flex-1 text-sm font-bold py-4 border-r border-[#2DE2E6] bg-transparent data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF2E97] data-[state=active]:to-[#2DE2E6] data-[state=active]:text-white data-[state=active]:shadow-[0_0_15px_rgba(45,226,230,0.3)] hover:bg-[#261D54] transition-all duration-300 data-[state=active]:border-r-0"
            >
              <Trophy className="h-4 w-4 mr-2" /> Achievements
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="relative z-10 flex-1 text-sm font-bold py-4 bg-transparent data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF2E97] data-[state=active]:to-[#2DE2E6] data-[state=active]:text-white data-[state=active]:shadow-[0_0_15px_rgba(45,226,230,0.3)] hover:bg-[#261D54] transition-all duration-300 data-[state=active]:border-l-0 data-[state=active]:rounded-r-lg data-[state=active]:-mr-1 data-[state=active]:border-r-0"
            >
              <Star className="h-4 w-4 mr-2" /> Activity
            </TabsTrigger>
          </TabsList>
        </div>
      ) : (
        <TabsList className="mb-4 grid grid-cols-3 w-full max-w-sm mx-auto bg-white rounded-md border">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
      )}
      <TabsContent value="overview">
        {isMedievalTheme ? (
          <Card className="bg-[#fefefe] border-4 border-[#8b7b5b] rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)] overflow-hidden relative">
            {/* Inner pixel bevel frame */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="border-2 border-[#d6c8a2] m-1 h-full w-full" />
            </div>
            <CardHeader className="bg-[#d6c8a2] border-b-4 border-[#8b7b5b] px-4 py-2 relative z-10">
              <div className="flex justify-between items-center">
                <CardTitle className="text-md font-bold flex items-center text-[#4b3f2b]">
                  <Award className="h-6 w-6 mr-2 text-yellow-700" />
                  {safeUserLevel.username}
                </CardTitle>
                {isCyberpunkTheme ? (
                  <Badge
                    className="px-3 py-1 text-white shadow-[0_0_10px_rgba(45,226,230,0.3)]"
                    style={{ background: "linear-gradient(90deg, #FF2E97 0%, #2DE2E6 100%)", backgroundSize: "100% 100%", border: "2px solid #2DE2E6" }}
                  >
                    <Star className="h-3 w-3 mr-1 inline animate-pulse" /> Level {safeUserLevel.level}
                  </Badge>
                ) : isMedievalTheme ? (
                  <Badge className="bg-[#8b7b5b] text-white text-xs px-3 py-1 border-2 border-[#4b3f2b]">
                    <Star className="h-3 w-3 mr-1 inline" /> Level {safeUserLevel.level}
                  </Badge>
                ) : (
                  <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 px-3 py-1">
                    <Star className="h-3 w-3 mr-1 inline" /> Level {safeUserLevel.level}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="px-4 py-6 bg-[#fcf9f0] text-[#4b3f2b] relative z-10">
              <div className="flex items-start">
                {/* Profile Picture */}
                <ProfilePictureUploader onUpload={handleProfilePictureUpload}>
                  <div className="relative mr-4 flex-shrink-0">
                    <Avatar className="h-16 w-16 border-2 border-[#8b7b5b] shadow-sm">
                      {safeUserLevel.profilePicture ? (
                        <AvatarImage src={safeUserLevel.profilePicture} alt={safeUserLevel.username} />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-br from-[#8b7b5b] to-[#5c4a2b] text-white text-xl font-medium">
                          {safeUserLevel.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 rounded-full bg-white p-0.5 shadow-sm">
                      <div className="rounded-full bg-[#8b7b5b] p-1">
                        <UserRound className="h-3 w-3 text-white" />
                      </div>
                    </div>
                  </div>
                </ProfilePictureUploader>
                
                <div className="flex-1">
                  <div className="mb-3 flex justify-between items-center text-sm">
                    <div className="flex items-center">
                      <Zap className="h-4 w-4 mr-1 text-amber-700" />
                      <span className="font-medium">{safeUserLevel.xp} XP</span>
                    </div>
                    {safeUserLevel.level < 100 && (
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1 text-[#8b7b5b]" />
                        <span>{xpForNextLevel} XP to Level {safeUserLevel.level + 1}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Enhanced XP Progress Bar */}
                  <div className="w-full flex justify-start">
                    {/* Wider responsive container */}
                    <div className="relative w-full h-8 flex items-center">
                      
                      {/* Full Bar Track */}
                      <div className="absolute inset-0 flex w-full">
                        <img src="/assets/themes/medieval/sprites/tile000.png" className="h-full w-auto" alt="bar-left" />
                        
                        <div
                          className="flex-1 h-full bg-repeat-x"
                          style={{
                            backgroundImage: "url('/assets/themes/medieval/sprites/tile001.png')",
                            backgroundSize: "auto 100%",
                          }}
                        />
                        
                        <img src="/assets/themes/medieval/sprites/tile002.png" className="h-full w-auto" alt="bar-right" id="trackRightCap" />
                      </div>

                      {/* Progress Fill */}
                      <div
                        className="absolute inset-y-0 left-0 flex items-center overflow-hidden"
                        style={{ width: `${progress}%` }}
                      >
                        <img src="/assets/themes/medieval/sprites/GreenBar3.png" className="h-2 w-auto ml-8 pl-5" alt="bar-left" />
                        
                        <div
                          className="flex-1 h-2 bg-repeat-x"
                          style={{
                            backgroundImage: "url('/assets/themes/medieval/sprites/F_UI_GreenBar.png')",
                            backgroundSize: "auto 100%",
                          }}
                        />
                        
                        <img src="/assets/themes/medieval/sprites/GreenBar2.png" className="h-2 w-auto" alt="bar-right" />
                      </div>

                      {/* Progress Text under track right cap */}
                      <div className="absolute -bottom-5 right-0 text-xs text-gray-500 font-medium">
                        {progress}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : isCyberpunkTheme ? (
          <Card className="bg-[#141622]/80 border-2 border-[#2DE2E6] shadow-[0_0_30px_rgba(45,226,230,0.2)] backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-2 border-b border-[#2DE2E6]">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center text-[#E0F2FF]">
                  <Award className="h-6 w-6 mr-2 text-[#FF2E97] filter drop-shadow-[0_0_8px_rgba(255,46,151,0.5)]" /> 
                  {safeUserLevel.username}
                </CardTitle>
                {isCyberpunkTheme ? (
                  <Badge
                    className="px-3 py-1 text-white shadow-[0_0_10px_rgba(45,226,230,0.3)]"
                    style={{ background: "linear-gradient(90deg, #FF2E97 0%, #2DE2E6 100%)", backgroundSize: "100% 100%", border: "2px solid #2DE2E6" }}
                  >
                    <Star className="h-3 w-3 mr-1 inline animate-pulse" /> Level {safeUserLevel.level}
                  </Badge>
                ) : isMedievalTheme ? (
                  <Badge className="bg-[#8b7b5b] text-white text-xs px-3 py-1 border-2 border-[#4b3f2b]">
                    <Star className="h-3 w-3 mr-1 inline" /> Level {safeUserLevel.level}
                  </Badge>
                ) : (
                  <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 px-3 py-1">
                    <Star className="h-3 w-3 mr-1 inline" /> Level {safeUserLevel.level}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-start">
                {/* Profile Picture */}
                <ProfilePictureUploader onUpload={handleProfilePictureUpload}>
                  <div className="relative mr-4 flex-shrink-0">
                    <Avatar className="h-16 w-16 border-2 border-[#2DE2E6] shadow-[0_0_15px_rgba(45,226,230,0.3)]">
                      {safeUserLevel.profilePicture ? (
                        <AvatarImage src={safeUserLevel.profilePicture} alt={safeUserLevel.username || 'User'} />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-br from-[#FF2E97] to-[#2DE2E6] text-white text-xl font-medium">
                          {(safeUserLevel.username || 'U').charAt(0).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 rounded-full bg-[#141622] p-0.5 shadow-[0_0_10px_rgba(45,226,230,0.3)] border border-[#2DE2E6]">
                      <div className="rounded-full bg-gradient-to-r from-[#FF2E97] to-[#2DE2E6] p-1">
                        <UserRound className="h-3 w-3 text-white" />
                      </div>
                    </div>
                  </div>
                </ProfilePictureUploader>
                
                <div className="flex-1">
                  <div className="mb-3 flex justify-between items-center text-sm text-[#E0F2FF]">
                    <div className="flex items-center">
                      <Zap className="h-4 w-4 mr-1 text-[#FF2E97] filter drop-shadow-[0_0_8px_rgba(255,46,151,0.5)]" />
                      <span className="font-medium">{safeUserLevel.xp} XP</span>
                    </div>
                    {safeUserLevel.level < 100 && (
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1 text-[#2DE2E6] filter drop-shadow-[0_0_8px_rgba(45,226,230,0.5)]" />
                        <span>{xpForNextLevel} XP to Level {safeUserLevel.level + 1}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Enhanced XP Progress Bar */}
                  <div className="relative pt-1">
                    <div className="h-3 w-full bg-[#261D54] rounded-full border border-[#2DE2E6] shadow-[inset_0_0_10px_rgba(45,226,230,0.2)]" />
                    <div 
                      className="absolute top-1 left-0 h-3 bg-gradient-to-r from-[#FF2E97] to-[#2DE2E6] rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(45,226,230,0.3)]"
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
                    <div className="text-right text-xs mt-1 text-[#2DE2E6] font-medium filter drop-shadow-[0_0_8px_rgba(45,226,230,0.5)]">
                      {progress}%
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-2 border-blue-100 shadow-md overflow-hidden">
            <CardHeader className="pb-2 border-b border-blue-100">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center">
                  <Award className="h-6 w-6 mr-2 text-yellow-500" /> 
                  {safeUserLevel.username}
                </CardTitle>
                {isCyberpunkTheme ? (
                  <Badge
                    className="px-3 py-1 text-white shadow-[0_0_10px_rgba(45,226,230,0.3)]"
                    style={{ background: "linear-gradient(90deg, #FF2E97 0%, #2DE2E6 100%)", backgroundSize: "100% 100%", border: "2px solid #2DE2E6" }}
                  >
                    <Star className="h-3 w-3 mr-1 inline animate-pulse" /> Level {safeUserLevel.level}
                  </Badge>
                ) : isMedievalTheme ? (
                  <Badge className="bg-[#8b7b5b] text-white text-xs px-3 py-1 border-2 border-[#4b3f2b]">
                    <Star className="h-3 w-3 mr-1 inline" /> Level {safeUserLevel.level}
                  </Badge>
                ) : (
                  <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 px-3 py-1">
                    <Star className="h-3 w-3 mr-1 inline" /> Level {safeUserLevel.level}
                  </Badge>
                )}
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
        )}
      </TabsContent>
      <TabsContent value="achievements">
        <div className="pt-2">
          <AchievementShowcase userId={safeUserLevel.userId} expanded={true} />
        </div>
      </TabsContent>
      {publicProfile && (
        <TabsContent value="activity">
          <div className="pt-2">
            {isMedievalTheme ? (
              <Card className="bg-[#fefefe] border-4 border-[#8b7b5b] rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)] overflow-hidden relative">
                {/* Inner pixel bevel frame */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="border-2 border-[#d6c8a2] m-1 h-full w-full" />
                </div>
                <CardHeader className="bg-[#d6c8a2] border-b-4 border-[#8b7b5b] px-4 py-2 relative z-10">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-700" />
                    <CardTitle className="text-base font-bold text-[#4b3f2b]">Recent Activity</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pt-2 bg-[#fcf9f0] relative z-10">
                  {activityQuests.length === 0 ? (
                    <div className="text-sm text-[#4b3f2b] py-6 text-center">No recent activity or in-progress quests.</div>
                  ) : (
                    <div className="space-y-3">
                      {activityQuests.map((quest) => (
                        <div
                          key={quest.id}
                          className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between px-4 py-2 bg-[#d6c8a2] rounded-none border-2 border-[#8b7b5b] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]"
                        >
                          <div className="font-medium text-sm flex items-center gap-1 text-[#4b3f2b]">
                            <Star className="h-4 w-4 text-yellow-700 mr-1" />
                            {quest.name}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={
                                quest.status === "Available" ? "bg-[#8b7b5b] text-white border border-[#4b3f2b]" :
                                quest.status === "In Progress" ? "bg-[#d4b16a] text-[#4b3f2b] border border-[#8b7b5b]" : 
                                quest.status === "Completed" ? "bg-[#7a8b5b] text-white border border-[#4b3f2b]" :
                                "bg-[#8b7b5b] text-white border border-[#4b3f2b]"
                              }
                            >
                              {quest.status}
                            </Badge>
                            {quest.progress !== undefined && (
                              <span className="text-xs text-[#4b3f2b]">{quest.progress}%</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : isCyberpunkTheme ? (
              <Card className="bg-[#141622]/80 border-2 border-[#2DE2E6] shadow-[0_0_30px_rgba(45,226,230,0.2)] backdrop-blur-sm">
                <CardHeader className="pb-2 flex flex-row items-center gap-2 border-b border-[#2DE2E6]">
                  <Award className="h-5 w-5 text-[#FF2E97] filter drop-shadow-[0_0_8px_rgba(255,46,151,0.5)]" />
                  <CardTitle className="text-base font-semibold text-[#E0F2FF]">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-2">
                  {activityQuests.length === 0 ? (
                    <div className="text-sm text-[#E0F2FF] py-6 text-center">No recent activity or in-progress quests.</div>
                  ) : (
                    <div className="space-y-3">
                      {activityQuests.map((quest) => (
                        <div
                          key={quest.id}
                          className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between px-4 py-2 bg-[#261D54] rounded-lg border border-[#2DE2E6] shadow-[0_0_15px_rgba(45,226,230,0.2)]"
                        >
                          <div className="font-medium text-sm flex items-center gap-1 text-[#E0F2FF]">
                            <Star className="h-4 w-4 text-[#FF2E97] filter drop-shadow-[0_0_8px_rgba(255,46,151,0.5)] mr-1" />
                            {quest.name}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={
                                quest.status === "Available" 
                                  ? "bg-gradient-to-r from-[#FF2E97] to-[#2DE2E6] text-white" 
                                  : quest.status === "In Progress" 
                                  ? "bg-[#261D54] text-[#2DE2E6] border border-[#2DE2E6]" 
                                  : quest.status === "Completed" 
                                  ? "bg-[#2DE2E6] text-[#141622]" 
                                  : "bg-[#261D54] text-[#E0F2FF] border border-[#2DE2E6]"
                              }
                            >
                              {quest.status}
                            </Badge>
                            {quest.progress !== undefined && (
                              <span className="text-xs text-[#2DE2E6]">{quest.progress}%</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
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
            )}
          </div>
        </TabsContent>
      )}
    </Tabs>
  );
};

export default UserProfile;

