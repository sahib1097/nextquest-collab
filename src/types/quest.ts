export enum QuestDifficulty {
  SIMPLE = "Simple",
  MODERATE = "Moderate",
  DIFFICULT = "Difficult",
}

export enum QuestStatus {
  AVAILABLE = "Available",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
  FAILED = "Failed",
}

export enum UserRole {
  USER = "User",
  TEAM_LEAD = "Team Lead",
  ADMIN = "Admin",
  SUPER_ADMIN = "Super Admin"
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  assignedBy: string;
  assignedTo: string | string[]; // Updated to support multiple assignees
  isGroupQuest?: boolean; // Flag to identify group quests
  groupMembers?: string[]; // Names of group members
  difficulty: QuestDifficulty;
  status: QuestStatus;
  xpReward: number;
  dueDate: string;
  createdAt: string;
  completedAt?: string;
  projectId?: string;
  projectName?: string;
  linkedTaskId?: string;
  location?: string;  // Add location field
  estimatedTime?: string;  // Add estimatedTime field
  progress?: number;  // Add progress field
}

export interface UserLevel {
  userId: string;
  username: string;
  xp: number;
  level: number;
  nextLevelXp: number;
  profilePicture?: string;
  role?: UserRole;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  status: "active" | "pending" | "inactive";
  joinedDate?: string;
}

export interface ProjectBoard {
  id: string;
  name: string;
  description?: string;
  projects: any[];
  categories: {
    id: string;
    name: string;
  }[];
  createdAt: string;
}
