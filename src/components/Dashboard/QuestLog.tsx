import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Quest, QuestStatus, UserLevel } from "@/types/quest";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Award, Star, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { calculateLevelProgress } from "@/utils/questUtils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const QuestLog = () => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [userLevel, setUserLevel] = useState<UserLevel | null>(null);
  
  useEffect(() => {
    // Load quests from localStorage
    const storedQuests = localStorage.getItem("fluxQuests");
    if (storedQuests) {
      const parsedQuests: Quest[] = JSON.parse(storedQuests);
      setQuests(parsedQuests);
    }

    // const raw = localStorage.getItem("fluxUserLevel");
    // if (raw) {
    //   const lvl: UserLevel = JSON.parse(raw);
    //   if (lvl.username) {
    //     setUserLevel(lvl);
    //   } else {
    //     console.warn("Missing username in saved userLevel:", lvl);
    //   }
    // }
    
    // Load user level from localStorage
    const storedUserLevel = localStorage.getItem("fluxUserLevel");
    if (storedUserLevel) {
      const parsedUserLevel = JSON.parse(storedUserLevel);
      setUserLevel(parsedUserLevel);
    }
  }, []);
  
  // Get counts of quests by status
  const availableQuests = quests.filter(quest => quest.status === QuestStatus.AVAILABLE);
  const inProgressQuests = quests.filter(quest => quest.status === QuestStatus.IN_PROGRESS);
  const completedQuests = quests.filter(quest => quest.status === QuestStatus.COMPLETED);
  
  // Calculate level progress
  const levelProgress = userLevel ? calculateLevelProgress(userLevel.xp, userLevel.level) : 0;
  
  return (
    <Card className="border-border shadow-sm hover:shadow-md transition-shadow bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border bg-card">
        <CardTitle className="text-lg font-medium text-foreground">Quest Log</CardTitle>
        <Link to="/admin/quests">
          <Button variant="ghost" size="sm">View All</Button>
        </Link>
      </CardHeader>
      <CardContent className="p-4 bg-card">
        <div className="flex flex-col space-y-4">
          {/* User Level */}
          {userLevel && (
            <div className="bg-muted/50 p-3 rounded-md border border-border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="mr-3">
                    <Avatar className="h-8 w-8 border border-border">
                      {userLevel.profilePicture ? (
                        <AvatarImage src={userLevel.profilePicture} alt={userLevel.username} />
                      ) : (
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {userLevel?.username?.charAt(0)?.toUpperCase() || '?'}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </div>
                  <span className="font-medium text-foreground">{userLevel.username}</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-primary mr-1" />
                  <span className="text-sm font-bold text-foreground">Level {userLevel.level}</span>
                </div>
              </div>
              <div className="mt-1">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>{userLevel.xp} XP</span>
                  <span>{userLevel.nextLevelXp} XP</span>
                </div>
                <Progress value={levelProgress} className="h-2" />
              </div>
            </div>
          )}
          
          {/* Quest Status */}
          <div className="grid grid-cols-3 gap-3 mt-1">
            <div className="bg-muted/50 p-3 rounded-md border border-border flex flex-col items-center">
              <div className="text-primary font-semibold text-xl mb-1">{availableQuests.length}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                <span>Available</span>
              </div>
            </div>
            <div className="bg-muted/50 p-3 rounded-md border border-border flex flex-col items-center">
              <div className="text-primary font-semibold text-xl mb-1">{inProgressQuests.length}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                <span>In Progress</span>
              </div>
            </div>
            <div className="bg-muted/50 p-3 rounded-md border border-border flex flex-col items-center">
              <div className="text-primary font-semibold text-xl mb-1">{completedQuests.length}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <CheckCircle className="h-3 w-3 mr-1" />
                <span>Completed</span>
              </div>
            </div>
          </div>
          
          {/* Recent Quests */}
          {quests.length > 0 ? (
            <div className="mt-1">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Recent Available Quests</h4>
              <ScrollArea className="h-[120px] w-full rounded-md border border-border p-2 bg-muted/50">
                {availableQuests.slice(0, 3).map((quest) => (
                  <div key={quest.id} className="mb-2 pb-2 border-b border-border last:border-0 last:mb-0 last:pb-0">
                    <div className="font-medium text-sm text-foreground">{quest.title}</div>
                    <div className="text-xs text-muted-foreground">{quest.xpReward} XP • {quest.difficulty}</div>
                  </div>
                ))}
                {availableQuests.length === 0 && (
                  <div className="text-center text-sm text-muted-foreground py-4">
                    No available quests
                  </div>
                )}
              </ScrollArea>
            </div>
          ) : (
            <div className="text-center text-sm text-muted-foreground py-2">
              No quests created yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestLog;
