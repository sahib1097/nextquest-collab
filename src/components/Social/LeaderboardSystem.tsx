import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Leaderboard from "./Leaderboard";
import { LeaderboardScope, LeaderboardTimeframe } from "@/types/social";
import { Trophy, Users, Building, UserRound, Clock, Globe2, Sword } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";

interface LeaderboardSystemProps {
  compact?: boolean;
  initialScope?: LeaderboardScope;
  showFullLeaderboardLink?: boolean;
  limitEntries?: number;
}

const LeaderboardSystem = ({
  compact = false,
  initialScope = LeaderboardScope.GLOBAL,
  showFullLeaderboardLink = false,
  limitEntries,
}: LeaderboardSystemProps) => {
  const [scope, setScope] = useState<LeaderboardScope>(initialScope);
  const [timeframe, setTimeframe] = useState<LeaderboardTimeframe>(LeaderboardTimeframe.ALL_TIME);
  const navigate = useNavigate();
  const { currentTheme } = useTheme();
  const isMedievalTheme = currentTheme.name === "Medieval";
  const isCyberpunkTheme = currentTheme.name === "Cyberpunk";
  
  return (
    <Card 
      className={`${
        isMedievalTheme 
          ? "border-[4px] border-[#d4af37] rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.3)] font-serif text-[#4b3508] relative overflow-hidden" 
          : isCyberpunkTheme
          ? "bg-[#141622]/80 border-2 border-[#2DE2E6] rounded-lg shadow-[0_0_30px_rgba(45,226,230,0.2)] backdrop-blur-sm"
          : ""
      } ${compact ? "shadow-none" : ""}`}
      style={isMedievalTheme ? {
        backgroundImage: "url('/assets/themes/medieval/backgrounds/parchment.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      } : {}}
    >
      <CardHeader className={compact ? "px-0 pt-0 pb-2" : ""}>
        <CardTitle className="flex items-center justify-between">
          {isMedievalTheme ? (
            <div className="relative mx-7">
              <span className="text-2xl font-bold text-[#4b3508] tracking-wide uppercase font-serif relative">
                {/* Main text with medieval styling */}
                <span className="relative z-10 drop-shadow-[2px_2px_0px_rgba(212,175,55,0.3)]">
                  Leaderboards
                </span>
                {/* Quest board style decorative underline */}
                <div className="absolute -bottom-2 left-0 right-0 flex items-center justify-center">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-[#d4af37]"></div>
                  <div className="mx-2 w-2 h-2 bg-[#d4af37] rotate-45"></div>
                  <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#d4af37] to-[#d4af37]"></div>
                </div>
                {/* Medieval scroll flourishes */}
                <div className="absolute -left-6 top-1/2 transform -translate-y-1/2">
                  <Sword className="w-4 h-4 text-[#d4af37] rotate-45" />
                </div>
                <div className="absolute -right-6 top-1/2 transform -translate-y-1/2">
                  <Sword className="w-4 h-4 text-[#d4af37] rotate-45" />
                </div>
              </span>
            </div>
          ) : isCyberpunkTheme ? (
            <span className="relative px-6 py-3 font-mono font-bold text-3xl tracking-wider uppercase">
              <div className="relative">
                {/* Main container with angular shape */}
                <div className="relative p-4 clip-path-cyberpunk">
                  {/* Glitch effect container */}
                  <div className="relative">
                    {/* Base text */}
                    <span className="relative z-10 bg-gradient-to-r from-[#FF2E97] to-[#2DE2E6] bg-clip-text text-transparent">
                      LEADERBOARDS
                    </span>
                    
                    {/* Glitch effect layers */}
                    <span className="absolute top-0 left-0 text-[#2DE2E6] animate-glitch-1">LEADERBOARDS</span>
                    <span className="absolute top-0 left-0 text-[#FF2E97] animate-glitch-2">LEADERBOARDS</span>
                  </div>
                  
                  {/* Angular accents */}
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#2DE2E6]" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#2DE2E6]" />
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#2DE2E6]" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#2DE2E6]" />
                  
                  {/* Neon glow */}
                  <div className="absolute inset-0 bg-[#2DE2E6]/5 blur-xl" />
                </div>
              </div>
            </span>
          ) : (
            <span>Leaderboards</span>
          )}
          
          {!compact && (
            <Select
              value={timeframe}
              onValueChange={(value) => setTimeframe(value as LeaderboardTimeframe)}
            >
              <SelectTrigger className={`${
                isMedievalTheme 
                  ? "w-36 bg-[#3a2c16] text-yellow-100 border border-[#c9a93d] rounded-md hover:bg-[#4b381d]"
                  : isCyberpunkTheme
                  ? "w-36 bg-[#141622] text-[#2DE2E6] border border-[#2DE2E6] rounded-md hover:bg-[#261D54] transition-all duration-300"
                  : "w-32"
              }`}>
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent className={isCyberpunkTheme ? "bg-[#141622] border border-[#2DE2E6] text-[#E0F2FF]" : ""}>
                <SelectItem value={LeaderboardTimeframe.ALL_TIME}>All Time</SelectItem>
                <SelectItem value={LeaderboardTimeframe.MONTHLY}>Monthly</SelectItem>
                <SelectItem value={LeaderboardTimeframe.WEEKLY}>Weekly</SelectItem>
                <SelectItem value={LeaderboardTimeframe.DAILY}>Daily</SelectItem>
              </SelectContent>
            </Select>
          )}
          
          {showFullLeaderboardLink && (
            isMedievalTheme ? (
              <button
                onClick={() => navigate("/leaderboards")}
                className="relative group"
                title="View Full Rankings"
              >
                <div
                  className="w-10 h-10 rounded-full bg-[#8b0000] shadow-inner shadow-[#5c0000] 
                            border-2 border-[#a52a2a] flex items-center justify-center 
                            hover:scale-105 transition-transform mx-5 my-2"
                >
                  <Trophy className="text-yellow-100 w-5 h-5" />
                </div>
              </button>
            ) : isCyberpunkTheme ? (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate("/leaderboards")}
                className="bg-[#141622] text-[#2DE2E6] border border-[#2DE2E6] hover:bg-[#261D54] transition-all duration-300 mx-5"
              >
                View Full Rankings
              </Button>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate("/leaderboards")}
              >
                View Full Rankings
              </Button>
            )
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className={compact ? "px-0 pb-0" : ""}>
        <Tabs value={scope} onValueChange={(value) => setScope(value as LeaderboardScope)}>
          <TabsList className={`grid grid-cols-4 mb-4 ${
            isMedievalTheme 
              ? "bg-[#2b2112] border border-[#7c5e26] rounded-lg shadow-inner overflow-hidden"
              : isCyberpunkTheme
              ? "bg-[#141622] border-2 border-[#2DE2E6] rounded-lg shadow-[0_0_20px_rgba(45,226,230,0.2)] overflow-hidden backdrop-blur-sm"
              : ""
          }`}>
            <TabsTrigger 
              value={LeaderboardScope.GLOBAL} 
              className={`flex items-center justify-center gap-1 ${
                isMedievalTheme 
                  ? "bg-[#2a3f9d] text-[#ffdf9e] font-bold border-r border-[#1f2e73] hover:bg-[#4b381d] px-3 py-2 transition-all duration-150 ease-in-out"
                  : isCyberpunkTheme
                  ? "bg-transparent data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF2E97] data-[state=active]:to-[#2DE2E6] data-[state=active]:text-white data-[state=active]:shadow-[0_0_15px_rgba(45,226,230,0.3)] hover:bg-[#261D54] transition-all duration-300"
                  : ""
              }`}
            >
              <Globe2 className="h-4 w-4 mr-1" /> 
              {!compact && <span>Global</span>}
            </TabsTrigger>
            <TabsTrigger 
              value={LeaderboardScope.REGIONAL} 
              className={`flex items-center justify-center gap-1 ${
                isMedievalTheme 
                  ? "bg-[#7c1c1c] text-white font-bold hover:bg-[#4b381d] px-4 py-2"
                  : isCyberpunkTheme
                  ? "bg-transparent data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF2E97] data-[state=active]:to-[#2DE2E6] data-[state=active]:text-white data-[state=active]:shadow-[0_0_15px_rgba(45,226,230,0.3)] hover:bg-[#261D54] transition-all duration-300"
                  : ""
              }`}
            >
              <Users className="h-4 w-4" /> 
              {!compact && <span>Regional</span>}
            </TabsTrigger>
            <TabsTrigger 
              value={LeaderboardScope.COMPANY} 
              className={`flex items-center justify-center gap-1 ${
                isMedievalTheme 
                  ? "bg-[#2e4a2c] text-white font-bold hover:bg-[#4b381d] px-4 py-2"
                  : isCyberpunkTheme
                  ? "bg-transparent data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF2E97] data-[state=active]:to-[#2DE2E6] data-[state=active]:text-white data-[state=active]:shadow-[0_0_15px_rgba(45,226,230,0.3)] hover:bg-[#261D54] transition-all duration-300"
                  : ""
              }`}
            >
              <Building className="h-4 w-4" /> 
              {!compact && <span>Company</span>}
            </TabsTrigger>
            <TabsTrigger 
              value={LeaderboardScope.FRIENDS} 
              className={`flex items-center justify-center gap-1 ${
                isMedievalTheme 
                  ? "bg-[#d4af37] text-white font-bold hover:bg-[#4b381d] px-4 py-2"
                  : isCyberpunkTheme
                  ? "bg-transparent data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF2E97] data-[state=active]:to-[#2DE2E6] data-[state=active]:text-white data-[state=active]:shadow-[0_0_15px_rgba(45,226,230,0.3)] hover:bg-[#261D54] transition-all duration-300"
                  : ""
              }`}
            >
              <UserRound className="h-4 w-4" /> 
              {!compact && <span>Friends</span>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value={LeaderboardScope.GLOBAL}>
            <Leaderboard 
              scope={LeaderboardScope.GLOBAL} 
              compact={compact}
              limitEntries={limitEntries}
            />
          </TabsContent>
          
          <TabsContent value={LeaderboardScope.REGIONAL}>
            <Leaderboard 
              scope={LeaderboardScope.REGIONAL} 
              compact={compact}
              limitEntries={limitEntries}
            />
          </TabsContent>
          
          <TabsContent value={LeaderboardScope.COMPANY}>
            <Leaderboard 
              scope={LeaderboardScope.COMPANY} 
              compact={compact}
              limitEntries={limitEntries}
            />
          </TabsContent>
          
          <TabsContent value={LeaderboardScope.FRIENDS}>
            <Leaderboard 
              scope={LeaderboardScope.FRIENDS} 
              compact={compact}
              limitEntries={limitEntries}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LeaderboardSystem;
