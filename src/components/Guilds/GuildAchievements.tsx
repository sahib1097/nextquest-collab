
import React from "react";
import { motion } from "framer-motion";
import { BadgeCheck, Award, Star, Zap, Medal, Clock, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  earned: boolean;
  progress?: number; // percentage 0-100
  earnedAt?: string;
}

interface GuildAchievementsProps {
  className?: string;
  achievements: Achievement[];
}

const defaultAchievements: Achievement[] = [
  {
    id: "streak-masters",
    name: "Streak Masters",
    description: "Maintain a 30-day guild activity streak",
    icon: <Zap className="h-6 w-6 text-yellow-500" />,
    earned: true,
    earnedAt: "2025-03-15"
  },
  {
    id: "boss-raid",
    name: "Boss Raid Champions",
    description: "Complete a Legendary difficulty guild quest",
    icon: <Trophy className="h-6 w-6 text-purple-600" />,
    earned: false,
    progress: 65
  },
  {
    id: "night-owls",
    name: "Night Owls",
    description: "Complete 10 quests between midnight and 5 AM",
    icon: <Clock className="h-6 w-6 text-indigo-600" />,
    earned: false,
    progress: 40
  },
  {
    id: "first-recruit",
    name: "First Recruit",
    description: "Add your first guild member",
    icon: <Medal className="h-6 w-6 text-amber-600" />,
    earned: true,
    earnedAt: "2025-02-28"
  }
];

export function GuildAchievements({ className, achievements = defaultAchievements }: GuildAchievementsProps) {
  const earnedCount = achievements.filter(a => a.earned).length;
  
  return (
    <Card className={cn("border-amber-200", className)}>
      <CardHeader className="pb-2 bg-amber-50">
        <CardTitle className="text-lg flex items-center">
          <Award className="h-5 w-5 mr-2 text-amber-600" />
          Guild Achievements
          <span className="ml-auto text-sm font-normal text-amber-700">
            {earnedCount}/{achievements.length} Earned
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "relative p-3 rounded-md border",
                achievement.earned ? "bg-amber-50 border-amber-300" : "bg-slate-50 border-slate-200"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  achievement.earned ? "bg-amber-100" : "bg-slate-100"
                )}>
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <h4 className={cn(
                      "text-sm font-medium",
                      achievement.earned ? "text-amber-900" : "text-slate-700"
                    )}>
                      {achievement.name}
                    </h4>
                    {achievement.earned && (
                      <BadgeCheck className="h-4 w-4 ml-1 text-green-600" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600">{achievement.description}</p>
                  
                  {achievement.earned ? (
                    <p className="text-xs text-green-600 mt-1">
                      Earned on {new Date(achievement.earnedAt!).toLocaleDateString()}
                    </p>
                  ) : achievement.progress !== undefined ? (
                    <div className="mt-2">
                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-500" 
                          style={{ width: `${achievement.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{achievement.progress}% complete</p>
                    </div>
                  ) : null}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
