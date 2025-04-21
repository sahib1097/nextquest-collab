
import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Leaderboard from "./Leaderboard";
import { LeaderboardScope, LeaderboardTimeframe } from "@/types/social";
import { Trophy, Users, Building, UserRound, Clock } from "lucide-react";
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
    <Card className={compact ? "border-0 shadow-none" : ""}>
      <CardHeader className={compact ? "px-0 pt-0 pb-2" : ""}>
        <CardTitle className="flex items-center justify-between">
          <span>Leaderboards</span>
          {!compact && (
            <Select
              value={timeframe}
              onValueChange={(value) => setTimeframe(value as LeaderboardTimeframe)}
            >
              <SelectTrigger className="w-32">
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
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate("/leaderboards")}
            >
              View Full Rankings
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className={compact ? "px-0 pb-0" : ""}>
        <Tabs value={scope} onValueChange={(value) => setScope(value as LeaderboardScope)}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value={LeaderboardScope.GLOBAL} className="flex items-center justify-center gap-1">
              <Trophy className="h-4 w-4" /> 
              {!compact && <span>Global</span>}
            </TabsTrigger>
            <TabsTrigger value={LeaderboardScope.REGIONAL} className="flex items-center justify-center gap-1">
              <Users className="h-4 w-4" /> 
              {!compact && <span>Regional</span>}
            </TabsTrigger>
            <TabsTrigger value={LeaderboardScope.COMPANY} className="flex items-center justify-center gap-1">
              <Building className="h-4 w-4" /> 
              {!compact && <span>Company</span>}
            </TabsTrigger>
            <TabsTrigger value={LeaderboardScope.FRIENDS} className="flex items-center justify-center gap-1">
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
