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
import { API } from "@/config";

const QuestLog = () => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [userLevel, setUserLevel] = useState<UserLevel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Try to fetch user data from API first
        const res = await fetch(`${API}/api/auth/me`, {
          credentials: 'include'
        });
        
        if (res.ok) {
          const userData = await res.json();
          // Update user level with API data
          console.log(userData)
          const updatedUserLevel = {
            userId: userData.id,
            username: userData.name,
            xp: userData.userLevel.xp || 0,
            level: userData.userLevel.level || 1,
            nextLevelXp: userData.userLevel.nextLevelXp || 100,
            profilePicture: userData.userLevel.profilePicture
          };
          setUserLevel(updatedUserLevel);
          localStorage.setItem("fluxUserLevel", JSON.stringify(updatedUserLevel));
        } else {
          // Fallback to localStorage if API fails
          const storedUserLevel = localStorage.getItem("fluxUserLevel");
          if (storedUserLevel) {
            setUserLevel(JSON.parse(storedUserLevel));
          }
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        // Fallback to localStorage on error
        const storedUserLevel = localStorage.getItem("fluxUserLevel");
        if (storedUserLevel) {
          setUserLevel(JSON.parse(storedUserLevel));
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Load quests from localStorage
    const storedQuests = localStorage.getItem("fluxQuests");
    if (storedQuests) {
      try {
        const parsedQuests: Quest[] = JSON.parse(storedQuests);
        setQuests(parsedQuests);
      } catch (err) {
        console.error("Error parsing quests:", err);
        setError("Failed to load quests");
      }
    }
    
    fetchUserData();
  }, []);
  
  // Get counts of quests by status
  const availableQuests = quests.filter(quest => quest.status === QuestStatus.AVAILABLE);
  const inProgressQuests = quests.filter(quest => quest.status === QuestStatus.IN_PROGRESS);
  const completedQuests = quests.filter(quest => quest.status === QuestStatus.COMPLETED);
  
  // Calculate level progress
  const levelProgress = userLevel ? calculateLevelProgress(userLevel.xp, userLevel.level) : 0;
  
  if (isLoading) {
    return (
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-4">
          <div className="text-center text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }
  
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
                    <Avatar className="h-8 w-8 border border-blue-100">
                      {userLevel?.profilePicture ? (
                        <AvatarImage src={userLevel.profilePicture} alt={userLevel?.username || 'User'} />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                          {userLevel?.username ? userLevel.username.charAt(0).toUpperCase() : 'U'}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </div>
                  <span className="font-medium">{userLevel?.username || 'User'}</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-purple-500 mr-1" />
                  <span className="text-sm font-bold">Level {userLevel?.level || 1}</span>
                </div>
              </div>
              <div className="mt-1">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>{userLevel?.xp || 0} XP</span>
                  <span>{userLevel?.nextLevelXp || 100} XP</span>
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
