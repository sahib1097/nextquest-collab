
import { QuestDifficulty } from "../types/quest";

// XP reward ranges by difficulty
const XP_REWARDS = {
  [QuestDifficulty.SIMPLE]: { min: 50, max: 100 },
  [QuestDifficulty.MODERATE]: { min: 150, max: 300 },
  [QuestDifficulty.DIFFICULT]: { min: 400, max: 800 },
};

// Generate random XP based on difficulty
export const generateXpReward = (difficulty: QuestDifficulty): number => {
  const { min, max } = XP_REWARDS[difficulty];
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Calculate level based on XP
export const calculateLevel = (xp: number): number => {
  // Quadratic scaling formula: each level requires progressively more XP
  // This formula is: level = floor(sqrt(xp / 100))
  // Level 1: 0-100 XP
  // Level 2: 101-400 XP
  // Level 3: 401-900 XP
  // etc.
  const level = Math.floor(Math.sqrt(xp / 100)) + 1;
  return Math.min(level, 100); // Cap at level 100
};

// Calculate XP needed for next level
export const calculateXpForNextLevel = (currentLevel: number): number => {
  if (currentLevel >= 100) return 0; // Already max level
  const nextLevel = currentLevel + 1;
  return nextLevel * nextLevel * 100; // Level 2 needs 400 XP total, Level 3 needs 900 XP total, etc.
};

// Calculate current progress percentage towards next level
export const calculateLevelProgress = (xp: number, level: number): number => {
  if (level >= 100) return 100; // Already max level
  
  const currentLevelMinXp = (level - 1) * (level - 1) * 100;
  const nextLevelMinXp = level * level * 100;
  const xpInCurrentLevel = xp - currentLevelMinXp;
  const xpNeededForNextLevel = nextLevelMinXp - currentLevelMinXp;
  
  return Math.floor((xpInCurrentLevel / xpNeededForNextLevel) * 100);
};
