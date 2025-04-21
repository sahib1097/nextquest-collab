
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Party, ChatMessage } from "@/types/social";
import { Quest } from "@/types/quest";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users, Send, X } from "lucide-react";

interface PartyChatProps {
  questId: string;
  isOpen: boolean;
  onClose: () => void;
}

const PartyChat = ({ questId, isOpen, onClose }: PartyChatProps) => {
  const [party, setParty] = useState<Party | null>(null);
  const [quest, setQuest] = useState<Quest | null>(null);
  const [message, setMessage] = useState("");
  const [currentUser, setCurrentUser] = useState({ id: "", username: "" });
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get current user info
    const userData = JSON.parse(localStorage.getItem("fluxUser") || '{"name":"User"}');
    const userLevel = JSON.parse(localStorage.getItem("fluxUserLevel") || '{}');
    
    setCurrentUser({
      id: userLevel.userId || "user-1",
      username: userData.name || "User"
    });
    
    // Find the party for this quest
    const storedParties = localStorage.getItem("fluxParties");
    if (storedParties) {
      const parties: Party[] = JSON.parse(storedParties);
      const partyForQuest = parties.find(p => p.questId === questId);
      
      if (partyForQuest) {
        setParty(partyForQuest);
      } else {
        // Create new party if not exists
        const quests = JSON.parse(localStorage.getItem("fluxQuests") || "[]");
        const thisQuest = quests.find((q: Quest) => q.id === questId);
        
        if (thisQuest && thisQuest.isGroupQuest && thisQuest.groupMembers) {
          const newParty: Party = {
            id: crypto.randomUUID(),
            name: `Party for ${thisQuest.title}`,
            members: Array.isArray(thisQuest.groupMembers) ? thisQuest.groupMembers : [],
            questId: questId,
            createdAt: new Date().toISOString(),
            chat: [
              {
                id: crypto.randomUUID(),
                userId: "system",
                username: "System",
                message: `Party created for the quest: ${thisQuest.title}`,
                timestamp: new Date().toISOString()
              }
            ]
          };
          
          const updatedParties = storedParties ? [...JSON.parse(storedParties), newParty] : [newParty];
          localStorage.setItem("fluxParties", JSON.stringify(updatedParties));
          setParty(newParty);
        }
      }
    } else {
      // Initialize parties if not exists
      const quests = JSON.parse(localStorage.getItem("fluxQuests") || "[]");
      const thisQuest = quests.find((q: Quest) => q.id === questId);
      
      if (thisQuest && thisQuest.isGroupQuest && thisQuest.groupMembers) {
        const newParty: Party = {
          id: crypto.randomUUID(),
          name: `Party for ${thisQuest.title}`,
          members: Array.isArray(thisQuest.groupMembers) ? thisQuest.groupMembers : [],
          questId: questId,
          createdAt: new Date().toISOString(),
          chat: [
            {
              id: crypto.randomUUID(),
              userId: "system",
              username: "System",
              message: `Party created for the quest: ${thisQuest.title}`,
              timestamp: new Date().toISOString()
            }
          ]
        };
        
        localStorage.setItem("fluxParties", JSON.stringify([newParty]));
        setParty(newParty);
      }
    }
    
    // Get quest details
    const storedQuests = localStorage.getItem("fluxQuests");
    if (storedQuests) {
      const quests = JSON.parse(storedQuests);
      const foundQuest = quests.find((q: Quest) => q.id === questId);
      if (foundQuest) {
        setQuest(foundQuest);
      }
    }
  }, [questId]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (chatBottomRef.current && party?.chat) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [party?.chat]);

  const sendMessage = () => {
    if (!message.trim() || !party) return;
    
    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      userId: currentUser.id,
      username: currentUser.username,
      message: message.trim(),
      timestamp: new Date().toISOString()
    };
    
    const updatedParty = {
      ...party,
      chat: [...party.chat, newMessage]
    };
    
    // Update in state
    setParty(updatedParty);
    setMessage("");
    
    // Save to localStorage
    const storedParties = localStorage.getItem("fluxParties");
    if (storedParties) {
      const parties: Party[] = JSON.parse(storedParties);
      const updatedParties = parties.map(p => p.id === party.id ? updatedParty : p);
      localStorage.setItem("fluxParties", JSON.stringify(updatedParties));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed right-0 bottom-0 w-80 h-[500px] bg-white rounded-tl-lg shadow-xl border border-gray-200 flex flex-col z-30"
        >
          <div className="p-3 border-b bg-purple-100 rounded-tl-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-700" />
              <h3 className="font-medium text-purple-800">
                {quest?.isGroupQuest ? "Party Chat" : "Quest Chat"}
              </h3>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="h-7 w-7"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {quest && (
            <div className="p-2 bg-purple-50 border-b text-xs text-purple-800">
              <span className="font-semibold">{quest.title}</span>
              <div className="mt-1 flex gap-1 flex-wrap">
                {party?.members.map((member, i) => (
                  <span key={i} className="bg-purple-100 px-1.5 py-0.5 rounded-full text-xs">
                    {member}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {party?.chat.map((msg) => (
              <div 
                key={msg.id}
                className={`flex items-start gap-2 ${msg.userId === currentUser.id ? 'justify-end' : ''}`}
              >
                {msg.userId !== currentUser.id && msg.userId !== "system" && (
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs bg-purple-200 text-purple-800">
                      {msg.username.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div 
                  className={`px-3 py-2 rounded-lg max-w-[80%] ${
                    msg.userId === "system" 
                      ? "bg-gray-100 text-gray-500 text-center text-xs w-full italic" 
                      : msg.userId === currentUser.id
                      ? "bg-purple-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {msg.userId !== "system" && msg.userId !== currentUser.id && (
                    <p className="text-xs font-medium text-gray-600 mb-1">{msg.username}</p>
                  )}
                  <p className="text-sm">{msg.message}</p>
                  <p className="text-xs opacity-70 mt-1 text-right">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                
                {msg.userId === currentUser.id && (
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs bg-purple-500 text-white">
                      {currentUser.username.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            <div ref={chatBottomRef} />
          </div>
          
          <div className="p-3 border-t bg-white">
            <div className="flex items-center gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button 
                onClick={sendMessage} 
                size="icon" 
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PartyChat;
