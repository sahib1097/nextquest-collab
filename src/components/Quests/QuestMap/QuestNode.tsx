
import { motion } from "framer-motion";
import { Scroll, Lock, Check, Star, AlertTriangle, Clock, Zap, Users } from "lucide-react";
import { Quest, QuestStatus } from "@/types/quest";
import { calculateQuestUrgency } from "@/utils/mapGenerationUtils";
import { cn } from "@/lib/utils";

interface QuestNodeProps {
  quest: Quest;
  position: { x: number; y: number };
  isLocked: boolean;
  onClick: () => void;
  onHover?: () => void;
  onHoverEnd?: () => void;
  mapStyle: "parchment" | "woodland" | "dungeon" | "tavern";
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
  const getNodeStyles = () => {
    // Base styles for all nodes
    const baseStyles = "rounded-full flex items-center justify-center cursor-pointer shadow-lg relative";
    
    // Color schemes based on map style
    const parchmentScheme = {
      locked: "bg-stone-300 border-2 border-stone-400 shadow-stone-500/30",
      completed: "bg-emerald-100 border-2 border-emerald-700 shadow-emerald-700/30",
      failed: "bg-red-100 border-2 border-red-800 shadow-red-800/30",
      inProgress: "bg-amber-100 border-2 border-amber-700 shadow-amber-700/30",
      urgent: "bg-red-100 border-2 border-red-800 shadow-red-800/30",
      available: "bg-amber-50 border-2 border-amber-800 shadow-amber-800/30"
    };
    
    const woodlandScheme = {
      locked: "bg-slate-700 border-2 border-slate-500 shadow-slate-900/50",
      completed: "bg-emerald-700 border-2 border-emerald-400 shadow-emerald-400/50",
      failed: "bg-red-900 border-2 border-red-600 shadow-red-600/50",
      inProgress: "bg-blue-800 border-2 border-blue-500 shadow-blue-500/50",
      urgent: "bg-amber-800 border-2 border-amber-500 shadow-amber-500/50",
      available: "bg-teal-800 border-2 border-teal-400 shadow-teal-400/50"
    };
    
    const dungeonScheme = {
      locked: "bg-stone-700 border-2 border-stone-500 shadow-stone-800/50",
      completed: "bg-emerald-900 border-2 border-emerald-600 shadow-emerald-600/50",
      failed: "bg-red-900 border-2 border-red-600 shadow-red-600/50",
      inProgress: "bg-amber-800 border-2 border-amber-600 shadow-amber-600/50",
      urgent: "bg-red-800 border-2 border-red-500 shadow-red-500/50",
      available: "bg-stone-800 border-2 border-stone-400 shadow-stone-600/50"
    };
    
    const tavernScheme = {
      locked: "bg-stone-400 border-2 border-stone-600 shadow-stone-700/50",
      completed: "bg-emerald-300 border-2 border-emerald-700 shadow-emerald-700/50",
      failed: "bg-red-300 border-2 border-red-800 shadow-red-800/50",
      inProgress: "bg-amber-300 border-2 border-amber-700 shadow-amber-700/50",
      urgent: "bg-red-300 border-2 border-red-700 shadow-red-700/50",
      available: "bg-amber-200 border-2 border-amber-800 shadow-amber-800/50"
    };
    
    // Select color scheme based on map style
    const scheme = mapStyle === "parchment" ? parchmentScheme :
                  mapStyle === "woodland" ? woodlandScheme :
                  mapStyle === "dungeon" ? dungeonScheme : 
                  tavernScheme;
    
    if (isLocked) {
      return cn(baseStyles, scheme.locked);
    }
    
    if (isCompleted) {
      return cn(baseStyles, scheme.completed);
    }
    
    if (isFailed) {
      return cn(baseStyles, scheme.failed);
    }
    
    if (isInProgress) {
      return cn(baseStyles, scheme.inProgress);
    }
    
    // Default "available" state with urgency influence
    if (urgencyLevel > 0.6) {
      return cn(baseStyles, scheme.urgent);
    }
    
    return cn(baseStyles, scheme.available);
  };
  
  // Get appropriate text color based on map style
  const getTextColor = () => {
    if (mapStyle === "woodland" || mapStyle === "dungeon") {
      return "text-white";
    }
    return "text-gray-900";
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
        className={getNodeStyles()}
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
