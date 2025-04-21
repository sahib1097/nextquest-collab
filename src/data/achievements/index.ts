
import { Achievement } from "@/types/social";
import { RoadmapItem } from "@/types/roadmap";
import { CORE_ACHIEVEMENTS } from "./core";
import { ROADMAP_ACHIEVEMENTS } from "./roadmap";
import { BUDGET_ACHIEVEMENTS } from "./budget";
import { TEAM_ACHIEVEMENTS } from "./team";
import { 
  hasEarnedAchievement,
  awardAchievement,
  updateAchievementProgress,
  awardAchievementEnhanced
} from "./utils";

// Combine all achievements
export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  ...CORE_ACHIEVEMENTS,
  ...ROADMAP_ACHIEVEMENTS,
  ...BUDGET_ACHIEVEMENTS,
  ...TEAM_ACHIEVEMENTS,
];

// Check achievement functions
export const checkRoadmapAchievements = (userId: string, roadmaps: RoadmapItem[]) => {
  const completedItems = roadmaps.filter(item => item.progress === 100);
  const aheadOfSchedule = roadmaps.filter(item => {
    const endDate = new Date(item.endDate);
    const completedDate = new Date(item.progress === 100 ? Date.now() : endDate);
    return item.progress === 100 && completedDate < endDate;
  });

  if (roadmaps.length >= 1) {
    awardAchievementEnhanced(userId, "roadmap-creator", DEFAULT_ACHIEVEMENTS);
  }
  
  if (completedItems.length >= 10) {
    awardAchievementEnhanced(userId, "milestone-master", DEFAULT_ACHIEVEMENTS);
  }
  
  if (aheadOfSchedule.length >= 5) {
    awardAchievementEnhanced(userId, "ahead-of-schedule", DEFAULT_ACHIEVEMENTS);
  }
};

export const checkBudgetAchievements = (userId: string, budgetData: any) => {
  if (budgetData.projectsUnderBudget >= 5) {
    awardAchievementEnhanced(userId, "under-budget", DEFAULT_ACHIEVEMENTS);
  }
  
  if (budgetData.savingsPercentage >= 20) {
    awardAchievementEnhanced(userId, "savings-master", DEFAULT_ACHIEVEMENTS);
  }
};

export const checkTeamAchievements = (userId: string, teamData: any) => {
  if (teamData.teamSize >= 5) {
    awardAchievementEnhanced(userId, "team-builder", DEFAULT_ACHIEVEMENTS);
  }
  
  if (teamData.completedGroupTasks >= 10) {
    awardAchievementEnhanced(userId, "collaboration-pro", DEFAULT_ACHIEVEMENTS);
  }
};

export {
  hasEarnedAchievement,
  awardAchievement,
  updateAchievementProgress,
  awardAchievementEnhanced,
};
