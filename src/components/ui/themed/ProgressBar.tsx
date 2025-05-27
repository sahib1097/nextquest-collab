import { useTheme } from "@/contexts/ThemeContext";

interface ProgressBarProps {
  progress: number;
  showPercentage?: boolean;
  height?: string;
  className?: string;
}

const ProgressBar = ({ 
  progress, 
  showPercentage = false, 
  height = "h-2",
  className = ""
}: ProgressBarProps) => {
  const { currentTheme } = useTheme();
  
  // Ensure progress is between 0 and 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  
  return (
    <div className={`relative ${className}`}>
      <div 
        className={`w-full ${height} ${currentTheme.colors.secondary} rounded-full overflow-hidden`}
        style={{ backgroundColor: currentTheme.colors.secondary }}
      >
        <div 
          className={`h-full transition-all duration-300 ease-in-out rounded-full`}
          style={{ 
            width: `${clampedProgress}%`,
            backgroundColor: currentTheme.colors.primary
          }}
        />
      </div>
      {showPercentage && (
        <span 
          className="absolute right-0 top-0 text-xs"
          style={{ color: currentTheme.colors.text }}
        >
          {Math.round(clampedProgress)}%
        </span>
      )}
    </div>
  );
};

export default ProgressBar; 