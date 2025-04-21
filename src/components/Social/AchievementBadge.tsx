import { useState } from "react";
import { motion } from "framer-motion";
import { Achievement, TrophyRarity } from "@/types/social";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Award, Share2, Trophy, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface AchievementBadgeProps {
  achievement: Achievement;
  animate?: boolean;
  size?: "sm" | "md" | "lg";
}

const AchievementBadge = ({ achievement, animate = false, size = "md" }: AchievementBadgeProps) => {
  const [isSharing, setIsSharing] = useState(false);

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
      return "text-gray-400";
    }
    switch (achievement.type) {
      case "Bronze": return "text-amber-600";
      case "Silver": return "text-slate-400";
      case "Gold": return "text-yellow-500";
      case "Platinum": return "text-blue-500";
      default: return "text-purple-500";
    }
  };

  const getBadgeStyle = () => {
    if (achievement.hidden && !achievement.earnedAt) {
      return "bg-gray-100 text-gray-500 hover:bg-gray-200 border-gray-200";
    }

    switch (achievement.type) {
      case "Bronze":
        return "bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 hover:from-amber-200 hover:to-amber-300 border-amber-300";
      case "Silver":
        return "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 hover:from-slate-200 hover:to-slate-300 border-slate-300";
      case "Gold":
        return "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 hover:from-yellow-200 hover:to-yellow-300 border-yellow-300";
      case "Platinum":
        return "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 hover:from-blue-200 hover:to-blue-300 border-blue-300";
      default:
        return "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 hover:from-purple-200 hover:to-purple-300 border-purple-300";
    }
  };

  const getRarityDot = () => {
    if (!achievement.earnedAt) return null;

    const dotColor = () => {
      switch(achievement.rarity) {
        case TrophyRarity.COMMON: return "bg-gray-400";
        case TrophyRarity.UNCOMMON: return "bg-green-500";
        case TrophyRarity.RARE: return "bg-blue-500"; 
        case TrophyRarity.VERY_RARE: return "bg-purple-500";
        case TrophyRarity.ULTRA_RARE: return "bg-yellow-500";
        default: return "bg-gray-400";
      }
    };

    return (
      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
        <div className={`${dotColor()} h-1.5 w-1.5 rounded-full shadow-sm`}></div>
      </div>
    );
  };

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
            className={`flex items-center gap-1.5 ${getBadgeSize()} ${getBadgeStyle()} relative shadow-sm transition-all duration-300`}
          >
            {achievement.hidden && !achievement.earnedAt ? (
              <Lock className={`${size === "sm" ? "h-3 w-3" : "h-4 w-4"} ${getTrophyColor()}`} />
            ) : (
              <Trophy className={`${size === "sm" ? "h-3 w-3" : "h-4 w-4"} ${getTrophyColor()}`} />
            )}
            <span className="font-medium">
              {achievement.hidden && !achievement.earnedAt ? "???" : achievement.name}
            </span>
            {getRarityDot()}
          </Badge>
          
          {achievement.earnedAt && (
            <motion.button
              className="absolute -top-1 -right-1 bg-white text-gray-600 rounded-full p-0.5 shadow-sm hover:text-purple-600"
              onClick={handleShare}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Share2 className="h-3 w-3" />
            </motion.button>
          )}
          
          {achievement.progress !== undefined && !achievement.earnedAt && (
            <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
              <div 
                className="bg-purple-600 h-1 rounded-full transition-all duration-500"
                style={{ width: `${achievement.progress}%` }}
              />
            </div>
          )}
        </motion.div>
      </HoverCardTrigger>
      <HoverCardContent 
        side="top"
        className="w-80 p-4 shadow-lg backdrop-blur-sm bg-white/95 border border-gray-200"
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">{achievement.name}</h4>
            <Badge 
              variant="outline" 
              className={`text-xs ${getTrophyColor()} border-current`}
            >
              {achievement.type}
            </Badge>
          </div>
          
          <p className="text-sm text-gray-600">{achievement.description}</p>
          
          {achievement.earnedAt ? (
            <div className="text-xs text-gray-500 pt-2 border-t">
              <span>Earned: {new Date(achievement.earnedAt).toLocaleDateString()}</span>
            </div>
          ) : achievement.progress !== undefined ? (
            <div className="text-xs text-gray-500 pt-2 border-t">
              <span>Progress: {achievement.progress}%</span>
            </div>
          ) : null}
          
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <Trophy className="h-3 w-3" />
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
