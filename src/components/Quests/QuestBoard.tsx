import { useEffect, useState } from "react";
import { Quest, QuestStatus } from "@/types/quest";
import QuestCard from "./QuestCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { motion, Reorder } from "framer-motion";
import { Scroll, Sparkles, Swords } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface QuestBoardProps {
  status: string;
  questType?: "individual" | "group";
}

const QuestBoard = ({ status, questType }: QuestBoardProps) => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const { currentTheme } = useTheme();

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
    let medievalSpanClass = "";
    let medievalBg = "";
    let medievalBorder = "";
    let Icon = null;
    const isCyberpunkTheme = currentTheme.name === "Cyberpunk";

    if (currentTheme.name === "Medieval") {
      switch (status) {
        case "Available":
          medievalBg = "bg-amber-600";
          medievalBorder = "border-amber-900";
          Icon = <Scroll className="h-6 w-6 inline-block mr-2" />;
          break;
        case "In Progress":
          medievalBg = "bg-blue-600";
          medievalBorder = "border-blue-900";
          Icon = <Swords className="h-6 w-6 inline-block mr-2" />;
          break;
        case "Completed":
          medievalBg = "bg-emerald-600";
          medievalBorder = "border-emerald-900";
          Icon = <Sparkles className="h-6 w-6 inline-block mr-2" />;
          break;
        default:
          medievalBg = "";
          medievalBorder = "";
      }
      medievalSpanClass = `px-4 py-2 ${medievalBg} text-[#ffe8a3] font-extrabold text-2xl tracking-wide border-4 ${medievalBorder} rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] uppercase flex items-center`;
    }

    const getCyberpunkHeader = (icon: React.ReactNode, title: string) => {
      if (!isCyberpunkTheme) return null;
      
      return (
        <div className="flex items-center gap-3 mb-6">
          <div className="text-[#2DE2E6]">{icon}</div>
          <h2 className="font-mono font-bold text-2xl tracking-wider uppercase text-[#2DE2E6]">
            {title}
          </h2>
        </div>
      );
    };

    switch(status) {
      case "Available":
        return currentTheme.name === "Medieval" ? (
          <span className={medievalSpanClass}>{Icon}Available Quests</span>
        ) : isCyberpunkTheme ? (
          getCyberpunkHeader(<Scroll className="h-6 w-6" />, "Available Quests")
        ) : (
          <div className="flex items-center gap-2 mb-6 text-xl font-bold text-amber-600">
            <Scroll className="h-6 w-6" />
            <span>Available Quests</span>
          </div>
        );
      case "In Progress":
        return currentTheme.name === "Medieval" ? (
          <span className={medievalSpanClass}>{Icon}Active Quests</span>
        ) : isCyberpunkTheme ? (
          getCyberpunkHeader(<Swords className="h-6 w-6" />, "Active Quests")
        ) : (
          <div className="flex items-center gap-2 mb-6 text-xl font-bold text-blue-600">
            <Swords className="h-6 w-6" />
            <span>Active Quests</span>
          </div>
        );
      case "Completed":
        return currentTheme.name === "Medieval" ? (
          <span className={medievalSpanClass}>{Icon}Completed Quests</span>
        ) : isCyberpunkTheme ? (
          getCyberpunkHeader(<Sparkles className="h-6 w-6" />, "Completed Quests")
        ) : (
          <div className="flex items-center gap-2 mb-6 text-xl font-bold text-emerald-600">
            <Sparkles className="h-6 w-6" />
            <span>Completed Quests</span>
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
