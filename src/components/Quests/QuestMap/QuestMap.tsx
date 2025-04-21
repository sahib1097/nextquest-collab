
import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { Quest, QuestStatus, QuestDifficulty } from "@/types/quest";
import { Map, Compass, Route, MoveHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface QuestMapProps {
  quests: Quest[];
}

const QuestMap = ({ quests }: QuestMapProps) => {
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [questFilter, setQuestFilter] = useState<string>("all");
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isGrabbing, setIsGrabbing] = useState(false);
  const [viewMode, setViewMode] = useState<"3d" | "flat">("3d");
  
  // Filter quests based on selected filter
  const filteredQuests = questFilter === "all" 
    ? quests 
    : quests.filter(q => {
        if (questFilter === "group") return q.isGroupQuest;
        if (questFilter === "individual") return !q.isGroupQuest;
        if (questFilter === "urgent") {
          const dueDate = new Date(q.dueDate);
          const now = new Date();
          const diffTime = dueDate.getTime() - now.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= 2 && q.status !== QuestStatus.COMPLETED;
        }
        return q.status === questFilter;
      });

  // Motion values for parallax effect
  const x = useMotionValue(0);
  const baseVelocity = -2;
  
  // Transform x motion to create parallax for different layers
  const backgroundX = useTransform(x, [0, -1000], [0, -300]);
  const midgroundX = useTransform(x, [0, -1000], [0, -600]);
  const foregroundX = useTransform(x, [0, -1000], [0, -900]);
  
  // Spring physics for smooth scrolling
  const springX = useSpring(x, { damping: 20, stiffness: 100 });

  // Get quest status color
  const getQuestStatusColor = (status: QuestStatus) => {
    switch (status) {
      case QuestStatus.AVAILABLE:
        return "bg-gradient-to-br from-amber-400 to-amber-600 border-amber-300";
      case QuestStatus.IN_PROGRESS:
        return "bg-gradient-to-br from-blue-400 to-blue-600 border-blue-300";
      case QuestStatus.COMPLETED:
        return "bg-gradient-to-br from-green-400 to-green-600 border-green-300";
      case QuestStatus.FAILED:
        return "bg-gradient-to-br from-red-400 to-red-600 border-red-300";
      default:
        return "bg-gradient-to-br from-gray-400 to-gray-600 border-gray-300";
    }
  };

  // Get quest difficulty visual elements
  const getQuestDifficultyMarkers = (difficulty: QuestDifficulty) => {
    switch (difficulty) {
      case QuestDifficulty.SIMPLE:
        return <div className="flex gap-0.5"><div className="w-2 h-2 bg-white rounded-full"></div></div>;
      case QuestDifficulty.MODERATE:
        return (
          <div className="flex gap-0.5">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        );
      case QuestDifficulty.DIFFICULT:
        return (
          <div className="flex gap-0.5">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        );
    }
  };
  
  // Handle mouse/touch drag for scrolling
  const onDragStart = () => {
    setIsGrabbing(true);
  };
  
  const onDragEnd = () => {
    setIsGrabbing(false);
  };

  // Auto-scroll to active quest
  useEffect(() => {
    if (activeQuest && scrollRef.current) {
      const questIndex = quests.findIndex(q => q.id === activeQuest.id);
      const scrollPosition = -(questIndex * 320); // 320px per card + gap
      x.set(scrollPosition);
    }
  }, [activeQuest, quests]);

  return (
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden border border-[#E5E5EA] shadow-sm" ref={containerRef}>
      {/* Sky background with parallax */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-sky-400 to-sky-600"
        style={{ x: backgroundX }}
      >
        {/* Decorative clouds */}
        <div className="absolute top-[10%] left-[10%] w-24 h-12 bg-white opacity-80 rounded-full blur-md"></div>
        <div className="absolute top-[15%] left-[60%] w-32 h-16 bg-white opacity-70 rounded-full blur-md"></div>
        <div className="absolute top-[25%] left-[30%] w-20 h-10 bg-white opacity-60 rounded-full blur-md"></div>
      </motion.div>
      
      {/* Mid-layer mountains with parallax */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-[50%]"
        style={{ x: midgroundX }}
      >
        {/* Mountain shapes */}
        <div className="absolute bottom-0 left-[5%] w-[30%] h-[90%] bg-indigo-900 opacity-70 rounded-t-[100%]"></div>
        <div className="absolute bottom-0 left-[25%] w-[25%] h-[70%] bg-indigo-800 opacity-70 rounded-t-[100%]"></div>
        <div className="absolute bottom-0 left-[45%] w-[35%] h-[100%] bg-indigo-900 opacity-70 rounded-t-[100%]"></div>
        <div className="absolute bottom-0 left-[70%] w-[30%] h-[80%] bg-indigo-800 opacity-70 rounded-t-[100%]"></div>
        
        {/* Path connecting quests */}
        <svg className="absolute bottom-[22%] left-0 w-full h-[5px]" style={{ overflow: 'visible' }}>
          <motion.path 
            d={`M0,2.5 ${filteredQuests.map((_, i) => `L${i * 320 + 160},2.5`).join(' ')}`}
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeDasharray="10,10"
            fill="none"
            style={{ x: foregroundX }}
          />
        </svg>
      </motion.div>

      {/* Control panel */}
      <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between">
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm p-2 rounded-md">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 bg-black/40 border-white/50 text-white"
            onClick={() => setQuestFilter("all")}
          >
            <Map className="h-4 w-4" />
            All
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={cn("flex items-center gap-1 bg-black/40 border-white/50 text-white", 
              viewMode === "3d" ? "bg-white/20" : "")}
            onClick={() => setViewMode("3d")}
          >
            <Route className="h-4 w-4" />
            3D
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={cn("flex items-center gap-1 bg-black/40 border-white/50 text-white", 
              viewMode === "flat" ? "bg-white/20" : "")}
            onClick={() => setViewMode("flat")}
          >
            <MoveHorizontal className="h-4 w-4" />
            Flat
          </Button>
        </div>
        
        <div className="bg-black/40 backdrop-blur-sm p-2 rounded-md">
          <Compass className="h-5 w-5 text-white/80" />
        </div>
      </div>

      {/* Quest detail popup */}
      <AnimatePresence>
        {activeQuest && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute left-4 bottom-4 right-4 z-40 bg-white/90 backdrop-blur-sm p-4 rounded-lg border border-[#E5E5EA] shadow-lg"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-[#1D1D1F]">{activeQuest.title}</h3>
                <p className="text-sm text-[#86868B] mt-1">{activeQuest.description}</p>
                
                <div className="flex gap-4 mt-3">
                  <div>
                    <span className="text-xs text-[#86868B]">Reward</span>
                    <p className="font-medium text-[#1D1D1F]">{activeQuest.xpReward} XP</p>
                  </div>
                  <div>
                    <span className="text-xs text-[#86868B]">Due</span>
                    <p className="font-medium text-[#1D1D1F]">
                      {new Date(activeQuest.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-[#86868B]">Status</span>
                    <p className="font-medium text-[#1D1D1F]">{activeQuest.status}</p>
                  </div>
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setActiveQuest(null)}
              >
                Close
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Quest path - scrollable horizontal row */}
      <motion.div
        ref={scrollRef}
        className={cn(
          "absolute bottom-[5%] left-0 flex items-center gap-4 px-[15%] pt-4 pb-8",
          isGrabbing ? "cursor-grabbing" : "cursor-grab"
        )}
        style={{ x: foregroundX }}
        drag="x"
        dragConstraints={{ left: -((filteredQuests.length - 1) * 320), right: 0 }}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        {filteredQuests.map((quest, index) => (
          <motion.div
            key={quest.id}
            className={cn(
              "relative",
              viewMode === "3d" ? "quest-card-3d" : ""
            )}
            whileHover={{ 
              scale: 1.05, 
              y: -10,
              transition: { duration: 0.2 }
            }}
            onClick={() => setActiveQuest(quest)}
          >
            <Card className={cn(
              "w-[280px] h-[180px] p-1 border-2 shadow-xl overflow-hidden",
              getQuestStatusColor(quest.status),
              viewMode === "3d" ? "transform-style-3d" : ""
            )}>
              <CardContent className="p-4 h-full flex flex-col justify-between bg-white/90 backdrop-blur-md rounded-lg">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-[#1D1D1F] line-clamp-1">{quest.title}</h3>
                    <div className="mt-0.5">
                      {getQuestDifficultyMarkers(quest.difficulty)}
                    </div>
                  </div>
                  <p className="text-xs text-[#86868B] line-clamp-2">{quest.description}</p>
                </div>
                
                <div>
                  {quest.isGroupQuest && (
                    <div className="flex -space-x-2 mb-2">
                      {Array.from({ length: Math.min(quest.groupMembers?.length || 0, 3) }).map((_, i) => (
                        <div 
                          key={i}
                          className="w-6 h-6 rounded-full bg-gray-200 border border-white flex items-center justify-center text-[10px]"
                        >
                          {quest.groupMembers?.[i]?.charAt(0) || 'U'}
                        </div>
                      ))}
                      {(quest.groupMembers?.length || 0) > 3 && (
                        <div className="w-6 h-6 rounded-full bg-gray-200 border border-white flex items-center justify-center text-[10px]">
                          +{quest.groupMembers!.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium bg-[#F5F5F7] px-2 py-1 rounded-full">
                      {quest.xpReward} XP
                    </span>
                    <span className="text-xs text-[#86868B]">
                      Due: {new Date(quest.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
              
              {/* 3D elements */}
              {viewMode === "3d" && (
                <>
                  <div className="absolute left-0 right-0 bottom-0 h-[8px] bg-black/20 transform-3d translate-z-neg-5 rotate-x-90 origin-bottom"></div>
                  <div className="absolute right-0 top-0 bottom-0 w-[8px] bg-black/10 transform-3d translate-z-neg-5 rotate-y-90 origin-right"></div>
                </>
              )}
            </Card>
            
            {/* Quest marker on path */}
            <div className={cn(
              "absolute left-1/2 -bottom-4 w-4 h-4 rounded-full border-2 border-white -translate-x-1/2 shadow-md",
              quest.status === QuestStatus.AVAILABLE ? "bg-amber-500" :
              quest.status === QuestStatus.IN_PROGRESS ? "bg-blue-500" :
              quest.status === QuestStatus.COMPLETED ? "bg-green-500" : "bg-red-500"
            )}></div>
          </motion.div>
        ))}
        
        {filteredQuests.length === 0 && (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 mb-4 rounded-full bg-gray-200 flex items-center justify-center">
              <Map className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-[#1D1D1F]">No quests found</h3>
            <p className="text-sm text-[#86868B] mt-1">Try changing your filter or create a new quest</p>
          </div>
        )}
      </motion.div>
      
      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/40 text-white text-xs py-1 px-3 rounded-full backdrop-blur-sm">
        Drag to scroll through quests
      </div>
    </div>
  );
};

export default QuestMap;
