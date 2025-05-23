import { motion } from "framer-motion";
import { Scroll, Lock, Check, Star, AlertTriangle, Clock, Zap, Users } from "lucide-react";
import { Quest, QuestStatus } from "@/types/quest";
import { calculateQuestUrgency } from "@/utils/mapGenerationUtils";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

interface QuestNodeProps {
  quest: Quest;
  position: { x: number; y: number };
  isLocked: boolean;
  onClick: () => void;
  onHover?: () => void;
  onHoverEnd?: () => void;
  mapStyle: "parchment" | "woodland" | "dungeon" | "tavern";
}

interface NodeStyles {
  className: string;
  style: {
    backgroundColor: string;
    borderColor: string;
    boxShadow: string;
  };
}

const QuestNode = ({ 
  quest, 
  position, 
  isLocked, 
  onClick, 
  onHover, 
  onHoverEnd,
  mapStyle
}: QuestNodeProps) => {
  const { currentTheme } = useTheme();
  const isCompleted = quest.status === QuestStatus.COMPLETED;
  const isFailed = quest.status === QuestStatus.FAILED;
  const isInProgress = quest.status === QuestStatus.IN_PROGRESS;
  const urgencyLevel = calculateQuestUrgency(quest);
  
  // Get node size based on quest importance
  const getNodeSize = () => {
    const baseSize = 32; // Base size in pixels
    if (isLocked) return baseSize * 0.8;
    if (isCompleted) return baseSize * 0.9;
    if (isFailed) return baseSize * 0.85;
    return baseSize * (1 + urgencyLevel * 0.3);
  };
  
  // Get node elevation/shadow based on status
  const getNodeElevation = () => {
    if (isLocked) return 2;
    if (isCompleted) return 4;
    if (isFailed) return 1;
    if (isInProgress) return 6;
    return 5 + (urgencyLevel * 3);
  };
  
  // Get appropriate colors based on quest status and map style
  const getNodeStyles = (): NodeStyles => {
    // Base styles for all nodes
    const baseStyles = "rounded-full flex items-center justify-center cursor-pointer shadow-lg relative";
    
    // Color schemes based on map style
    const parchmentScheme = {
      locked: {
        background: currentTheme.colors.secondary,
        border: currentTheme.colors.border,
        shadow: `${currentTheme.colors.border}30`
      },
      completed: {
        background: "#ECFDF5",
        border: "#10B981",
        shadow: "#10B98130"
      },
      failed: {
        background: "#FEF2F2",
        border: "#EF4444",
        shadow: "#EF444430"
      },
      inProgress: {
        background: "#FFFBEB",
        border: currentTheme.colors.accent,
        shadow: `${currentTheme.colors.accent}30`
      },
      urgent: {
        background: "#FEF2F2",
        border: "#EF4444",
        shadow: "#EF444430"
      },
      available: {
        background: "#FFFBEB",
        border: currentTheme.colors.accent,
        shadow: `${currentTheme.colors.accent}30`
      }
    };
    
    const woodlandScheme = {
      locked: {
        background: currentTheme.colors.secondary,
        border: currentTheme.colors.border,
        shadow: `${currentTheme.colors.border}50`
      },
      completed: {
        background: "#064E3B",
        border: "#34D399",
        shadow: "#34D39950"
      },
      failed: {
        background: "#7F1D1D",
        border: "#F87171",
        shadow: "#F8717150"
      },
      inProgress: {
        background: "#1E40AF",
        border: currentTheme.colors.primary,
        shadow: `${currentTheme.colors.primary}50`
      },
      urgent: {
        background: "#92400E",
        border: currentTheme.colors.accent,
        shadow: `${currentTheme.colors.accent}50`
      },
      available: {
        background: "#134E4A",
        border: currentTheme.colors.primary,
        shadow: `${currentTheme.colors.primary}50`
      }
    };
    
    const dungeonScheme = {
      locked: {
        background: currentTheme.colors.secondary,
        border: currentTheme.colors.border,
        shadow: `${currentTheme.colors.border}50`
      },
      completed: {
        background: "#064E3B",
        border: "#059669",
        shadow: "#05966950"
      },
      failed: {
        background: "#7F1D1D",
        border: "#DC2626",
        shadow: "#DC262650"
      },
      inProgress: {
        background: "#92400E",
        border: currentTheme.colors.accent,
        shadow: `${currentTheme.colors.accent}50`
      },
      urgent: {
        background: "#7F1D1D",
        border: "#DC2626",
        shadow: "#DC262650"
      },
      available: {
        background: currentTheme.colors.secondary,
        border: currentTheme.colors.border,
        shadow: `${currentTheme.colors.border}50`
      }
    };
    
    const tavernScheme = {
      locked: {
        background: currentTheme.colors.secondary,
        border: currentTheme.colors.border,
        shadow: `${currentTheme.colors.border}50`
      },
      completed: {
        background: "#A7F3D0",
        border: "#059669",
        shadow: "#05966950"
      },
      failed: {
        background: "#FECACA",
        border: "#DC2626",
        shadow: "#DC262650"
      },
      inProgress: {
        background: "#FDE68A",
        border: currentTheme.colors.accent,
        shadow: `${currentTheme.colors.accent}50`
      },
      urgent: {
        background: "#FECACA",
        border: "#DC2626",
        shadow: "#DC262650"
      },
      available: {
        background: "#FEF3C7",
        border: currentTheme.colors.accent,
        shadow: `${currentTheme.colors.accent}50`
      }
    };
    
    // Select color scheme based on map style
    const scheme = mapStyle === "parchment" ? parchmentScheme :
                  mapStyle === "woodland" ? woodlandScheme :
                  mapStyle === "dungeon" ? dungeonScheme : 
                  tavernScheme;
    
    let status;
    if (isLocked) status = "locked";
    else if (isCompleted) status = "completed";
    else if (isFailed) status = "failed";
    else if (isInProgress) status = "inProgress";
    else if (urgencyLevel > 0.6) status = "urgent";
    else status = "available";
    
    const colors = scheme[status];
    
    return {
      className: baseStyles,
      style: {
        backgroundColor: colors.background,
        borderColor: colors.border,
        boxShadow: `0 4px 6px -1px ${colors.shadow}`
      }
    };
  };
  
  // Get appropriate text color based on map style
  const getTextColor = () => {
    if (mapStyle === "woodland" || mapStyle === "dungeon") {
      return currentTheme.colors.text;
    }
    return currentTheme.colors.text;
  };
  
  // Get appropriate icon based on quest status and type
  const getNodeIcon = () => {
    const iconClasses = "w-5 h-5 " + (mapStyle === "woodland" || mapStyle === "dungeon" ? "text-white" : "text-gray-900"); 
    
    if (isLocked) return <Lock className={iconClasses} />;
    if (isCompleted) return <Check className={iconClasses} />;
    if (isFailed) return <AlertTriangle className={iconClasses} />;
    if (isInProgress) return <Star className={iconClasses} />;
    if (urgencyLevel > 0.6) return <Clock className={iconClasses} />;
    if (quest.isGroupQuest) return <Users className={iconClasses} />;
    return <Scroll className={iconClasses} />;
  };
  
  // Determine if we should add decorative elements
  const shouldAddDecorations = () => {
    return !isLocked && mapStyle !== "dungeon";
  };
  
  // Render decorative elements around the node
  const renderDecorations = () => {
    if (!shouldAddDecorations()) return null;
    
    const decorElements = [];
    const nodeSize = getNodeSize();
    
    if (quest.isGroupQuest) {
      decorElements.push(
        <motion.div 
          key="group-banner"
          className="absolute -top-3 -right-1 -left-1 h-2.5 rounded-t-md"
          style={{ 
            backgroundColor: mapStyle === "parchment" ? "#92400e" :
                          mapStyle === "woodland" ? "#047857" :
                          "#92400e", // tavern
            opacity: 0.7
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3 }}
        />
      );
    }
    
    if (urgencyLevel > 0.6 && !isCompleted && !isFailed) {
      decorElements.push(
        <motion.div 
          key="urgency-pulse"
          className="absolute inset-0 rounded-full"
          style={{ 
            border: `2px solid ${mapStyle === "woodland" ? "#fbbf24" : "#ef4444"}`,
            opacity: 0.7
          }}
          animate={{ 
            scale: [1, 1.2, 1], 
            opacity: [0.7, 0.3, 0.7]
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity
          }}
        />
      );
    }
    
    // XP reward indicator
    decorElements.push(
      <motion.div
        key="xp-reward"
        className={`absolute -bottom-6 px-2 py-0.5 rounded-md ${getTextColor()} text-xs font-bold`}
        style={{ 
          backgroundColor: mapStyle === "parchment" ? "rgba(252, 211, 77, 0.8)" :
                        mapStyle === "woodland" ? "rgba(16, 185, 129, 0.5)" :
                        mapStyle === "dungeon" ? "rgba(87, 83, 78, 0.7)" :
                        "rgba(217, 119, 6, 0.7)", // tavern
          boxShadow: `0 2px 4px ${mapStyle === "dungeon" ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.2)"}`
        }}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {quest.xpReward} XP
      </motion.div>
    );
    
    return decorElements;
  };
  
  const nodeStyles = getNodeStyles();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute z-20"
      style={{ left: position.x, top: position.y }}
      onMouseEnter={onHover}
      onMouseLeave={onHoverEnd}
    >
      {/* Node with shadow effect */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={isLocked ? undefined : onClick}
        className={nodeStyles.className}
        style={{ 
          width: getNodeSize(), 
          height: getNodeSize(),
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Icon in the center */}
        {getNodeIcon()}
        
        {/* Quest ID or marker */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xs font-bold ${getTextColor()} opacity-50`}>
            {quest.id.slice(-2)}
          </span>
        </div>
        
        {/* Label underneath for important quests */}
        {(isInProgress || (urgencyLevel > 0.5 && !isLocked && !isCompleted && !isFailed)) && (
          <motion.div
            className={`absolute -bottom-5 whitespace-nowrap text-xs font-medium ${
              mapStyle === "woodland" || mapStyle === "dungeon" ? "text-gray-200" : "text-gray-800"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
          >
            {quest.title.length > 15 ? quest.title.substring(0, 15) + '...' : quest.title}
          </motion.div>
        )}
      </motion.div>
      
      {/* Decorative elements */}
      {renderDecorations()}
    </motion.div>
  );
};

export default QuestNode;
