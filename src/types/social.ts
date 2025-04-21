
export enum AchievementType {
  // Trophy rarity levels (PlayStation-style)
  BRONZE = "Bronze",
  SILVER = "Silver",
  GOLD = "Gold",
  PLATINUM = "Platinum",

  // Categories
  SPEED = "Speed",
  TEAM = "Team",
  QUEST = "Quest",
  MILESTONE = "Milestone",
  EXPERTISE = "Expertise",
  EXPLORATION = "Exploration",
  
  // Special achievement types
  SPEED_RUNNER = "Speed Runner"
}

export enum TrophyRarity {
  COMMON = "Common",
  UNCOMMON = "Uncommon",
  RARE = "Rare", 
  VERY_RARE = "Very Rare",
  ULTRA_RARE = "Ultra Rare"
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  type: AchievementType;    // Trophy category
  rarity: TrophyRarity;     // How difficult it is to obtain
  icon: string;             // Icon name (from Lucide icons)
  earnedAt?: string;        // When the user earned it
  progress?: number;        // Progress toward earning (0-100)
  requiredValue?: number;   // Value required to earn (e.g., 5 quests)
  hidden?: boolean;         // If true, details are hidden until earned
  color?: string;           // Custom color
  animation?: string;       // Animation type when earned
}

export interface AchievementParameter {
  id: string;
  name: string;
  description: string;
  dataPoint: string;        // What data to track (e.g., "completedQuests")
  compareType: "gt" | "lt" | "eq" | "gte" | "lte"; // Greater than, less than, etc
  targetValue: number;      // Value to compare against
  type: AchievementType;    // Trophy category
  rarity: TrophyRarity;     // How rare is this achievement
}

export enum LeaderboardScope {
  GLOBAL = "global",
  REGIONAL = "regional",
  COMPANY = "company",
  FRIENDS = "friends"
}

export enum LeaderboardTimeframe {
  ALL_TIME = "all-time",
  MONTHLY = "monthly",
  WEEKLY = "weekly",
  DAILY = "daily"
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  xp: number;
  level: number;
  rank: number;
  profilePicture?: string;
  avatarStyle?: "pixel" | "rpg" | "modern";
  previousRank?: number;
  achievements?: Achievement[];
  region?: string;
  country?: string;
  city?: string;
  company?: string;
  department?: string;
  guild?: string;
  guildId?: string;
  guildLogo?: string;
  streakDays?: number;
  badges?: string[];
  friendStatus?: "friend" | "pending" | null;
  role?: string;
  questHistory?: {
    name: string;
    xp: number;
    completedDate: string;
    completedEarly?: boolean;
    daysEarly?: number;
  }[];
}

export interface LeaderboardFilter {
  scope: LeaderboardScope;
  timeframe: LeaderboardTimeframe;
  region?: string;
  country?: string;
  city?: string;
  company?: string;
  department?: string;
  guildOnly?: boolean;
  friendsOnly?: boolean;
  role?: string;
}

export interface Party {
  id: string;
  name: string;
  members: string[];
  questId?: string;
  createdAt: string;
  chat: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: string;
}
