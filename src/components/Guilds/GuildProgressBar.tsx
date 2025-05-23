import React from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface GuildProgressBarProps {
  currentXp: number;
  maxXp?: number;
  level?: number;
  className?: string;
  showUnlocks?: boolean;
}

export const GuildProgressBar: React.FC<GuildProgressBarProps> = ({ 
  currentXp, 
  maxXp, 
  level, 
  className = "", 
  showUnlocks = true 
}) => {
  const { currentTheme } = useTheme();
  const isCyberpunkTheme = currentTheme.name === "Cyberpunk";
  const isMedievalTheme = currentTheme.name === "Medieval";

  // If maxXp is not provided but level is, calculate maxXp based on level
  const calculatedMaxXp = maxXp || (level ? level * 1000 : 1000);
  const progress = Math.min(Math.floor((currentXp / calculatedMaxXp) * 100), 100);

  const getProgressBarStyles = () => {
    if (isCyberpunkTheme) {
      return {
        background: "bg-[#261D54]",
        border: "border border-[#2DE2E6]",
        shadow: "shadow-[inset_0_0_10px_rgba(45,226,230,0.2)]",
        progressBar: "bg-gradient-to-r from-[#FF2E97] to-[#2DE2E6]",
        progressShadow: "shadow-[0_0_15px_rgba(45,226,230,0.3)]",
        text: "text-[#E0F2FF]"
      };
    }
    if (isMedievalTheme) {
      return {
        background: "bg-gray-200",
        border: "",
        shadow: "",
        progressBar: "bg-gradient-to-r from-yellow-500 to-amber-500",
        progressShadow: "",
        text: "text-gray-500"
      };
    }
    return {
      background: "bg-gray-200",
      border: "",
      shadow: "",
      progressBar: "bg-gradient-to-r from-yellow-500 to-amber-500",
      progressShadow: "",
      text: "text-gray-500"
    };
  };

  const styles = getProgressBarStyles();

  return (
    <div className={`w-full ${className}`}>
      <div className={`flex justify-between text-xs ${styles.text} mb-1`}>
        <span>{currentXp} XP</span>
        {level && showUnlocks && (
          <span className={isCyberpunkTheme ? "text-[#FF2E97]" : "text-amber-600"}>Level {level}</span>
        )}
        <span>{calculatedMaxXp} XP</span>
      </div>
      <div className={`w-full h-2 ${styles.background} ${styles.border} ${styles.shadow} rounded-full overflow-hidden`}>
        <div 
          className={`h-full ${styles.progressBar} ${styles.progressShadow} rounded-full transition-all duration-300`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
