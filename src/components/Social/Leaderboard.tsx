import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LeaderboardScope } from "@/types/social";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Castle, Star, Zap, Search, ChevronUp, ChevronDown, Shield, Sword } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogOverlay } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";

interface LeaderboardProps {
  scope: LeaderboardScope;
  compact?: boolean;
  limitEntries?: number;
}

interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  avatar?: string;
  avatarStyle?: "pixel" | "rpg" | "modern";
  xp: number;
  level: number;
  guildName?: string;
  guildLogo?: string;
  badges: string[];
  previousRank?: number;
  isCurrentUser: boolean;
  role?: "Freelancer" | "Student" | "Corporate Hero" | "Guild Master" | string;
  achievements?: string[];
  questHistory?: {
    name: string;
    xp: number;
    completedDate: string;
    completedEarly?: boolean;
    daysEarly?: number;
  }[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ 
  scope, 
  compact = false,
  limitEntries 
}) => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [userDetailsOpen, setUserDetailsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<LeaderboardEntry | null>(null);
  const [liveUpdates, setLiveUpdates] = useState<{userId: string, change: number}[]>([]);
  const { currentTheme } = useTheme();
  const isMedievalTheme = currentTheme.name === "Medieval";

  useEffect(() => {
    // In a real app, this would fetch data from an API
    // For now, we'll simulate different data for different scopes
    setIsLoading(true);
    
    setTimeout(() => {
      const mockData = generateMockData(scope);
      setLeaderboardData(limitEntries ? mockData.slice(0, limitEntries) : mockData);
      setIsLoading(false);
    }, 800);

    // Simulate live rank changes
    if (!compact) {
      const interval = setInterval(() => {
        simulateLiveRankChanges();
      }, 10000); // Every 10 seconds
      
      return () => clearInterval(interval);
    }
  }, [scope, limitEntries, compact]);

  // Simulate live rank changes
  const simulateLiveRankChanges = () => {
    // Only update if we have enough users
    if (leaderboardData.length < 3) return;
    
    const randomUserIndex = Math.floor(Math.random() * leaderboardData.length);
    const randomChange = Math.random() > 0.5 ? 1 : -1; // Move up or down
    
    const updatedData = [...leaderboardData];
    const targetUser = { ...updatedData[randomUserIndex] };
    
    // Record the live update
    setLiveUpdates(prev => [
      ...prev, 
      { userId: targetUser.id, change: randomChange }
    ]);
    
    // After 3 seconds, remove the notification
    setTimeout(() => {
      setLiveUpdates(prev => prev.filter(u => u.userId !== targetUser.id));
    }, 3000);
    
    // Update XP which will affect ranking
    targetUser.xp += randomChange * 150;
    updatedData[randomUserIndex] = targetUser;
    
    // Sort by XP and update ranks
    const sortedData = updatedData
      .sort((a, b) => b.xp - a.xp)
      .map((entry, i) => ({ 
        ...entry, 
        previousRank: entry.rank,
        rank: i + 1 
      }));
    
    setLeaderboardData(sortedData);
    
    // Show toast for significant changes
    if (Math.abs(targetUser.previousRank! - targetUser.rank) >= 2) {
      toast(`${targetUser.name} ${targetUser.rank < targetUser.previousRank! ? "climbed" : "dropped"} to rank ${targetUser.rank}!`);
    }
  };

  const handleUserClick = (user: LeaderboardEntry) => {
    setSelectedUser(user);
    setUserDetailsOpen(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const toggleRoleFilter = (role: string) => {
    if (roleFilter === role) {
      setRoleFilter(null);
    } else {
      setRoleFilter(role);
    }
  };

  // Filter data based on search and role filters
  const filteredData = leaderboardData.filter(entry => {
    const matchesSearch = entry.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (entry.guildName && entry.guildName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = !roleFilter || entry.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {!compact && (
        <div className="mb-4 space-y-2">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search by name or guild..."
              value={searchQuery}
              onChange={handleSearchChange}
              className={`max-w-sm ${isMedievalTheme ? "bg-[#5c4b2a] placeholder:text-[#fcefb4]" : ""}`}
              startIcon={<Search className={`h-4 w-4 ${isMedievalTheme ? "text-[#fcefb4]" : ""}`} />}
            />
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1 ${isMedievalTheme ? "bg-[#5c4b2a]" : ""}`}
            >
              {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              Filters
            </Button>
          </div>
          
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden space-x-2 pt-2"
              >
                {["Freelancer", "Student", "Corporate Hero", "Guild Master"].map((role) => (
                  <Button 
                    key={role}
                    variant={roleFilter === role ? "default" : "outline"} 
                    size="sm"
                    onClick={() => toggleRoleFilter(role)}
                    className={isMedievalTheme ? "bg-[#5c4b2a] text-[#fcefb4] border-[#d4af37]" : ""}
                  >
                    {role}
                  </Button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <div className={`rounded-md ${isMedievalTheme ? "border-[#d4af37]" : "border"}`}>
        <div className={`grid grid-cols-12 gap-2 p-3 ${isMedievalTheme ? "bg-[#5c4b2a]" : "bg-muted/50"} font-medium text-sm`}>
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-5 md:col-span-3">Hero</div>
          <div className="col-span-3 md:col-span-2 text-right">XP</div>
          <div className="hidden md:block md:col-span-3">Guild</div>
          <div className="col-span-3 text-right">Badges</div>
        </div>
        
        <div>
          {filteredData.map((entry, index) => {
            const liveUpdate = liveUpdates.find(update => update.userId === entry.id);
            
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`grid grid-cols-12 gap-2 justify-between items-center px-4 py-2 rounded-lg ${
                  isMedievalTheme ? `
                    text-[#7c1c1c]
                    ${entry.isCurrentUser ? "bg-[#d4af37]/20 border-[#d4af37]/50" : ""}
                    ${index % 2 === 0 && !entry.isCurrentUser ? "bg-[#d4c07c]/60" : ""}
                    hover:bg-[#bfa171]/40
                  ` : `
                    ${entry.isCurrentUser ? "bg-primary/5 border-primary/20" : ""}
                    ${index % 2 === 0 && !entry.isCurrentUser ? "bg-muted/20" : ""}
                    hover:bg-gray-50
                  `}
                `}
                onClick={() => handleUserClick(entry)}
              >
                <div className="col-span-1 text-center font-semibold">
                  <div className={`flex flex-col items-center ${isMedievalTheme ? "text-black" : ""}`}>
                    {entry.rank <= 3 ? (
                      <div className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                        isMedievalTheme 
                          ? `${entry.rank === 1 ? "bg-[#f5e6c5] text-yellow-600" : 
                              entry.rank === 2 ? "bg-[#f5e6c5] text-gray-600" : 
                              "bg-amber-100 text-amber-700"}`
                          : `${entry.rank === 1 ? "bg-yellow-100 text-yellow-600" : 
                              entry.rank === 2 ? "bg-gray-100 text-gray-600" : 
                              "bg-amber-100 text-amber-700"}`
                      }`}>
                        <Trophy className="h-3 w-3" />
                      </div>
                    ) : (
                      entry.rank
                    )}
                    
                    {/* Rank change indicator */}
                    {entry.previousRank && entry.previousRank !== entry.rank && (
                      <div className={`text-xs font-medium mt-1 
                        ${entry.rank < entry.previousRank 
                          ? "text-green-600" 
                          : "text-red-600"}`}
                      >
                        {entry.rank < entry.previousRank 
                          ? <span>▲{entry.previousRank - entry.rank}</span> 
                          : <span>▼{entry.rank - entry.previousRank}</span>}
                      </div>
                    )}
                    
                    {/* Live update animation */}
                    {liveUpdate && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className={`absolute text-sm font-bold ${
                          liveUpdate.change > 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {liveUpdate.change > 0 ? "+XP" : "-XP"}
                      </motion.div>
                    )}
                  </div>
                </div>
                
                <div className="col-span-5 md:col-span-3 flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Avatar className={`h-8 w-8 border ${getAvatarBorderClass(entry)}`}>
                          {entry.avatar ? (
                            <AvatarImage src={entry.avatar} alt={entry.name} />
                          ) : (
                            <AvatarFallback className={getAvatarFallbackClass(entry)}>
                              {getAvatarContent(entry)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        {entry.role || "Hero"} • Level {entry.level}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <div>
                    <div className={`font-medium text-sm flex justify-between items-center px-4 py-2 rounded-lg ${
                      isMedievalTheme ? "text-black" : ""
                    }`}>
                      {entry.name}
                      {entry.isCurrentUser && (
                        <Badge variant="outline" className={`ml-2 text-[10px] py-0 ${
                          isMedievalTheme ? "bg-[#7c1c1c] text-[#d4af37]" : ""
                        }`}>
                          You
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center">
                      <Star className="h-3 w-3 mr-1 text-amber-500" />
                      Lvl {entry.level}
                      {entry.role && (
                        <span className={`ml-1 ${isMedievalTheme ? "text-[#d4af37]" : "text-gray-400"}`}>
                          • {entry.role}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className={`col-span-3 md:col-span-2 text-right font-mono font-medium flex justify-between items-center px-4 py-2 rounded-lg ${
                  isMedievalTheme ? "text-[#2e4a2c]" : ""
                }`}>
                  {entry.xp.toLocaleString()} XP
                </div>
                
                <div className="hidden md:block md:col-span-3 truncate">
                  {entry.guildName ? (
                    <div className="flex items-center text-sm">
                      {entry.guildLogo ? (
                        <div className="w-4 h-4 rounded-full mr-1 overflow-hidden">
                          <img src={entry.guildLogo} alt={entry.guildName} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <Castle className={`h-3 w-3 mr-1 ${isMedievalTheme ? "text-black" : "text-primary"}`} />
                      )}
                      {entry.guildName}
                    </div>
                  ) : (
                    <span className={`text-sm ${isMedievalTheme ? "text-[#7c1c1c]" : "text-muted-foreground"}`}>
                      No Guild
                    </span>
                  )}
                </div>
                
                <div className="col-span-3 flex justify-end space-x-1">
                  {entry.badges.map((badge, i) => (
                    <TooltipProvider key={i}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div 
                            className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center"
                          >
                            {badge === "streak" && <Zap className="h-3.5 w-3.5 text-amber-500" />}
                            {badge === "guild" && <Castle className="h-3.5 w-3.5 text-purple-500" />}
                            {badge === "top" && <Trophy className="h-3.5 w-3.5 text-emerald-500" />}
                            {badge === "shield" && <Shield className="h-3.5 w-3.5 text-blue-500" />}
                            {badge === "sword" && <Sword className="h-3.5 w-3.5 text-red-500" />}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          {getBadgeDescription(badge)}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      {compact && leaderboardData.length >= 5 && (
        <div className="text-center mt-2">
          <a href="/leaderboards" className={`text-sm ${isMedievalTheme ? "text-[#7c1c1c]" : "text-primary"} hover:underline`}>
            View full leaderboard →
          </a>
        </div>
      )}
      
      {/* Medieval themed dialog */}
      <Dialog open={userDetailsOpen} onOpenChange={setUserDetailsOpen}>
        {isMedievalTheme ? (
          <>
            <DialogOverlay className="fixed inset-0 bg-black/50 z-40" />
            <DialogContent className="fixed left-[50%] top-[50%] z-50 grid translate-x-[-85%] translate-y-[-50%] p-0 bg-transparent border-none shadow-none">
              <div className="flex justify-center items-center p-6">
                <div
                  className="relative flex justify-center items-center"
                  style={{
                    backgroundImage: "url('/assets/themes/medieval/sprites/F_UI_Panel_N.png')",
                    width: "900px",
                    height: "900px",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    imageRendering: "pixelated",
                    padding: "40px",
                    boxSizing: "border-box",
                  }}
                >
                  <div className="w-full max-w-[600px] h-[600px] overflow-y-auto pr-2 custom-scroll text-brown-800"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Avatar className={`h-6 w-6 ${getAvatarBorderClass(selectedUser)}`}>
                          {selectedUser?.avatar ? (
                            <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                          ) : (
                            <AvatarFallback className={getAvatarFallbackClass(selectedUser)}>
                              {selectedUser?.name.charAt(0)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        {selectedUser?.name}'s Profile
                      </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{selectedUser?.name}</h3>
                          <p className="text-sm text-gray-500">
                            Level {selectedUser?.level} {selectedUser?.role}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{selectedUser?.xp.toLocaleString()} XP</div>
                          <p className="text-xs text-gray-500">Rank #{selectedUser?.rank}</p>
                        </div>
                      </div>

                      {selectedUser?.guildName && (
                        <div className="bg-gray-50 p-3 rounded-md">
                          <div className="flex items-center gap-2">
                            {selectedUser.guildLogo ? (
                              <div className="w-5 h-5 rounded-full overflow-hidden">
                                <img src={selectedUser.guildLogo} alt={selectedUser.guildName} className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <Castle className="h-4 w-4 text-purple-600" />
                            )}
                            <span className="font-medium">{selectedUser.guildName}</span>
                          </div>
                        </div>
                      )}

                      {selectedUser?.achievements?.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Achievements</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedUser.achievements.map((achievement, i) => {
                              const formattedAchievement =
                                achievement.length > 16 && achievement.includes(" ")
                                  ? (() => {
                                      const words = achievement.split(" ");
                                      const midpoint = Math.ceil(words.length / 2);
                                      return words.slice(0, midpoint).join(" ") + "\n" + words.slice(midpoint).join(" ");
                                    })()
                                  : achievement;

                              return (
                                <div
                                  key={i}
                                  className="relative px-4 py-2 flex items-center justify-center text-center text-white font-bold text-sm min-w-[140px] min-h-[140px]"
                                  style={{
                                    backgroundImage: "url('/assets/themes/medieval/sprites/F_UI_Banner_A1.png')",
                                    backgroundRepeat: "repeat-x",
                                    backgroundSize: "auto 100%",
                                    backgroundPosition: "center",
                                    imageRendering: "pixelated",
                                  }}
                                >
                                  <span className="text-xs leading-snug break-words whitespace-pre-wrap">
                                    {formattedAchievement}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="font-medium mb-2">Recent Quests</h4>
                        {selectedUser?.questHistory ? (
                          <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scroll">
                            {selectedUser.questHistory.map((quest, i) => {
                              const spriteIndex = quest.spriteIndex || 0;
                              const spriteSize = 22;
                              const columns = 18;
                              const x = -(spriteIndex % columns) * spriteSize;
                              const y = -Math.floor(spriteIndex / columns) * spriteSize;

                              return (
                                <div key={i} className="bg-gray-50 p-2 rounded-md text-sm">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <div
                                        className="w-[22px] h-[22px] bg-no-repeat"
                                        style={{
                                          backgroundImage: "url('/assets/themes/medieval/sprites/F_U_ObjectIconTileMap1.png')",
                                          backgroundSize: "396px 242px",
                                          backgroundPosition: `${x}px ${y}px`,
                                          imageRendering: "pixelated",
                                        }}
                                      />
                                      <span>{quest.name}</span>
                                    </div>
                                    <span className="font-mono font-semibold text-green-600">+{quest.xp} XP</span>
                                  </div>
                                  <div className="text-xs text-gray-500 flex items-center justify-between mt-1">
                                    <span>Completed {new Date(quest.completedDate).toLocaleDateString()}</span>
                                    {quest.completedEarly && (
                                      <span className="text-amber-600">{quest.daysEarly} days early!</span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No recent quests</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </>
        ) : (
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Avatar className={`h-6 w-6 ${getAvatarBorderClass(selectedUser)}`}>
                  {selectedUser?.avatar ? (
                    <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                  ) : (
                    <AvatarFallback className={getAvatarFallbackClass(selectedUser)}>
                      {selectedUser?.name.charAt(0)}
                    </AvatarFallback>
                  )}
                </Avatar>
                {selectedUser?.name}'s Profile
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser?.name}</h3>
                  <p className="text-sm text-gray-500">
                    Level {selectedUser?.level} {selectedUser?.role}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{selectedUser?.xp.toLocaleString()} XP</div>
                  <p className="text-xs text-gray-500">Rank #{selectedUser?.rank}</p>
                </div>
              </div>
              
              {/* Guild information */}
              {selectedUser?.guildName && (
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex items-center gap-2">
                    {selectedUser.guildLogo ? (
                      <div className="w-5 h-5 rounded-full overflow-hidden">
                        <img src={selectedUser.guildLogo} alt={selectedUser.guildName} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <Castle className="h-4 w-4 text-purple-600" />
                    )}
                    <span className="font-medium">{selectedUser.guildName}</span>
                  </div>
                </div>
              )}
              
              {/* Achievements */}
              {selectedUser?.achievements && selectedUser.achievements.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Achievements</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.achievements.map((achievement, i) => (
                      <Badge key={i} variant="outline" className="px-2 py-1">
                        {achievement}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Quest History */}
              <div>
                <h4 className="font-medium mb-2">Recent Quests</h4>
                {selectedUser?.questHistory ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedUser.questHistory.map((quest, i) => (
                      <div key={i} className="bg-gray-50 p-2 rounded-md text-sm">
                        <div className="flex items-center justify-between">
                          <span>{quest.name}</span>
                          <span className="font-mono font-semibold text-green-600">+{quest.xp} XP</span>
                        </div>
                        <div className="text-xs text-gray-500 flex items-center justify-between mt-1">
                          <span>Completed {new Date(quest.completedDate).toLocaleDateString()}</span>
                          {quest.completedEarly && (
                            <span className="text-amber-600">{quest.daysEarly} days early!</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No recent quests</p>
                )}
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

// Helper function to get avatar border class based on level
const getAvatarBorderClass = (entry: LeaderboardEntry | null) => {
  if (!entry) return "border-gray-200";
  
  if (entry.level >= 50) return "border-2 border-yellow-500";
  if (entry.level >= 30) return "border-2 border-indigo-500";
  if (entry.level >= 10) return "border-2 border-emerald-500";
  return "border-gray-200";
};

// Helper function to get avatar fallback class
const getAvatarFallbackClass = (entry: LeaderboardEntry | null) => {
  if (!entry) return "bg-primary/10";
  
  if (entry.avatarStyle === "pixel") return "bg-amber-100 text-amber-800";
  if (entry.avatarStyle === "rpg") return "bg-blue-100 text-blue-800";
  return "bg-primary/10";
};

// Helper function to get avatar content based on avatar style
const getAvatarContent = (entry: LeaderboardEntry) => {
  if (entry.avatarStyle === "pixel") {
    return "P";
  } else if (entry.avatarStyle === "rpg") {
    return "R";
  }
  return entry.name.charAt(0);
};

// Helper function to get badge description
const getBadgeDescription = (badge: string) => {
  switch (badge) {
    case "streak":
      return "7-Day Streak: Completed a quest every day for a week";
    case "guild":
      return "Guild Leader: Founded or leads a guild";
    case "top":
      return "Top Performer: Ranked in the top 10% this month";
    case "shield":
      return "Defender: Protected the team by handling critical issues";
    case "sword":
      return "Quest Master: Completed 50+ quests";
    default:
      return badge;
  }
};

// Helper function to generate mock data
const generateMockData = (scope: LeaderboardScope): LeaderboardEntry[] => {
  const avatars = [
    "/lovable-uploads/f44da06d-430c-4883-a4c2-fc7c23f90541.png",
    "/lovable-uploads/5324e09e-faa9-409b-8b3c-5eb4cb764e77.png",
    "/lovable-uploads/7e8f508b-4ea9-4ff0-869a-00e88d532275.png"
  ];
  
  const avatarStyles = ["pixel", "rpg", "modern"];
  const roles = ["Freelancer", "Student", "Corporate Hero", "Guild Master"];
  
  const baseMockData: LeaderboardEntry[] = [
    {
      id: "1",
      rank: 1,
      name: "CodeWarrior",
      avatar: avatars[0],
      avatarStyle: "rpg",
      xp: 28750,
      level: 42,
      guildName: "Binary Knights",
      guildLogo: "/lovable-uploads/f44da06d-430c-4883-a4c2-fc7c23f90541.png",
      badges: ["streak", "guild", "top"],
      isCurrentUser: false,
      role: "Guild Master",
      achievements: ["Email Dragon Slayer", "Meeting Master", "Bug Crusher"],
      questHistory: [
        { name: "Defeat Tax Boss", xp: 500, completedDate: "2024-04-15", completedEarly: true, daysEarly: 3 },
        { name: "Automate Daily Reports", xp: 300, completedDate: "2024-04-10" },
        { name: "Implement New Feature", xp: 450, completedDate: "2024-04-05" }
      ]
    },
    {
      id: "2",
      rank: 2,
      name: "PixelNinja",
      avatar: avatars[1],
      avatarStyle: "pixel",
      xp: 26540,
      level: 38,
      guildName: "Pixel Pioneers",
      badges: ["streak", "top"],
      isCurrentUser: false,
      role: "Freelancer",
      achievements: ["Pixel Perfect", "Design Guru"],
      questHistory: [
        { name: "Design New UI", xp: 400, completedDate: "2024-04-14" },
        { name: "Create Logo Set", xp: 350, completedDate: "2024-04-08", completedEarly: true, daysEarly: 1 }
      ]
    },
    {
      id: "3",
      rank: 3,
      name: "DevDragon",
      avatar: avatars[2],
      avatarStyle: "modern",
      xp: 23100,
      level: 35,
      guildName: "Code Wizards",
      badges: ["guild", "sword"],
      isCurrentUser: false,
      role: "Corporate Hero",
      achievements: ["Code Ninja", "Documentation Master"],
      questHistory: [
        { name: "Refactor Legacy Code", xp: 600, completedDate: "2024-04-12" },
        { name: "Fix Critical Bug", xp: 500, completedDate: "2024-04-07" }
      ]
    },
    {
      id: "4",
      rank: 4,
      name: "QuestMaster",
      xp: 19870,
      level: 31,
      avatarStyle: "rpg",
      badges: ["streak", "shield"],
      isCurrentUser: true,
      role: "Student",
      achievements: ["Fast Learner", "Team Player"],
      questHistory: [
        { name: "Complete Tutorial Series", xp: 300, completedDate: "2024-04-17" },
        { name: "Submit First PR", xp: 250, completedDate: "2024-04-05", completedEarly: true, daysEarly: 2 }
      ]
    },
    {
      id: "5",
      rank: 5,
      name: "BugSlayer",
      xp: 18450,
      level: 29,
      guildName: "Debug Dragons",
      avatarStyle: "modern",
      badges: ["guild"],
      isCurrentUser: false,
      role: "Corporate Hero",
      achievements: ["Bug Hunter", "QA Expert"],
      questHistory: [
        { name: "Test New Feature", xp: 200, completedDate: "2024-04-16" },
        { name: "Create Test Suite", xp: 350, completedDate: "2024-04-10" }
      ]
    },
    {
      id: "6",
      rank: 6,
      name: "CodingWizard",
      xp: 17200,
      level: 27,
      avatarStyle: "pixel",
      badges: [],
      isCurrentUser: false,
      role: "Student",
      questHistory: [
        { name: "Build Portfolio Project", xp: 450, completedDate: "2024-04-13" }
      ]
    },
    {
      id: "7",
      rank: 7,
      name: "AlgorithmAce",
      xp: 16500,
      level: 26,
      guildName: "Binary Knights",
      avatarStyle: "rpg",
      badges: ["streak"],
      isCurrentUser: false,
      role: "Student",
      questHistory: [
        { name: "Optimize Database Query", xp: 300, completedDate: "2024-04-15" }
      ]
    },
    {
      id: "8",
      rank: 8,
      name: "SyntaxSage",
      xp: 15300,
      level: 25,
      avatarStyle: "modern",
      badges: [],
      isCurrentUser: false,
      role: "Freelancer",
      questHistory: [
        { name: "Document API", xp: 250, completedDate: "2024-04-11" }
      ]
    }
  ];
  
  // Generate different variations based on scope
  switch(scope) {
    case LeaderboardScope.REGIONAL:
      return baseMockData.map(entry => ({
        ...entry,
        name: entry.id === "4" ? entry.name : `${entry.name}_Local`,
      })).sort((a, b) => b.xp - a.xp).map((entry, i) => ({ ...entry, rank: i + 1 }));
    
    case LeaderboardScope.COMPANY:
      return baseMockData.slice(2).map(entry => ({
        ...entry,
        guildName: entry.id === "4" ? "Your Team" : entry.guildName || "Company Guild",
      })).sort((a, b) => b.xp - a.xp).map((entry, i) => ({ ...entry, rank: i + 1 }));
      
    case LeaderboardScope.FRIENDS:
      return baseMockData.slice(3, 7).map(entry => ({
        ...entry,
        badges: entry.id === "4" ? entry.badges : []
      })).sort((a, b) => b.xp - a.xp).map((entry, i) => ({ ...entry, rank: i + 1 }));
      
    default:
      return baseMockData;
  }
};

export default Leaderboard;
