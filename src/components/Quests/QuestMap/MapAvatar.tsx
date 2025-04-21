
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Quest, QuestStatus } from "@/types/quest";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MapAvatarProps {
  quests: Quest[];
}

const MapAvatar = ({ quests }: MapAvatarProps) => {
  const [userData, setUserData] = useState<any>({});
  const [position, setPosition] = useState({ x: 400, y: 500 });
  const [targetPosition, setTargetPosition] = useState({ x: 400, y: 500 });
  const [currentQuestIndex, setCurrentQuestIndex] = useState<number | null>(null);
  const [path, setPath] = useState<Array<{x: number, y: number}>>([]);
  const [currentPathIndex, setCurrentPathIndex] = useState(0);
  
  // Get user data from localStorage
  useEffect(() => {
    const storedUserLevel = localStorage.getItem("fluxUserLevel");
    if (storedUserLevel) {
      setUserData(JSON.parse(storedUserLevel));
    }
  }, []);
  
  // Find the current quest (first in-progress quest)
  useEffect(() => {
    const inProgressQuestIndex = quests.findIndex(q => q.status === QuestStatus.IN_PROGRESS);
    if (inProgressQuestIndex !== -1) {
      setCurrentQuestIndex(inProgressQuestIndex);
      
      // Set target position based on the quest position
      const targetX = 350 + Math.floor(inProgressQuestIndex / 2) * 50;
      const targetY = 300 + (inProgressQuestIndex % 2) * 50;
      setTargetPosition({ x: targetX, y: targetY });
    } else {
      // If no in-progress quest, use the first available quest
      const availableQuestIndex = quests.findIndex(q => q.status === QuestStatus.AVAILABLE);
      if (availableQuestIndex !== -1) {
        setCurrentQuestIndex(availableQuestIndex);
        
        // Set target position based on the quest position
        const targetX = 350 + Math.floor(availableQuestIndex / 2) * 50;
        const targetY = 300 + (availableQuestIndex % 2) * 50;
        setTargetPosition({ x: targetX, y: targetY });
      }
    }
  }, [quests]);
  
  // Generate path between current position and target
  useEffect(() => {
    // Create a path with intermediate points
    const steps = 5; // Number of intermediate points
    const newPath = [];
    
    for (let i = 0; i <= steps; i++) {
      // Generate slightly random intermediate positions for a more natural path
      if (i === 0) {
        newPath.push({ ...position });
      } else if (i === steps) {
        newPath.push({ ...targetPosition });
      } else {
        const progress = i / steps;
        const randomOffset = 20 - Math.random() * 40; // Random offset between -20 and 20
        
        newPath.push({
          x: position.x + (targetPosition.x - position.x) * progress + randomOffset,
          y: position.y + (targetPosition.y - position.y) * progress + randomOffset
        });
      }
    }
    
    setPath(newPath);
    setCurrentPathIndex(0);
  }, [targetPosition]);
  
  // Move along the generated path
  useEffect(() => {
    if (path.length === 0 || currentPathIndex >= path.length - 1) return;
    
    const timer = setTimeout(() => {
      setPosition(path[currentPathIndex]);
      setCurrentPathIndex(prev => prev + 1);
    }, 500); // Move every 500ms
    
    return () => clearTimeout(timer);
  }, [path, currentPathIndex]);
  
  // Get active quest details
  const getActiveQuest = () => {
    if (currentQuestIndex === null) return null;
    return quests[currentQuestIndex];
  };
  
  // Render travel path
  const renderTravelPath = () => {
    if (path.length < 2) return null;
    
    return (
      <>
        {path.map((point, index) => {
          if (index === 0) return null;
          const prevPoint = path[index - 1];
          
          return (
            <motion.div
              key={`path-${index}`}
              className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-500/0"
              style={{
                width: Math.sqrt(
                  Math.pow(point.x - prevPoint.x, 2) + 
                  Math.pow(point.y - prevPoint.y, 2)
                ),
                transformOrigin: '0 0',
                transform: `translate(${prevPoint.x + 6}px, ${prevPoint.y + 6}px) 
                           rotate(${Math.atan2(
                             point.y - prevPoint.y, 
                             point.x - prevPoint.x
                           )}rad)`,
                opacity: index < currentPathIndex ? 0.2 : 0.6
              }}
              animate={{ opacity: index < currentPathIndex ? [0.6, 0] : 0.6 }}
              transition={{ duration: 1 }}
            />
          );
        })}
      </>
    );
  };

  if (!userData.username) return null;
  
  const activeQuest = getActiveQuest();
  
  return (
    <>
      {/* Render travel path */}
      {renderTravelPath()}
      
      <motion.div
        className="absolute z-30"
        style={{ left: position.x, top: position.y }}
        animate={{ 
          x: [0, -2, 2, -1, 0],
          y: [0, -1, 1, -2, 0],
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          repeatType: "loop"
        }}
      >
        {/* Avatar */}
        <div className="relative">
          <Avatar className="h-12 w-12 border-2 border-amber-500 shadow-lg shadow-amber-500/20">
            {userData.profilePicture ? (
              <AvatarImage src={userData.profilePicture} alt={userData.username} />
            ) : (
              <AvatarFallback className="bg-gradient-to-br from-amber-500 to-amber-600 text-white text-lg">
                {userData.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          
          {/* Level Badge */}
          <motion.div 
            className="absolute -bottom-1 -right-1 bg-cyan-600 rounded-full w-6 h-6 flex items-center justify-center border border-cyan-300"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-white text-xs font-bold">{userData.level}</span>
          </motion.div>
          
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-amber-500/30 blur-md -z-10"
            animate={{
              opacity: [0.3, 0.7, 0.3],
              scale: [0.8, 1.1, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop"
            }}
          />
          
          {/* Active quest indicator */}
          {activeQuest && (
            <motion.div 
              className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/70 text-xs px-2 py-0.5 rounded-sm border border-cyan-500/30"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <span className="text-cyan-400">
                {activeQuest.status === QuestStatus.IN_PROGRESS ? "Working on:" : "Next quest:"}
              </span>
              <div className="text-white truncate max-w-24">
                {activeQuest.title}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default MapAvatar;
