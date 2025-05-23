import { useState } from "react";
import { motion } from "framer-motion";
import { Achievement, TrophyRarity } from "@/types/social";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Award, Share2, Trophy, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";

interface AchievementBadgeProps {
  achievement: Achievement;
  animate?: boolean;
  size?: "sm" | "md" | "lg";
}

const AchievementBadge = ({ achievement, animate = false, size = "md" }: AchievementBadgeProps) => {
  const [isSharing, setIsSharing] = useState(false);
  const { currentTheme } = useTheme();

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSharing(true);
    
    // Mock share functionality
    setTimeout(() => {
      toast.success(`Shared "${achievement.name}" trophy!`);
      setIsSharing(false);
    }, 1000);
  };

  const badgeVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1, rotate: [0, -5, 5, -3, 0] },
    hover: { scale: 1.05, rotate: 0 },
    tap: { scale: 0.95 }
  };

  const getBadgeSize = () => {
    switch(size) {
      case "sm": return "py-0.5 px-2 text-xs";
      case "lg": return "py-2 px-4 text-sm";
      case "md":
      default: return "py-1.5 px-3";
    }
  };

  const getTrophyColor = () => {
    if (achievement.hidden && !achievement.earnedAt) {
      return currentTheme.colors.accent;
    }
    switch (achievement.type) {
      case "Bronze": return currentTheme.colors.accent;
      case "Silver": return currentTheme.colors.secondary;
      case "Gold": return currentTheme.colors.primary;
      case "Platinum": return currentTheme.colors.accent;
      default: return currentTheme.colors.primary;
    }
  };

  const getBadgeStyle = () => {
    if (achievement.hidden && !achievement.earnedAt) {
      return {
        background: currentTheme.colors.secondary,
        text: currentTheme.colors.accent,
        border: currentTheme.colors.border
      };
    }

    switch (achievement.type) {
      case "Bronze":
        return {
          background: `linear-gradient(to right, ${currentTheme.colors.accent}20, ${currentTheme.colors.accent}30)`,
          text: currentTheme.colors.accent,
          border: currentTheme.colors.accent
        };
      case "Silver":
        return {
          background: `linear-gradient(to right, ${currentTheme.colors.secondary}20, ${currentTheme.colors.secondary}30)`,
          text: currentTheme.colors.secondary,
          border: currentTheme.colors.secondary
        };
      case "Gold":
        return {
          background: `linear-gradient(to right, ${currentTheme.colors.primary}20, ${currentTheme.colors.primary}30)`,
          text: currentTheme.colors.primary,
          border: currentTheme.colors.primary
        };
      case "Platinum":
        return {
          background: `linear-gradient(to right, ${currentTheme.colors.accent}20, ${currentTheme.colors.accent}30)`,
          text: currentTheme.colors.accent,
          border: currentTheme.colors.accent
        };
      default:
        return {
          background: `linear-gradient(to right, ${currentTheme.colors.primary}20, ${currentTheme.colors.primary}30)`,
          text: currentTheme.colors.primary,
          border: currentTheme.colors.primary
        };
    }
  };

  const getRarityDot = () => {
    if (!achievement.earnedAt) return null;

    const dotColor = () => {
      switch(achievement.rarity) {
        case TrophyRarity.COMMON: return currentTheme.colors.accent;
        case TrophyRarity.UNCOMMON: return currentTheme.colors.secondary;
        case TrophyRarity.RARE: return currentTheme.colors.primary;
        case TrophyRarity.VERY_RARE: return currentTheme.colors.accent;
        case TrophyRarity.ULTRA_RARE: return currentTheme.colors.primary;
        default: return currentTheme.colors.accent;
      }
    };

    return (
      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
        <div 
          className="h-1.5 w-1.5 rounded-full shadow-sm"
          style={{ backgroundColor: dotColor() }}
        />
      </div>
    );
  };

  const badgeStyle = getBadgeStyle();

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <motion.div
          variants={badgeVariants}
          initial={animate ? "initial" : undefined}
          animate={animate ? "animate" : undefined}
          whileHover="hover"
          whileTap="tap"
          transition={{ duration: 0.5 }}
          className="relative cursor-pointer"
        >
          <Badge 
            className={`flex items-center gap-1.5 ${getBadgeSize()} relative shadow-sm transition-all duration-300`}
            style={{
              background: badgeStyle.background,
              color: badgeStyle.text,
              borderColor: badgeStyle.border
            }}
          >
            {achievement.hidden && !achievement.earnedAt ? (
              <Lock className={`${size === "sm" ? "h-3 w-3" : "h-4 w-4"}`} style={{ color: badgeStyle.text }} />
            ) : (
              <Trophy className={`${size === "sm" ? "h-3 w-3" : "h-4 w-4"}`} style={{ color: badgeStyle.text }} />
            )}
            <span className="font-medium">
              {achievement.hidden && !achievement.earnedAt ? "???" : achievement.name}
            </span>
            {getRarityDot()}
          </Badge>
          
          {achievement.earnedAt && (
            <motion.button
              className="absolute -top-1 -right-1 rounded-full p-0.5 shadow-sm"
              style={{
                backgroundColor: currentTheme.colors.background,
                color: currentTheme.colors.text
              }}
              onClick={handleShare}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Share2 className="h-3 w-3" />
            </motion.button>
          )}
          
          {achievement.progress !== undefined && !achievement.earnedAt && (
            <div 
              className="mt-1 w-full rounded-full h-1"
              style={{ backgroundColor: currentTheme.colors.secondary }}
            >
              <div 
                className="h-1 rounded-full transition-all duration-500"
                style={{ 
                  width: `${achievement.progress}%`,
                  backgroundColor: currentTheme.colors.primary
                }}
              />
            </div>
          )}
        </motion.div>
      </HoverCardTrigger>
      <HoverCardContent 
        side="top"
        className="w-80 p-4 shadow-lg backdrop-blur-sm border"
        style={{
          backgroundColor: currentTheme.colors.background,
          borderColor: currentTheme.colors.border
        }}
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 
              className="font-semibold text-sm"
              style={{ color: currentTheme.colors.text }}
            >
              {achievement.name}
            </h4>
            <Badge 
              variant="outline" 
              className="text-xs border-current"
              style={{ color: getTrophyColor() }}
            >
              {achievement.type}
            </Badge>
          </div>
          
          <p 
            className="text-sm"
            style={{ color: currentTheme.colors.accent }}
          >
            {achievement.description}
          </p>
          
          {achievement.earnedAt ? (
            <div 
              className="text-xs pt-2 border-t"
              style={{ 
                color: currentTheme.colors.accent,
                borderColor: currentTheme.colors.border
              }}
            >
              <span>Earned: {new Date(achievement.earnedAt).toLocaleDateString()}</span>
            </div>
          ) : achievement.progress !== undefined ? (
            <div 
              className="text-xs pt-2 border-t"
              style={{ 
                color: currentTheme.colors.accent,
                borderColor: currentTheme.colors.border
              }}
            >
              <span>Progress: {achievement.progress}%</span>
            </div>
          ) : null}
          
          <div 
            className="text-xs flex items-center gap-1"
            style={{ color: currentTheme.colors.accent }}
          >
            <Trophy className="h-3 w-3" style={{ color: getTrophyColor() }} />
            <span>{achievement.rarity} ({getRarityPercentage(achievement.rarity)})</span>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

const getRarityPercentage = (rarity: TrophyRarity) => {
  switch(rarity) {
    case TrophyRarity.COMMON: return "80% of players";
    case TrophyRarity.UNCOMMON: return "50% of players";
    case TrophyRarity.RARE: return "25% of players";
    case TrophyRarity.VERY_RARE: return "10% of players";
    case TrophyRarity.ULTRA_RARE: return "5% of players";
    default: return "";
  }
};

export default AchievementBadge;
