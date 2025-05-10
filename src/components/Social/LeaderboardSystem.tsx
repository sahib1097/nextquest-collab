
import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Leaderboard from "./Leaderboard";
import { LeaderboardScope, LeaderboardTimeframe } from "@/types/social";
import { Trophy, Users, Building, UserRound, Clock, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

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
  
  return (
    /*background color of table here*/
    <Card className={`bg-[#ebdeb8] border-[4px] border-[#bfa171] rounded-xl shadow-[0_0_20px_rgba(255,215,0,0.3)] font-serif text-[#fcefb4] ${compact ? "shadow-none" : ""}`}>
      <CardHeader className={compact ? "px-0 pt-0 pb-2" : ""}>
        <CardTitle className="flex items-center justify-between">
          <span className="px-6 py-3 bg-[#d6b96e] text-[#4b3508] font-black text-3xl tracking-wide border-[4px] border-[#a87e17] rounded-md shadow-[inset_0_0_6px_rgba(0,0,0,0.6)] uppercase font-serif">Leaderboards</span>
          {!compact && (
            <Select
              value={timeframe}
              onValueChange={(value) => setTimeframe(value as LeaderboardTimeframe)}
            >
              <SelectTrigger className="w-36 bg-[#3a2c16] text-yellow-100 border border-[#c9a93d] rounded-md hover:bg-[#4b381d]">
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={LeaderboardTimeframe.ALL_TIME}>All Time</SelectItem>
                <SelectItem value={LeaderboardTimeframe.MONTHLY}>Monthly</SelectItem>
                <SelectItem value={LeaderboardTimeframe.WEEKLY}>Weekly</SelectItem>
                <SelectItem value={LeaderboardTimeframe.DAILY}>Daily</SelectItem>
              </SelectContent>
            </Select>
          )}
          {showFullLeaderboardLink && (
          <button
          onClick={() => navigate("/leaderboards")}
          className="relative flex items-center justify-center h-12 px-10 text-sm font-bold text-[#ffe8a3] group mr-4" // <-- Added `mr-4` to shift it left
        >
          {/* Background frame */}
          <img
            src="/assets/F_UI_MenuButton_C2.png"
            alt="Button Frame"
            className="absolute inset-0 w-full h-full object-fill pointer-events-none"
          />
        
          {/* Left handle */}
          <img
            src="/assets/F_U_Detail4-Left.png"
            alt="Left Detail"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 h-8 pointer-events-none"
          />
        
          {/* Button Text */}
          <span className="relative z-10">View Full Rankings</span>
        
          {/* Right handle */}
          <img
            src="/assets/F_U_Detail4.png"
            alt="Right Detail"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-8 pointer-events-none"
          />
        </button>
          
      )}
        </CardTitle>
      </CardHeader>
      <CardContent className={compact ? "px-0 pb-0" : ""}>
        <Tabs value={scope} onValueChange={(value) => setScope(value as LeaderboardScope)}>
          <TabsList className="grid grid-cols-4 mb-4 bg-[#2b2112] border border-[#7c5e26] rounded-lg shadow-inner overflow-hidden">
            <TabsTrigger value={LeaderboardScope.GLOBAL} className="bg-[#2a3f9d] text-[#ffdf9e] font-bold border-r border-[#1f2e73] hover:bg-[#4b381d] px-3 py-2 transition-all duration-150 ease-in-out"
            >
              <Globe2 className="h-4 w-4 mr-1" /> 
              {!compact && <span>Global</span>}
            </TabsTrigger>
            <TabsTrigger value={LeaderboardScope.REGIONAL} className="bg-[#7c1c1c] text-white font-bold hover:bg-[#4b381d] px-4 py-2 ">
              <Users className="h-4 w-4" /> 
              {!compact && <span>Regional</span>}
            </TabsTrigger>
            <TabsTrigger value={LeaderboardScope.COMPANY} className="bg-[#2e4a2c] text-white font-bold hover:bg-[#4b381d] px-4 py-2 ">
              <Building className="h-4 w-4" /> 
              {!compact && <span>Company</span>}
            </TabsTrigger>
            <TabsTrigger value={LeaderboardScope.FRIENDS} className="bg-[#d4af37] text-white font-bold hover:bg-[#4b381d] px-4 py-2 ">
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
