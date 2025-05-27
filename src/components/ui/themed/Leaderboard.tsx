import { useTheme } from "@/contexts/ThemeContext";
import { Trophy, Medal } from "lucide-react";

interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  avatar?: string;
  rank?: number;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  title?: string;
  className?: string;
}

const Leaderboard = ({ entries, title = "Leaderboard", className = "" }: LeaderboardProps) => {
  const { currentTheme } = useTheme();
  
  // Sort entries by score and add ranks
  const sortedEntries = [...entries]
    .sort((a, b) => b.score - a.score)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return null;
    }
  };

  return (
    <div 
      className={`rounded-lg shadow-sm ${className}`}
      style={{ 
        backgroundColor: currentTheme.colors.background,
        borderColor: currentTheme.colors.border
      }}
    >
      <div 
        className="px-4 py-3 border-b"
        style={{ borderColor: currentTheme.colors.border }}
      >
        <h3 
          className="text-lg font-semibold"
          style={{ color: currentTheme.colors.text }}
        >
          {title}
        </h3>
      </div>
      
      <div className="divide-y" style={{ borderColor: currentTheme.colors.border }}>
        {sortedEntries.map((entry) => (
          <div 
            key={entry.id}
            className="px-4 py-3 flex items-center gap-3 hover:bg-opacity-50 transition-colors"
            style={{ 
              backgroundColor: entry.rank === 1 ? `${currentTheme.colors.primary}20` : 'transparent',
              borderColor: currentTheme.colors.border
            }}
          >
            <div className="flex items-center justify-center w-8">
              {getRankIcon(entry.rank!) || (
                <span 
                  className="text-sm font-medium"
                  style={{ color: currentTheme.colors.accent }}
                >
                  {entry.rank}
                </span>
              )}
            </div>
            
            {entry.avatar ? (
              <img 
                src={entry.avatar} 
                alt={entry.name} 
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: currentTheme.colors.primary }}
              >
                {entry.name.charAt(0).toUpperCase()}
              </div>
            )}
            
            <div className="flex-1">
              <div 
                className="font-medium"
                style={{ color: currentTheme.colors.text }}
              >
                {entry.name}
              </div>
            </div>
            
            <div 
              className="font-semibold"
              style={{ color: currentTheme.colors.primary }}
            >
              {entry.score}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard; 