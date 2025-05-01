import { useEffect, useState } from "react";
import { Quest, QuestStatus } from "@/types/quest";
import QuestCard from "./QuestCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { motion, Reorder } from "framer-motion";
import { Scroll, Sparkles, Swords } from "lucide-react";

interface QuestBoardProps {
  status: string;
  questType?: "individual" | "group";
}

const QuestBoard = ({ status, questType }: QuestBoardProps) => {
  const [quests, setQuests] = useState<Quest[]>([]);

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
          <div className="flex mb-6 text-xl font-bold text-amber-600">
            <span className="flex items-center gap-2 px-4 py-2 bg-[#ff7e00] text-[#ffe8a3] font-extrabold text-3xl tracking-wide border-4 border-[#c76200] rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] uppercase">
              <Scroll className="h-6 w-6" />
              Available Quests
            </span>
          </div>
        );
      case "In Progress":
        return (
          <div className="flex items-center gap-2 mb-6 text-xl font-bold text-blue-600">
            <span className="flex items-center gap-2 px-4 py-2 bg-[#3961f9] text-[#ffe8a3] font-extrabold text-3xl tracking-wide border-4 border-[#2546c4] rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] uppercase">
              <Swords className="h-6 w-6" />
              Active Quests
            </span>
          </div>
        );
      case "Completed":
        return (
          <div className="flex items-center gap-2 mb-6 text-xl font-bold text-emerald-600">
            <span className="flex items-center gap-2 px-4 py-2 bg-[#20966b] text-[#ffe8a3] font-extrabold text-3xl tracking-wide border-4 border-[#155e44] rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] uppercase">
              <Sparkles className="h-6 w-6" />
              Completed Quests
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  if (quests.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Alert className="bg-gradient-to-r from-slate-50 to-slate-100 border-2 border-slate-200">
          <AlertDescription className="flex flex-col items-center py-8">
            <div className="text-lg mb-4">
              No {questType === "group" ? "group " : ""}quests {status.toLowerCase()} at the moment.
            </div>
            {status === "Available" && (
              <Button 
                className="mt-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
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
  );
};

export default QuestBoard;
