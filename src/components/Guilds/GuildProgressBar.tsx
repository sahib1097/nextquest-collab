
import React from "react";

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
  // If maxXp is not provided but level is, calculate maxXp based on level
  const calculatedMaxXp = maxXp || (level ? level * 1000 : 1000);
  const progress = Math.min(Math.floor((currentXp / calculatedMaxXp) * 100), 100);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{currentXp} XP</span>
        {level && showUnlocks && (
          <span className="text-amber-600">Level {level}</span>
        )}
        <span>{calculatedMaxXp} XP</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
