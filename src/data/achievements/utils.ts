import { Achievement } from "@/types/social";
import { RoadmapItem } from "@/types/roadmap";
import { toast } from "sonner";

// Helper functions for achievement management
export const hasEarnedAchievement = (userId: string, achievementId: string): boolean => {
  const storedAchievements = localStorage.getItem(`flux_achievements_${userId}`);
  if (!storedAchievements) return false;
  
  const achievements: Achievement[] = JSON.parse(storedAchievements);
  return achievements.some(a => a.id === achievementId && a.earnedAt);
};

export const awardAchievement = (userId: string, achievementId: string, allAchievements: Achievement[]): Achievement | null => {
  if (hasEarnedAchievement(userId, achievementId)) return null;
  
  const storedAchievements = localStorage.getItem(`flux_achievements_${userId}`) || '[]';
  const achievements: Achievement[] = JSON.parse(storedAchievements);
  
  const achievementToAward = allAchievements.find(a => a.id === achievementId);
  if (!achievementToAward) return null;
  
  const newAchievement: Achievement = {
    ...achievementToAward,
    earnedAt: new Date().toISOString()
  };
  
  const updatedAchievements = [...achievements, newAchievement];
  localStorage.setItem(`flux_achievements_${userId}`, JSON.stringify(updatedAchievements));
  
  return newAchievement;
};

export const updateAchievementProgress = (
  userId: string,
  achievementId: string,
  progress: number,
  allAchievements: Achievement[]
): void => {
  const storedAchievements = localStorage.getItem(`flux_achievements_${userId}`) || '[]';
  const achievements: Achievement[] = JSON.parse(storedAchievements);
  
  const existingIndex = achievements.findIndex(a => a.id === achievementId && !a.earnedAt);
  
  if (existingIndex >= 0) {
    achievements[existingIndex].progress = progress;
    
    if (progress >= 100) {
      achievements[existingIndex].earnedAt = new Date().toISOString();
    }
    
    localStorage.setItem(`flux_achievements_${userId}`, JSON.stringify(achievements));
    return;
  }
  
  const achievementTemplate = allAchievements.find(a => a.id === achievementId);
  if (!achievementTemplate) return;
  
  const newProgressAchievement: Achievement = {
    ...achievementTemplate,
    progress,
    earnedAt: progress >= 100 ? new Date().toISOString() : undefined
  };
  
  achievements.push(newProgressAchievement);
  localStorage.setItem(`flux_achievements_${userId}`, JSON.stringify(achievements));
};

export const awardAchievementEnhanced = (userId: string, achievementId: string, allAchievements: Achievement[]): Achievement | null => {
  const achievement = awardAchievement(userId, achievementId, allAchievements);
  
  if (achievement) {
    toast.success("New Trophy Unlocked! 🏆", {
      description: `${achievement.name} - ${achievement.description}`,
      duration: 5000,
    });
  }
  
  return achievement;
};
