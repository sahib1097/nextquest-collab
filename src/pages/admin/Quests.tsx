import React, { useState, useEffect, lazy, Suspense, startTransition } from "react";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import UserProfile from "@/components/Quests/UserProfile";
import NewQuestDialog from "@/components/Quests/NewQuestDialog";
import XPBoostItem from "@/components/Quests/XPBoost/XPBoostItem";
import AchievementShowcase from "@/components/Social/AchievementShowcase";
import AchievementManager from "@/components/Social/AchievementManager";
import GuildBoard from "@/components/Guilds/GuildBoard";
import LeaderboardSystem from "@/components/Social/LeaderboardSystem";
import { UserLevel, UserRole } from "@/types/quest";
import { XPBoost } from "@/types/boost";
import { LeaderboardScope } from "@/types/social";
import { Users, Trophy, Settings, Castle, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import ThemeSwitcher from "@/components/ThemeSwitcher";

// Lazy-load QuestBoard
const QuestBoard = lazy(() => import("@/components/Quests/QuestBoard"));
const QuestMap = lazy(() => import("@/components/Quests/QuestMap/QuestMap"));

// TownMap has a default export
const TownMap = lazy(() => import("../townMap"));

// PhaserMap & HellMap are named exports, so we wrap them:
const PhaserMap = lazy(() =>
  import("../phaserMap").then(mod => ({ default: mod.PhaserMap }))
);
const HellMap = lazy(() =>
  import("../hellMap").then(mod => ({ default: mod.HellMap }))
);

const TestMap = lazy(() =>
  import("../testMap").then(mod => ({ default: mod.TestMap }))
);


const Quests: React.FC = () => {
  const { currentTheme } = useTheme();
  const isMedievalTheme = currentTheme.name === "Medieval";
  const isCyberpunkTheme = currentTheme.name === "Cyberpunk";
  const [activeTab, setActiveTab] = useState("available");
  const [activeSection, setActiveSection] = useState("quests");
  const [userLevel, setUserLevel] = useState<UserLevel | null>(null);
  const [userRole, setUserRole] = useState<string>("user");
  const [showAchievementManager, setShowAchievementManager] = useState(false);

  // map selector
  const [selectedMap, setSelectedMap] = useState<"town" | "phaser" | "hell" | "test">("town");
  const [showMapMenu, setShowMapMenu] = useState(false);

  // preload map images
  useEffect(() => {
    ["/maps/town.png", "/maps/phaser.png", "/maps/hell.png"].forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // load userLevel & sync URL
  useEffect(() => {
    const stored = localStorage.getItem("fluxUserLevel");
    if (stored) {
      setUserLevel(JSON.parse(stored));
    } else {
      const userData = JSON.parse(localStorage.getItem("fluxUser") || '{"name":"User"}');
      const defaultLevel: UserLevel = {
        userId: "current-user",
        username: userData.name || "User",
        xp: 0,
        level: 1,
        nextLevelXp: 100,
        profilePicture: undefined,
        role: UserRole.USER
      };
      setUserLevel(defaultLevel);
      localStorage.setItem("fluxUserLevel", JSON.stringify(defaultLevel));
    }

    const userData = JSON.parse(localStorage.getItem("fluxUser") || "{}");
    setUserRole(userData.role || "user");

    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (tab && ["available","groupQuests","inProgress","completed","failed"].includes(tab)) {
      setActiveTab(tab);
    }
    const section = params.get("section");
    if (section && ["quests","guilds","leaderboards"].includes(section)) {
      setActiveSection(section);
    }
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", value);
    window.history.pushState({}, "", url);
  };
  const handleSectionChange = (value: string) => {
    setActiveSection(value);
    const url = new URL(window.location.href);
    url.searchParams.set("section", value);
    window.history.pushState({}, "", url);
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
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1
              className={
                currentTheme.name === "Medieval"
                  ? "px-4 py-2 bg-[#8B0000] text-[#ffe8a3] font-extrabold text-3xl tracking-wide border-4 border-[#5c0000] rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] uppercase"
                  : isCyberpunkTheme
                  ? "relative px-6 py-3 font-mono font-bold text-3xl tracking-wider uppercase"
                  : "text-2xl font-bold"
              }
            >
              {isCyberpunkTheme ? (
                <div className="relative">
                  {/* Main container with angular shape */}
                  <div className="relative p-4 ">
                    {/* Glitch effect container */}
                    <div className="relative">
                      {/* Base text */}
                      <span className="relative z-10 text-transparent">
                        QUEST BOARD
                      </span>
                      
                      {/* Glitch effect layers */}
                      <span className="absolute top-0 left-0 text-[#2DE2E6] animate-glitch-1">QUEST BOARD</span>
                      <span className="absolute top-0 left-0 text-[#FF2E97] animate-glitch-2">QUEST BOARD</span>
                    </div>
                    
                    {/* Neon glow */}
                    <div className="absolute inset-0 bg-[#2DE2E6]/5 blur-xl" />
                  </div>
                </div>
              ) : (
                "Quest Board"
              )}
            </h1>
            <div className="flex items-center gap-2">
              <ThemeSwitcher />
              {isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => setShowAchievementManager(v => !v)}
                >
                  <Settings className="h-4 w-4" />
                  {showAchievementManager ? "Hide" : "Manage"} Trophies
                </Button>
              )}
              {canCreateQuests && userLevel && activeTab === "available" && (
                <NewQuestDialog />
              )}
            </div>
          </div>

          {/* Profile & Achievements */}
          {userLevel && (
            <div className="mb-6">
              <UserProfile userLevel={userLevel} />
              {userLevel.userId && <AchievementShowcase userId={userLevel.userId} expanded />}
            </div>
          )}
          {showAchievementManager && isAdmin && userLevel && (
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AchievementManager userId={userLevel.userId} />
            </motion.div>
          )}

          {/* Main Tabs */}
          <Tabs value={activeSection} onValueChange={handleSectionChange} className="w-full mb-6">
            {currentTheme.name === "Medieval" ? (
              <div className="flex items-stretch justify-center mb-8 w-full max-w-3xl mx-auto">
                {/* Left Banner */}
                <img
                  src="/assets/themes/medieval/sprites/F_UI_BlueBannerB.png"
                  alt="Left Banner"
                  className="h-32 w-auto object-contain"
                />

                {/* Pixel-RPG Tabs */}
                <TabsList className="flex w-full max-w-md bg-[#d6c8a2] border-4 border-[#5c4a2b] rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] overflow-hidden">
                  <TabsTrigger
                    value="quests"
                    className="flex-1 text-s font-bold py-4 border-r-2 border-[#5c4a2b] bg-[#d6c8a2] hover:bg-[#b8a778] active:translate-y-[2px] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5)] transition-none"
                  >
                    <Trophy className="h-3 w-3 mx-1" /> Quests
                  </TabsTrigger>
                  <TabsTrigger
                    value="guilds"
                    className="flex-1 text-s font-bold py-4 border-r-2 border-[#5c4a2b] bg-[#d6c8a2] hover:bg-[#b8a778] active:translate-y-[2px] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5)] transition-none"
                  >
                    <Castle className="h-3 w-3 mx-1" /> Guilds
                  </TabsTrigger>
                  <TabsTrigger
                    value="leaderboards"
                    className="flex-1 text-s font-bold py-4 bg-[#d6c8a2] hover:bg-[#b8a778] active:translate-y-[2px] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5)] transition-none"
                  >
                    <Star className="h-3 w-3 mx-1" /> Rankings
                  </TabsTrigger>
                </TabsList>

                {/* Right Banner */}
                <img
                  src="/assets/themes/medieval/sprites/F_UI_BlueBannerB.png"
                  alt="Right Banner"
                  className="h-32 w-auto object-contain"
                />
              </div>
            ) : isCyberpunkTheme ? (
              <div className="flex items-stretch justify-center mb-8 w-full max-w-3xl mx-auto">
                <TabsList className="flex w-full max-w-md bg-[#141622] border-2 border-[#2DE2E6] rounded-lg shadow-[0_0_20px_rgba(45,226,230,0.2)] overflow-hidden backdrop-blur-sm">
                  <TabsTrigger
                    value="quests"
                    className="relative z-10 flex-1 text-sm font-bold py-4 border-r border-[#2DE2E6] bg-transparent data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF2E97] data-[state=active]:to-[#2DE2E6] data-[state=active]:text-white data-[state=active]:shadow-[0_0_15px_rgba(45,226,230,0.3)] hover:bg-[#261D54] transition-all duration-300 data-[state=active]:border-r-0 data-[state=active]:border-l-0 data-[state=active]:rounded-l-lg data-[state=active]:-ml-1"
                  >
                    <Trophy className="h-4 w-4 mr-2" /> Quests
                  </TabsTrigger>
                  <TabsTrigger
                    value="guilds"
                    className="relative z-10 flex-1 text-sm font-bold py-4 border-r border-[#2DE2E6] bg-transparent data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF2E97] data-[state=active]:to-[#2DE2E6] data-[state=active]:text-white data-[state=active]:shadow-[0_0_15px_rgba(45,226,230,0.3)] hover:bg-[#261D54] transition-all duration-300 data-[state=active]:border-r-0"
                  >
                    <Castle className="h-4 w-4 mr-2" /> Guilds
                  </TabsTrigger>
                  <TabsTrigger
                    value="leaderboards"
                    className="relative z-10 flex-1 text-sm font-bold py-4 bg-transparent data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF2E97] data-[state=active]:to-[#2DE2E6] data-[state=active]:text-white data-[state=active]:shadow-[0_0_15px_rgba(45,226,230,0.3)] hover:bg-[#261D54] transition-all duration-300 data-[state=active]:border-l-0 data-[state=active]:rounded-r-lg data-[state=active]:-mr-1"
                  >
                    <Star className="h-4 w-4 mr-2" /> Rankings
                  </TabsTrigger>
                </TabsList>
              </div>
            ) : (
              <TabsList className="w-[90%] mx-auto grid grid-cols-3 w-full max-w-md">
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
            )}

            {/* Quests Section */}
            <TabsContent value="quests">
              <motion.div 
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Map header & selector */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-xl font-semibold flex items-center gap-2 ${
                    isCyberpunkTheme ? 'text-[#E0F2FF]' : ''
                  }`}>
                    <span className={
                      isCyberpunkTheme 
                        ? "text-transparent bg-gradient-to-r from-[#FF2E97] to-[#2DE2E6] bg-clip-text filter drop-shadow-[0_0_8px_rgba(45,226,230,0.5)]"
                        : "bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent"
                    }>
                      Quest Map
                    </span>
                  </h2>

                  <div className="relative">
                    <Button
                      variant="secondary"
                      size="sm"
                      className={
                        isCyberpunkTheme 
                          ? "bg-[#141622] text-[#2DE2E6] border border-[#2DE2E6] hover:bg-[#261D54] shadow-[0_0_10px_rgba(45,226,230,0.2)] transition-all duration-300"
                          : "bg-gray-900 text-white hover:bg-gray-800"
                      }
                      onClick={() => setShowMapMenu(v => !v)}
                    >
                      Change Map ▾
                    </Button>
                    {showMapMenu && (
                      <div className={
                        isCyberpunkTheme 
                          ? "absolute right-0 mt-1 w-32 bg-[#141622] border border-[#2DE2E6] shadow-[0_0_20px_rgba(45,226,230,0.2)] rounded-lg backdrop-blur-sm z-50"
                          : "absolute right-0 mt-1 w-32 bg-white shadow-lg rounded"
                      }>
                        {[
                          ["Town", "town"],
                          ["Phaser", "phaser"],
                          ["Hell", "hell"],
                          ["Test", "test"]
                        ].map(([label, key]) => (
                          <button
                            key={key}
                            onClick={() => {
                                  startTransition(() => {
                                    setSelectedMap(key as "town" | "phaser" | "hell");
                                  });
                              setShowMapMenu(false);
                            }}
                            className={
                              isCyberpunkTheme
                                ? "w-full px-4 py-2 text-left text-[#E0F2FF] hover:bg-[#261D54] hover:text-[#2DE2E6] transition-all duration-300"
                                : "w-full px-4 py-2 text-left hover:bg-gray-100"
                            }
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Lazy-loaded map */}
                <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse" />}>
                  {selectedMap === "town" && <TownMap />}
                  {selectedMap === "phaser" && <PhaserMap />}
                  {selectedMap === "hell" && <HellMap />}
                </Suspense>
              </motion.div>

              <XPBoostItem onCollect={handleCollectBoost} />

              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                {currentTheme.name === "Medieval" ? (
                  <div className="flex items-stretch justify-center mb-8 w-full max-w-3xl mx-auto">
                    {/* Left Banner */}
                    <img
                      src="/assets/themes/medieval/sprites/F_UI_GreenBannerB.png"
                      alt="Left Banner"
                      className="h-32 w-auto object-contain"
                    />
                    <TabsList className="flex w-full max-w-md bg-[#d6c8a2] border-4 border-[#5c4a2b] rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] overflow-hidden">
                      <TabsTrigger
                        value="available"
                        className="flex-1 text-s font-bold py-4 border-r-2 border-[#5c4a2b] bg-[#d6c8a2] hover:bg-[#b8a778] active:translate-y-[2px] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5)] transition-none"
                      >
                        Available
                      </TabsTrigger>
                      <TabsTrigger
                        value="groupQuests"
                        className="flex-1 text-s font-bold py-4 border-r-2 border-[#5c4a2b] bg-[#d6c8a2] hover:bg-[#b8a778] active:translate-y-[2px] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5)] transition-none"
                      >
                        <Users className="h-4 w-4 mr-1" /> Group
                      </TabsTrigger>
                      <TabsTrigger
                        value="inProgress"
                        className="flex-1 text-s font-bold py-4 border-r-2 border-[#5c4a2b] bg-[#d6c8a2] hover:bg-[#b8a778] active:translate-y-[2px] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5)] transition-none"
                      >
                        In Progress
                      </TabsTrigger>
                      <TabsTrigger
                        value="completed"
                        className="flex-1 text-s font-bold py-4 border-r-2 border-[#5c4a2b] bg-[#d6c8a2] hover:bg-[#b8a778] active:translate-y-[2px] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5)] transition-none"
                      >
                        Completed
                      </TabsTrigger>
                      <TabsTrigger
                        value="failed"
                        className="flex-1 text-s font-bold py-4 bg-[#d6c8a2] hover:bg-[#b8a778] active:translate-y-[2px] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5)] transition-none"
                      >
                        Failed
                      </TabsTrigger>
                    </TabsList>
                    <img
                      src="/assets/themes/medieval/sprites/F_UI_GreenBannerB.png"
                      alt="Right Banner"
                      className="h-32 w-auto object-contain"
                    />
                  </div>
                ) : isCyberpunkTheme ? (
                  <div className="flex items-stretch justify-center mb-8 w-full max-w-4xl mx-auto">
                    <TabsList className="flex w-full bg-[#141622] border-2 border-[#2DE2E6] rounded-lg shadow-[0_0_20px_rgba(45,226,230,0.2)] overflow-hidden backdrop-blur-sm">
                      <TabsTrigger
                        value="available"
                        className="flex-1 text-sm font-bold py-4 border-r border-[#2DE2E6] bg-transparent data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF2E97] data-[state=active]:to-[#2DE2E6] data-[state=active]:text-white data-[state=active]:shadow-[0_0_15px_rgba(45,226,230,0.3)] hover:bg-[#261D54] transition-all duration-300 data-[state=active]:border-r-0 data-[state=active]:-mx-[1px] data-[state=active]:first:ml-0 data-[state=active]:last:mr-0"
                      >
                        Available
                      </TabsTrigger>
                      <TabsTrigger
                        value="groupQuests"
                        className="flex-1 text-sm font-bold py-4 border-r border-[#2DE2E6] bg-transparent data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF2E97] data-[state=active]:to-[#2DE2E6] data-[state=active]:text-white data-[state=active]:shadow-[0_0_15px_rgba(45,226,230,0.3)] hover:bg-[#261D54] transition-all duration-300 data-[state=active]:border-r-0 data-[state=active]:-mx-[1px] data-[state=active]:first:ml-0 data-[state=active]:last:mr-0"
                      >
                        <Users className="h-4 w-4 mr-2" /> Group
                      </TabsTrigger>
                      <TabsTrigger
                        value="inProgress"
                        className="flex-1 text-sm font-bold py-4 border-r border-[#2DE2E6] bg-transparent data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF2E97] data-[state=active]:to-[#2DE2E6] data-[state=active]:text-white data-[state=active]:shadow-[0_0_15px_rgba(45,226,230,0.3)] hover:bg-[#261D54] transition-all duration-300 data-[state=active]:border-r-0 data-[state=active]:-mx-[1px] data-[state=active]:first:ml-0 data-[state=active]:last:mr-0"
                      >
                        In Progress
                      </TabsTrigger>
                      <TabsTrigger
                        value="completed"
                        className="flex-1 text-sm font-bold py-4 border-r border-[#2DE2E6] bg-transparent data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF2E97] data-[state=active]:to-[#2DE2E6] data-[state=active]:text-white data-[state=active]:shadow-[0_0_15px_rgba(45,226,230,0.3)] hover:bg-[#261D54] transition-all duration-300 data-[state=active]:border-r-0 data-[state=active]:-mx-[1px] data-[state=active]:first:ml-0 data-[state=active]:last:mr-0"
                      >
                        Completed
                      </TabsTrigger>
                      <TabsTrigger
                        value="failed"
                        className="flex-1 text-sm font-bold py-4 bg-transparent data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF2E97] data-[state=active]:to-[#2DE2E6] data-[state=active]:text-white data-[state=active]:shadow-[0_0_15px_rgba(45,226,230,0.3)] hover:bg-[#261D54] transition-all duration-300 data-[state=active]:-mx-[1px] data-[state=active]:first:ml-0 data-[state=active]:last:mr-0"
                      >
                        Failed
                      </TabsTrigger>
                    </TabsList>
                  </div>
                ) : (
                  <TabsList className="grid grid-cols-5 w-full max-w-md mb-8">
                    <TabsTrigger value="available">Available</TabsTrigger>
                    <TabsTrigger value="groupQuests" className="flex items-center">
                      <Users className="h-4 w-4 mr-1" /> Group
                    </TabsTrigger>
                    <TabsTrigger value="inProgress">In Progress</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                    <TabsTrigger value="failed">Failed</TabsTrigger>
                  </TabsList>
                )}

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
            </TabsContent>

            <TabsContent value="guilds">
              <GuildBoard />
            </TabsContent>

            <TabsContent value="leaderboards">
              <LeaderboardSystem />
            </TabsContent>
          </Tabs>
        </div>

        {/* Mini-Leaderboard */}
        {activeSection !== "leaderboards" && (
          <motion.div
            className={`w-full rounded-lg shadow-lg p-4 mt-8 ${
              isCyberpunkTheme 
                ? 'bg-[#141622]/80 border-2 border-[#2DE2E6] shadow-[0_0_30px_rgba(45,226,230,0.2)] backdrop-blur-sm'
                : ''
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <LeaderboardSystem
              compact
              initialScope={LeaderboardScope.GLOBAL}
              showFullLeaderboardLink
              limitEntries={5}
            />
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Quests;
