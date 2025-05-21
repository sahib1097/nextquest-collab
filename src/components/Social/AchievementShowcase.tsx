import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Achievement, TrophyRarity, AchievementType } from "@/types/social";
import AchievementBadge from "./AchievementBadge";
import { Award, ChevronUp, ChevronDown, Trophy, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEFAULT_ACHIEVEMENTS } from "@/data/achievements";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/contexts/ThemeContext";

interface AchievementShowcaseProps {
  userId: string;
  expanded?: boolean;
}

const AchievementShowcase = ({ userId, expanded = false }: AchievementShowcaseProps) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [showNewAchievement, setShowNewAchievement] = useState<Achievement | null>(null);
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [filterType, setFilterType] = useState<AchievementType | "ALL">("ALL");
  const [filterRarity, setFilterRarity] = useState<TrophyRarity | "ALL">("ALL");
  const [activeTab, setActiveTab] = useState<"earned" | "all">("earned");
  const { currentTheme } = useTheme();
  const isCyberpunkTheme = currentTheme.name === "Cyberpunk";

  useEffect(() => {
    // Load achievements from localStorage or initialize with default achievements
    const loadAchievements = () => {
      const storedAchievements = localStorage.getItem(`flux_achievements_${userId}`);
      if (storedAchievements) {
        return JSON.parse(storedAchievements);
      }
      
      // Init with a sample of default achievements (normally these would be empty or just a few)
      const initialAchievements: Achievement[] = [
        DEFAULT_ACHIEVEMENTS[0], // First Quest achievement
      ];
      
      initialAchievements[0].earnedAt = new Date().toISOString();
      
      localStorage.setItem(`flux_achievements_${userId}`, JSON.stringify(initialAchievements));
      return initialAchievements;
    };
    
    setAchievements(loadAchievements());
  }, [userId]);

  // Check for new achievements based on completed quests
  useEffect(() => {
    // Implementation of achievement checking logic
    const checkForNewAchievements = () => {
      // Get all completed quests
      const storedQuests = localStorage.getItem("fluxQuests");
      if (!storedQuests) return;
      
      const quests = JSON.parse(storedQuests);
      const completedQuests = quests.filter((q: any) => q.status === "Completed");
      
      if (completedQuests.length === 0) return;
      
      // Check for speed runner achievement
      const speedRunnerQuests = completedQuests.filter((quest: any) => {
        if (!quest.createdAt || !quest.completedAt) return false;
        
        const startTime = new Date(quest.createdAt).getTime();
        const endTime = new Date(quest.completedAt).getTime();
        const timeDiff = endTime - startTime;
        
        // Completed within 30 minutes
        return timeDiff < 30 * 60 * 1000;
      });
      
      // Find the speed runner achievement in our default list
      const speedRunnerAchievement = DEFAULT_ACHIEVEMENTS.find(
        a => a.name === "Speed Demon"
      );
      
      const hasSpeedRunnerAchievement = achievements.some(a => a.name === "Speed Demon");
      
      if (speedRunnerQuests.length >= 3 && !hasSpeedRunnerAchievement && speedRunnerAchievement) {
        const newAchievement: Achievement = {
          ...speedRunnerAchievement,
          earnedAt: new Date().toISOString(),
        };
        
        const updatedAchievements = [...achievements, newAchievement];
        setAchievements(updatedAchievements);
        localStorage.setItem(`flux_achievements_${userId}`, JSON.stringify(updatedAchievements));
        
        // Trigger animation for new achievement
        setShowNewAchievement(newAchievement);
        setTimeout(() => setShowNewAchievement(null), 5000);
      }
      
      // Check for Team Player achievement (completed group quests)
      const groupQuests = completedQuests.filter((quest: any) => quest.isGroupQuest);
      
      // Find the team player achievement in our default list
      const teamPlayerAchievement = DEFAULT_ACHIEVEMENTS.find(
        a => a.name === "Team Player"
      );
      
      const hasTeamPlayerAchievement = achievements.some(a => a.name === "Team Player");
      
      if (groupQuests.length >= 2 && !hasTeamPlayerAchievement && teamPlayerAchievement) {
        const newAchievement: Achievement = {
          ...teamPlayerAchievement,
          earnedAt: new Date().toISOString(),
        };
        
        const updatedAchievements = [...achievements, newAchievement];
        setAchievements(updatedAchievements);
        localStorage.setItem(`flux_achievements_${userId}`, JSON.stringify(updatedAchievements));
        
        // Trigger animation for new achievement
        setShowNewAchievement(newAchievement);
        setTimeout(() => setShowNewAchievement(null), 5000);
      }

      // Check for Perfectionist achievement
      const perfectScoreQuests = completedQuests.filter((quest: any) => 
        quest.feedback && quest.feedback.score === 100
      );
      
      const perfectAchievement = DEFAULT_ACHIEVEMENTS.find(
        a => a.name === "Perfectionist"
      );
      
      const hasPerfectAchievement = achievements.some(a => a.name === "Perfectionist");
      
      if (perfectScoreQuests.length >= 3 && !hasPerfectAchievement && perfectAchievement) {
        const newAchievement: Achievement = {
          ...perfectAchievement,
          earnedAt: new Date().toISOString(),
        };
        
        const updatedAchievements = [...achievements, newAchievement];
        setAchievements(updatedAchievements);
        localStorage.setItem(`flux_achievements_${userId}`, JSON.stringify(updatedAchievements));
        
        setShowNewAchievement(newAchievement);
        setTimeout(() => setShowNewAchievement(null), 5000);
      }
    };
    
    checkForNewAchievements();
    
    // Check periodically
    const interval = setInterval(checkForNewAchievements, 10000);
    return () => clearInterval(interval);
  }, [achievements, userId]);

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  const filteredAchievements = achievements
    .filter(a => filterType === "ALL" || a.type === filterType)
    .filter(a => filterRarity === "ALL" || a.rarity === filterRarity);

  // Calculate trophy statistics
  const earnedAchievements = achievements.filter(a => a.earnedAt);
  const bronzeTrophies = earnedAchievements.filter(a => a.type === AchievementType.BRONZE).length;
  const silverTrophies = earnedAchievements.filter(a => a.type === AchievementType.SILVER).length;
  const goldTrophies = earnedAchievements.filter(a => a.type === AchievementType.GOLD).length;
  const platinumTrophies = earnedAchievements.filter(a => a.type === AchievementType.PLATINUM).length;

  // Get all achievements (earned and not earned) for "all" tab
  const allAchievements = activeTab === "earned" 
    ? achievements 
    : DEFAULT_ACHIEVEMENTS.map(defaultAchievement => {
        const userAchievement = achievements.find(a => a.name === defaultAchievement.name);
        return userAchievement || defaultAchievement;
      });

  // Apply filters to the appropriate achievement list
  const displayedAchievements = (activeTab === "earned" ? filteredAchievements : allAchievements)
    .filter(a => filterType === "ALL" || a.type === filterType)
    .filter(a => filterRarity === "ALL" || a.rarity === filterRarity);

  if (achievements.length === 0 && activeTab === "earned") return null;

  return (
    <div className={`mb-6 rounded-lg p-4 ${
      isCyberpunkTheme 
        ? "bg-[#141622] border-2 border-[#2DE2E6] shadow-[0_0_20px_rgba(45,226,230,0.2)]"
        : "bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 shadow-sm"
    }`}>
      <div 
        className="flex items-center justify-between mb-3 cursor-pointer"
        onClick={toggleExpanded}
      >
        <div className="flex items-center gap-2">
          <Trophy className={`h-5 w-5 ${isCyberpunkTheme ? "text-[#2DE2E6]" : "text-purple-600"}`} />
          <h3 className={`text-base font-medium ${isCyberpunkTheme ? "text-[#E0F2FF] font-mono" : ""}`}>Trophies</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex gap-1 items-center text-xs px-2 py-1 rounded-full ${
            isCyberpunkTheme 
              ? "bg-[#1a1f2e] border border-[#2DE2E6]/20"
              : "bg-gray-100"
          }`}>
            <span className={isCyberpunkTheme ? "text-[#FF2E97]" : "text-amber-600"}>{bronzeTrophies}</span>
            <span className={isCyberpunkTheme ? "text-[#2DE2E6]" : "text-gray-500"}>{silverTrophies}</span>
            <span className={isCyberpunkTheme ? "text-[#FF2E97]" : "text-yellow-600"}>{goldTrophies}</span>
            <span className={isCyberpunkTheme ? "text-[#2DE2E6]" : "text-blue-600"}>{platinumTrophies}</span>
          </div>
          {isExpanded ? (
            <ChevronUp className={`h-4 w-4 ${isCyberpunkTheme ? "text-[#2DE2E6]" : "text-gray-400"}`} />
          ) : (
            <ChevronDown className={`h-4 w-4 ${isCyberpunkTheme ? "text-[#2DE2E6]" : "text-gray-400"}`} />
          )}
        </div>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <Tabs defaultValue="earned" className="w-full" onValueChange={(value) => setActiveTab(value as "earned" | "all")}>
              <div className="flex justify-between items-center mb-3">
                <TabsList className={isCyberpunkTheme ? "bg-[#1a1f2e] border border-[#2DE2E6]/20" : ""}>
                  <TabsTrigger 
                    value="earned" 
                    className={`text-xs ${isCyberpunkTheme ? "data-[state=active]:bg-[#2DE2E6] data-[state=active]:text-[#141622]" : ""}`}
                  >
                    Earned ({earnedAchievements.length})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="all" 
                    className={`text-xs ${isCyberpunkTheme ? "data-[state=active]:bg-[#2DE2E6] data-[state=active]:text-[#141622]" : ""}`}
                  >
                    All ({DEFAULT_ACHIEVEMENTS.length})
                  </TabsTrigger>
                </TabsList>
                
                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={`h-7 gap-1 text-xs ${
                          isCyberpunkTheme 
                            ? "bg-[#1a1f2e] text-[#2DE2E6] border-[#2DE2E6]/20 hover:bg-[#261D54] hover:border-[#2DE2E6]"
                            : ""
                        }`}
                      >
                        <Filter className="h-3 w-3" /> Filter
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      align="end" 
                      className={`w-48 ${
                        isCyberpunkTheme 
                          ? "bg-[#141622] border-[#2DE2E6] text-[#E0F2FF]"
                          : ""
                      }`}
                    >
                      <div className={`p-2 text-xs font-medium ${isCyberpunkTheme ? "text-[#2DE2E6]" : ""}`}>Trophy Type</div>
                      <DropdownMenuCheckboxItem
                        checked={filterType === "ALL"}
                        onCheckedChange={() => setFilterType("ALL")}
                      >
                        All Types
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={filterType === AchievementType.BRONZE}
                        onCheckedChange={() => setFilterType(filterType === AchievementType.BRONZE ? "ALL" : AchievementType.BRONZE)}
                      >
                        Bronze
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={filterType === AchievementType.SILVER}
                        onCheckedChange={() => setFilterType(filterType === AchievementType.SILVER ? "ALL" : AchievementType.SILVER)}
                      >
                        Silver
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={filterType === AchievementType.GOLD}
                        onCheckedChange={() => setFilterType(filterType === AchievementType.GOLD ? "ALL" : AchievementType.GOLD)}
                      >
                        Gold
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={filterType === AchievementType.PLATINUM}
                        onCheckedChange={() => setFilterType(filterType === AchievementType.PLATINUM ? "ALL" : AchievementType.PLATINUM)}
                      >
                        Platinum
                      </DropdownMenuCheckboxItem>
                      
                      <div className={`p-2 text-xs font-medium pt-3 border-t mt-1 ${isCyberpunkTheme ? "text-[#2DE2E6]" : ""}`}>Rarity</div>
                      <DropdownMenuCheckboxItem
                        checked={filterRarity === "ALL"}
                        onCheckedChange={() => setFilterRarity("ALL")}
                      >
                        All Rarities
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={filterRarity === TrophyRarity.COMMON}
                        onCheckedChange={() => setFilterRarity(filterRarity === TrophyRarity.COMMON ? "ALL" : TrophyRarity.COMMON)}
                      >
                        Common
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={filterRarity === TrophyRarity.UNCOMMON}
                        onCheckedChange={() => setFilterRarity(filterRarity === TrophyRarity.UNCOMMON ? "ALL" : TrophyRarity.UNCOMMON)}
                      >
                        Uncommon
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={filterRarity === TrophyRarity.RARE}
                        onCheckedChange={() => setFilterRarity(filterRarity === TrophyRarity.RARE ? "ALL" : TrophyRarity.RARE)}
                      >
                        Rare
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={filterRarity === TrophyRarity.VERY_RARE}
                        onCheckedChange={() => setFilterRarity(filterRarity === TrophyRarity.VERY_RARE ? "ALL" : TrophyRarity.VERY_RARE)}
                      >
                        Very Rare
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={filterRarity === TrophyRarity.ULTRA_RARE}
                        onCheckedChange={() => setFilterRarity(filterRarity === TrophyRarity.ULTRA_RARE ? "ALL" : TrophyRarity.ULTRA_RARE)}
                      >
                        Ultra Rare
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <TabsContent value="earned" className="mt-0">
                {filteredAchievements.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {filteredAchievements.map((achievement) => (
                      <AchievementBadge 
                        key={achievement.id} 
                        achievement={achievement} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className={`text-center text-sm py-4 ${
                    isCyberpunkTheme ? "text-[#2DE2E6]/60" : "text-gray-500"
                  }`}>
                    No trophies match the selected filters
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="all" className="mt-0">
                {displayedAchievements.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {displayedAchievements.map((achievement) => (
                      <AchievementBadge 
                        key={achievement.id} 
                        achievement={achievement} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className={`text-center text-sm py-4 ${
                    isCyberpunkTheme ? "text-[#2DE2E6]/60" : "text-gray-500"
                  }`}>
                    No trophies match the selected filters
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* New Achievement Animation */}
      {showNewAchievement && (
        <motion.div
          className="fixed bottom-10 right-10 z-50"
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className={`p-4 rounded-lg shadow-lg ${
            isCyberpunkTheme 
              ? "bg-[#141622] border-2 border-[#2DE2E6] shadow-[0_0_30px_rgba(45,226,230,0.3)]"
              : "bg-black bg-opacity-80 border border-purple-500"
          }`}>
            <h4 className={`text-sm font-bold mb-2 ${
              isCyberpunkTheme ? "text-[#2DE2E6] font-mono" : "text-purple-300"
            }`}>New Trophy Unlocked!</h4>
            <AchievementBadge 
              achievement={showNewAchievement} 
              animate={true}
              size="lg"
            />
            <p className={`text-xs mt-2 ${
              isCyberpunkTheme ? "text-[#E0F2FF]/80" : "text-gray-300"
            }`}>{showNewAchievement.description}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AchievementShowcase;
