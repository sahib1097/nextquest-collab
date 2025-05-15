import { useState, forwardRef } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Quest, QuestStatus } from "@/types/quest";
import { Award, Calendar, Clock, MapPin, Users, User, GripVertical, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import confetti from "canvas-confetti";
import { motion, Variants } from "framer-motion";
import QuestProgressRing from "./QuestProgressRing";
import PartyChat from "../Social/PartyChat";
import { AchievementType } from "@/types/social";

interface QuestCardProps {
  quest: Quest;
  isDragging?: boolean;
  dragHandleProps?: any;
}

const QuestCard = forwardRef<HTMLDivElement, QuestCardProps>(({ quest, isDragging, dragHandleProps }, ref) => {
  const [isAccepting, setIsAccepting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [glowing, setGlowing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0.2, y: 0.6 }
      });
    }, 200);
    
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 0.8, y: 0.6 }
      });
    }, 400);
  };

  const handleAcceptQuest = () => {
    setIsAccepting(true);
    setGlowing(true);
    
    setTimeout(() => {
      const storedQuests = localStorage.getItem("fluxQuests");
      if (storedQuests) {
        const quests = JSON.parse(storedQuests);
        const updatedQuests = quests.map((q: Quest) => {
          if (q.id === quest.id) {
            return { ...q, status: QuestStatus.IN_PROGRESS };
          }
          return q;
        });
        localStorage.setItem("fluxQuests", JSON.stringify(updatedQuests));
        
        toast.success("Quest accepted!");
        
        const inProgressTab = document.querySelector('[value="inProgress"]') as HTMLElement;
        if (inProgressTab) {
          setTimeout(() => {
            inProgressTab.click();
          }, 500);
        }
        
        window.location.reload();
      }
      
      setIsAccepting(false);
    }, 1500);
  };
  
  const handleCompleteQuest = () => {
    setIsCompleting(true);
    
    triggerConfetti();
    
    setTimeout(() => {
      const storedQuests = localStorage.getItem("fluxQuests");
      if (storedQuests) {
        const quests = JSON.parse(storedQuests);
        const updatedQuests = quests.map((q: Quest) => {
          if (q.id === quest.id) {
            return { 
              ...q, 
              status: QuestStatus.COMPLETED,
              completedAt: new Date().toISOString()
            };
          }
          return q;
        });
        localStorage.setItem("fluxQuests", JSON.stringify(updatedQuests));
        
        if (quest.linkedTaskId && quest.projectId) {
          const storedProjects = localStorage.getItem("fluxProjects");
          if (storedProjects) {
            const projects = JSON.parse(storedProjects);
            const updatedProjects = projects.map((project: any) => {
              if (project.id === quest.projectId) {
                const updatedTasks = (project.tasks || []).map((task: any) => {
                  if (task.id === quest.linkedTaskId) {
                    return { ...task, completed: true };
                  }
                  return task;
                });
                return { ...project, tasks: updatedTasks };
              }
              return project;
            });
            localStorage.setItem("fluxProjects", JSON.stringify(updatedProjects));
          }
        }
        
        const activeBoost = JSON.parse(localStorage.getItem("activeXPBoost") || "null");
        let finalXpReward = quest.xpReward;
        
        if (activeBoost && new Date(activeBoost.expiresAt) > new Date()) {
          finalXpReward = Math.floor(quest.xpReward * activeBoost.multiplier);
          localStorage.removeItem("activeXPBoost");
        }

        const storedUserLevel = localStorage.getItem("fluxUserLevel");
        if (storedUserLevel) {
          const userLevel = JSON.parse(storedUserLevel);
          
          const newXp = userLevel.xp + finalXpReward;
          const newLevel = Math.floor(Math.sqrt(newXp / 100)) + 1;
          const nextLevelXp = Math.pow(newLevel, 2) * 100;
          
          const updatedUserLevel = {
            ...userLevel,
            xp: newXp,
            level: newLevel,
            nextLevelXp
          };
          
          localStorage.setItem("fluxUserLevel", JSON.stringify(updatedUserLevel));
        }

        // Check for speed runner achievement
        const createdAt = new Date(quest.createdAt).getTime();
        const completedAt = new Date().getTime();
        const timeDiff = completedAt - createdAt;
        
        // Completed within 30 minutes
        if (timeDiff < 30 * 60 * 1000) {
          // Check if user already has achievements
          const userLevel = JSON.parse(localStorage.getItem("fluxUserLevel") || '{}');
          const userId = userLevel.userId || "current-user";
          const storedAchievements = localStorage.getItem(`flux_achievements_${userId}`);
          
          if (storedAchievements) {
            const achievements = JSON.parse(storedAchievements);
            const hasSpeedRunner = achievements.some((a: any) => a.type === AchievementType.SPEED_RUNNER);
            
            if (!hasSpeedRunner) {
              // Count fast completed quests
              const completedQuests = updatedQuests.filter((q: Quest) => 
                q.status === QuestStatus.COMPLETED &&
                q.completedAt && 
                new Date(q.completedAt).getTime() - new Date(q.createdAt).getTime() < 30 * 60 * 1000
              );
              
              if (completedQuests.length >= 3) {
                // Add speed runner achievement
                const newAchievement = {
                  id: crypto.randomUUID(),
                  type: AchievementType.SPEED_RUNNER,
                  name: "Speed Runner",
                  description: "Complete 3 quests in under 30 minutes each",
                  icon: "timer",
                  earnedAt: new Date().toISOString()
                };
                
                const updatedAchievements = [...achievements, newAchievement];
                localStorage.setItem(`flux_achievements_${userId}`, JSON.stringify(updatedAchievements));
                
                toast.success("New Achievement Unlocked: Speed Runner!", {
                  duration: 5000
                });
              }
            }
          }
        }
        
        toast.success(
          `Quest completed! Earned ${finalXpReward} XP${quest.isGroupQuest ? " (shared)" : ""}!${
            finalXpReward > quest.xpReward ? ` (${activeBoost?.multiplier}x boost applied!)` : ""
          }`,
          { duration: 5000 }
        );
        
        const completedTab = document.querySelector('[value="completed"]') as HTMLElement;
        if (completedTab) {
          setTimeout(() => {
            completedTab.click();
          }, 1500);
        } else {
          window.location.reload();
        }
      }
      
      setIsCompleting(false);
    }, 1500);
  };
  
  const handleFailQuest = () => {
    const storedQuests = localStorage.getItem("fluxQuests");
    if (storedQuests) {
      const quests = JSON.parse(storedQuests);
      const updatedQuests = quests.map((q: Quest) => {
        if (q.id === quest.id) {
          return { ...q, status: QuestStatus.FAILED };
        }
        return q;
      });
      localStorage.setItem("fluxQuests", JSON.stringify(updatedQuests));
      
      toast.error("Quest failed!");
      
      const failedTab = document.querySelector('[value="failed"]') as HTMLElement;
      if (failedTab) {
        setTimeout(() => {
          failedTab.click();
        }, 500);
      } else {
        window.location.reload();
      }
    }
  };
  
  const getBadgeColor = () => {
    switch (quest.status) {
      case QuestStatus.AVAILABLE:
        return "secondary";
      case QuestStatus.IN_PROGRESS:
        return "default";
      case QuestStatus.COMPLETED:
        return "outline";
      case QuestStatus.FAILED:
        return "destructive";
      default:
        return "secondary";
    }
  };
  
  const getStatusActions = () => {
    switch (quest.status) {
      case QuestStatus.AVAILABLE:
        return (
          <Button
            variant="default"
            className="w-full"
            onClick={handleAcceptQuest}
            disabled={isAccepting}
          >
            {isAccepting ? (
              <span className="flex items-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-2"
                >
                  ⚔️
                </motion.div>
                Accepting...
              </span>
            ) : (
              "Accept Quest"
            )}
          </Button>
        );
      case QuestStatus.IN_PROGRESS:
        return (
          <div className="flex gap-2">
            <Button
              variant="default"
              className="flex-1"
              onClick={handleCompleteQuest}
              disabled={isCompleting}
            >
              {isCompleting ? (
                <span className="flex items-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="mr-2"
                  >
                    🎉
                  </motion.div>
                  Completing...
                </span>
              ) : (
                "Complete Quest"
              )}
            </Button>
            <Button
              variant="destructive"
              onClick={handleFailQuest}
              disabled={isCompleting}
            >
              Abandon
            </Button>
          </div>
        );
      default:
        return null;
    }
  };
  
  const createdDate = new Date(quest.createdAt);
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true });
  
  const cardVariants: Variants = {
    ready: {
      scale: [1, 1.02, 1],
      boxShadow: [
        "0 0 0 rgba(155, 135, 245, 0)",
        "0 0 20px rgba(155, 135, 245, 0.5)",
        "0 0 0 rgba(155, 135, 245, 0)"
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    },
    dragging: {
      scale: 1.05,
      boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
    },
    idle: {
      scale: 1,
      boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
    }
  };

  return (
    <motion.div
      ref={ref}
      animate={{ scale: isDragging ? 1.05 : 1 }}
      className={`relative ${glowing ? "animate-glow" : ""}`}
      style={{ transformOrigin: "center" }}
    >
      <Card className="bg-card border-2 border-border shadow-md overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={getBadgeColor()}>
                  {quest.status}
                </Badge>
                {quest.isGroupQuest && (
                  <Badge variant="secondary">
                    <Users className="h-3 w-3 mr-1" /> Group Quest
                  </Badge>
                )}
              </div>
              <h3 className="text-lg font-semibold">{quest.name}</h3>
            </div>
            {quest.status === QuestStatus.IN_PROGRESS && quest.isGroupQuest && (
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setIsChatOpen(true)}
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex items-start gap-4">
            <div className="flex-1 space-y-2">
              <p className="text-muted-foreground">{quest.description}</p>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                {quest.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{quest.location}</span>
                  </div>
                )}
                {quest.dueDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Due {formatDistanceToNow(new Date(quest.dueDate), { addSuffix: true })}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{quest.estimatedTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="h-4 w-4" />
                  <span>{quest.xpReward} XP</span>
                </div>
                {quest.assignedTo && (
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>Assigned to {quest.assignedTo}</span>
                  </div>
                )}
              </div>
            </div>
            {quest.status === QuestStatus.IN_PROGRESS && (
              <div className="flex-shrink-0">
                <QuestProgressRing progress={quest.progress || 0} />
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          {getStatusActions()}
        </CardFooter>
      </Card>
      {quest.isGroupQuest && (
        <PartyChat
          questId={quest.id}
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </motion.div>
  );
});

QuestCard.displayName = "QuestCard";

export default QuestCard;
