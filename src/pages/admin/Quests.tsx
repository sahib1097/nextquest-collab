import { useState, useEffect } from "react";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import QuestBoard from "@/components/Quests/QuestBoard";
import UserProfile from "@/components/Quests/UserProfile";
import NewQuestDialog from "@/components/Quests/NewQuestDialog";
import QuestMap from "@/components/Quests/QuestMap/QuestMap";
import XPBoostItem from "@/components/Quests/XPBoost/XPBoostItem";
import Leaderboard from "@/components/Social/Leaderboard";
import AchievementShowcase from "@/components/Social/AchievementShowcase";
import AchievementManager from "@/components/Social/AchievementManager";
import GuildBoard from "@/components/Guilds/GuildBoard";
import LeaderboardSystem from "@/components/Social/LeaderboardSystem"; 
import { UserLevel, UserRole } from "@/types/quest";
import { XPBoost } from "@/types/boost";
import { LeaderboardScope } from "@/types/social";
import { Users, Trophy, Medal, Settings, Castle, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PhaserMap } from "../phaserMap";
import { HellMap } from "../hellMap"
import  TownMap  from "../townMap";

const Quests = () => {
  const [activeTab, setActiveTab] = useState("available");
  const [activeSection, setActiveSection] = useState("quests");
  const [userLevel, setUserLevel] = useState<UserLevel | null>(null);
  const [userRole, setUserRole] = useState<string>("user");
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAchievementManager, setShowAchievementManager] = useState(false);
  
  useEffect(() => {
    const storedUserLevel = localStorage.getItem("fluxUserLevel");
    
    if (storedUserLevel) {
      const parsedUserLevel = JSON.parse(storedUserLevel);
      setUserLevel(parsedUserLevel);
    } else {
      const userData = JSON.parse(localStorage.getItem("fluxUser") || '{"name":"User"}');
      const defaultUserLevel: UserLevel = {
        userId: "current-user",
        username: userData.name || "User",
        xp: 0,
        level: 1,
        nextLevelXp: 100,
        profilePicture: undefined,
        role: UserRole.USER
      };
      setUserLevel(defaultUserLevel);
      localStorage.setItem("fluxUserLevel", JSON.stringify(defaultUserLevel));
    }

    const userData = JSON.parse(localStorage.getItem("fluxUser") || "{}");
    setUserRole(userData.role || "user");
    
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab && ['available', 'groupQuests', 'inProgress', 'completed', 'failed'].includes(tab)) {
      setActiveTab(tab);
    }
    
    const section = params.get('section');
    if (section && ['quests', 'guilds', 'leaderboards'].includes(section)) {
      setActiveSection(section);
    }
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', value);
    window.history.pushState({}, '', url);
  };
  
  const handleSectionChange = (value: string) => {
    setActiveSection(value);
    const url = new URL(window.location.href);
    url.searchParams.set('section', value);
    window.history.pushState({}, '', url);
  };

  const canCreateQuests = userRole === "admin" || userRole === "teamLead";
  const isAdmin = userRole === "admin";

  const handleCollectBoost = (boost: XPBoost) => {
    localStorage.setItem("activeXPBoost", JSON.stringify(boost));
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Quest Board</h1>
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => setShowAchievementManager(!showAchievementManager)}
                >
                  <Settings className="h-4 w-4" />
                  {showAchievementManager ? "Hide" : "Manage"} Trophies
                </Button>
              )}
              {canCreateQuests && userLevel && activeTab === "available" && <NewQuestDialog />}
            </div>
          </div>
          
          {userLevel && (
            <div className="mb-6">
              <UserProfile userLevel={userLevel} />
              {userLevel.userId && (
                <AchievementShowcase userId={userLevel.userId} expanded={true} />
              )}
            </div>
          )}
          
          {/* Achievement Manager (admin only) */}
          {showAchievementManager && isAdmin && userLevel && (
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AchievementManager userId={userLevel.userId} />
            </motion.div>
          )}
          
          {/* Section tabs - Quests, Guilds and Leaderboards */}
          <Tabs value={activeSection} onValueChange={handleSectionChange} className="w-full mb-6">
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="quests" className="flex items-center gap-1">
                <Trophy className="h-4 w-4" /> Quests
              </TabsTrigger>
              <TabsTrigger value="guilds" className="flex items-center gap-1">
                <Castle className="h-4 w-4" /> Guilds
              </TabsTrigger>
              <TabsTrigger value="leaderboards" className="flex items-center gap-1">
                <Star className="h-4 w-4" /> Rankings
              </TabsTrigger>
            </TabsList>
          
            <TabsContent value="quests">
              <>
                <motion.div 
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <span className="bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
                      Quest Map
                    </span>
                  </h2>
                  <TownMap/>
                  {/* <QuestMap quests={JSON.parse(localStorage.getItem("fluxQuests") || "[]")} /> */}
                </motion.div>

                <XPBoostItem onCollect={handleCollectBoost} />

                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                  <TabsList className="grid grid-cols-5 w-full max-w-md mb-8">
                    <TabsTrigger value="available">Available</TabsTrigger>
                    <TabsTrigger value="groupQuests" className="flex items-center">
                      <Users className="h-4 w-4 mr-1" /> Group
                    </TabsTrigger>
                    <TabsTrigger value="inProgress">In Progress</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                    <TabsTrigger value="failed">Failed</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="available">
                    <QuestBoard status="Available" questType="individual" />
                  </TabsContent>

                  <TabsContent value="groupQuests">
                    <QuestBoard status="Available" questType="group" />
                  </TabsContent>
                  
                  <TabsContent value="inProgress">
                    <QuestBoard status="In Progress" />
                  </TabsContent>
                  
                  <TabsContent value="completed">
                    <QuestBoard status="Completed" />
                  </TabsContent>
                  
                  <TabsContent value="failed">
                    <QuestBoard status="Failed" />
                  </TabsContent>
                </Tabs>
              </>
            </TabsContent>
            
            <TabsContent value="guilds">
              <GuildBoard />
            </TabsContent>
            
            <TabsContent value="leaderboards">
              <LeaderboardSystem />
            </TabsContent>
          </Tabs>
        </div>

        {/* Horizontal Mini-Leaderboard (only show on quests and guilds tabs) */}
        {activeSection !== "leaderboards" && (
          <motion.div 
            className="w-full rounded-lg shadow-lg p-4 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <LeaderboardSystem 
              compact={true} 
              initialScope={LeaderboardScope.GLOBAL}
              showFullLeaderboardLink={true}
              limitEntries={5}
            />
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Quests;
