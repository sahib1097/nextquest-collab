import { useEffect, useState } from "react";
import { Quest, QuestStatus } from "@/types/quest";
import QuestCard from "./QuestCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { motion, Reorder } from "framer-motion";
import { Scroll, Sparkles, Swords } from "lucide-react";
import MovableSidebar from "@/components/Dashboard/MovableSidebar";

interface QuestBoardProps {
  status: string;
  questType?: "individual" | "group";
}

const QuestBoard = ({ status, questType }: QuestBoardProps) => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [sidebarPosition, setSidebarPosition] = useState<"left" | "right" | "bottom">("left");

  useEffect(() => {
    // Load quests from localStorage
    const storedQuests = localStorage.getItem("fluxQuests");
    
    if (storedQuests) {
      const parsedQuests: Quest[] = JSON.parse(storedQuests);
      let filteredQuests = parsedQuests.filter(quest => quest.status === status);
      
      // Apply additional filtering if questType is provided
      if (questType === "group") {
        filteredQuests = filteredQuests.filter(quest => quest.isGroupQuest === true);
      } else if (questType === "individual") {
        filteredQuests = filteredQuests.filter(quest => !quest.isGroupQuest);
      }
      
      setQuests(filteredQuests);
    }
  }, [status, questType]);

  // Handle reordering
  const handleReorder = (reorderedQuests: Quest[]) => {
    setQuests(reorderedQuests);
    // Persist the new order to localStorage
    const storedQuests = localStorage.getItem("fluxQuests");
    if (storedQuests) {
      const allQuests = JSON.parse(storedQuests);
      const updatedQuests = allQuests.map((quest: Quest) => {
        const reorderedQuest = reorderedQuests.find(q => q.id === quest.id);
        return reorderedQuest || quest;
      });
      localStorage.setItem("fluxQuests", JSON.stringify(updatedQuests));
    }
  };

  // Enhanced animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        bounce: 0.4
      }
    }
  };

  // Quest board header based on status
  const getBoardHeader = () => {
    switch(status) {
      case "Available":
        return (
          <div className="flex items-center gap-2 mb-6 text-xl font-bold text-primary">
            <Scroll className="h-6 w-6" />
            <span>Available Quests</span>
          </div>
        );
      case "In Progress":
        return (
          <div className="flex items-center gap-2 mb-6 text-xl font-bold text-primary">
            <Swords className="h-6 w-6" />
            <span>Active Quests</span>
          </div>
        );
      case "Completed":
        return (
          <div className="flex items-center gap-2 mb-6 text-xl font-bold text-primary">
            <Sparkles className="h-6 w-6" />
            <span>Completed Quests</span>
          </div>
        );
      default:
        return null;
    }
  };

  const handlePositionChange = (newPosition: "left" | "right" | "bottom") => {
    setSidebarPosition(newPosition);
  };

  if (quests.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Alert className="bg-card border-2 border-border">
          <AlertDescription className="flex flex-col items-center py-8">
            <div className="text-lg mb-4">
              No {questType === "group" ? "group " : ""}quests {status.toLowerCase()} at the moment.
            </div>
            {status === "Available" && (
              <Button 
                variant="default"
                className="mt-2"
                onClick={() => document.getElementById("new-quest-dialog")?.click()}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Create New {questType === "group" ? "Group " : ""}Quest
              </Button>
            )}
          </AlertDescription>
        </Alert>
      </motion.div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      {sidebarPosition === "left" && (
        <MovableSidebar 
          position={sidebarPosition}
          onPositionChange={handlePositionChange}
        />
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div>
          {getBoardHeader()}
          <Reorder.Group 
            axis="y"
            values={quests} 
            onReorder={handleReorder}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {quests.map((quest) => (
              <Reorder.Item 
                key={quest.id} 
                value={quest}
                className="cursor-move"
              >
                <QuestCard quest={quest} />
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      </div>
    </div>
  );
};

export default QuestBoard;
