
import * as z from "zod";

export const guildFormSchema = z.object({
  name: z.string()
    .min(3, "Your guild name must be at least 3 characters long, brave leader!")
    .max(30, "Whoa there! Keep your guild name under 30 characters")
    .regex(/^[a-zA-Z0-9\s-]+$/, "Only letters, numbers, spaces, and hyphens are allowed in this realm"),
  focus: z.string().min(1, "Choose your guild's path, adventurer!"),
  description: z.string().max(300, "Your guild's tale must be told in 300 characters or less"),
  joiningQuest: z.string().optional(),
  tags: z.string().max(100, "Too many tags might summon a debug dragon!"),
  logo: z.string().optional(),
});

export type GuildFormValues = z.infer<typeof guildFormSchema>;

export const focusAreas = ["Work", "Fitness", "Creative", "Chaos Crew", "Learning", "Gaming"];

// Guild XP mechanics constants
export const XP_PER_QUEST = 100;
export const XP_GUILD_QUEST = 500;
export const STREAK_BONUS_PERCENT = 10; // 10%

// Level formula: N requires (10,000 × N²) XP
export const calculateXpForLevel = (level: number) => 10000 * Math.pow(level, 2);

// Guild level unlocks
export interface GuildUnlock {
  level: number;
  name: string;
  description: string;
  icon: string;
}

export const guildUnlocks: GuildUnlock[] = [
  {
    level: 5,
    name: "Custom Banner",
    description: "Customize your guild banner and unlock emoji reactions",
    icon: "PenBox"
  },
  {
    level: 10,
    name: "Guild Hall",
    description: "Unlock Guild Hall with shared chat and GIF battles",
    icon: "Castle"
  },
  {
    level: 20,
    name: "XP Doubler",
    description: "Guild-wide XP doubler weekends for accelerated progression",
    icon: "Zap"
  },
  {
    level: 50,
    name: "Legendary Status",
    description: "Permanent Legendary Guild title + IRL merch discount",
    icon: "Crown"
  }
];

// Guild member roles
export type GuildRole = "Leader" | "Officer" | "Member";

// Pro user error messages
export const PRO_FEATURE_MESSAGES = {
  createGuild: "This quest requires a Guild Master license! Upgrade to Pro Hero to lead your squad →",
  customBanner: "Unlock the Banner Customization Scroll with Pro Hero rank →",
  analytics: "The Ancient Analytics Tome is reserved for Pro Heroes only →",
  raidQuests: "Guild Raid Quests await Pro Heroes! Upgrade your rank to lead epic battles →",
  memberLimit: "Your party is full! Upgrade to Pro Hero to expand your ranks →"
};

