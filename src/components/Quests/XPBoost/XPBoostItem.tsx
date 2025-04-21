
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XPBoost, XPBoostType } from "@/types/boost";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Star } from "lucide-react";

interface XPBoostItemProps {
  onCollect: (boost: XPBoost) => void;
}

const XPBoostItem = ({ onCollect }: XPBoostItemProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showBoost = () => {
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 10000);
    };

    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        showBoost();
      }
    }, Math.random() * (120000 - 30000) + 30000);

    return () => clearInterval(interval);
  }, []);

  const handleCollect = () => {
    const boostTypes = [
      { type: XPBoostType.STANDARD, multiplier: 1.5, color: "#D6BCFA" },
      { type: XPBoostType.PREMIUM, multiplier: 2, color: "#9B87F5" },
      { type: XPBoostType.ULTRA, multiplier: 3, color: "#8B5CF6" }
    ];

    const randomBoost = boostTypes[Math.floor(Math.random() * boostTypes.length)];
    
    const boost: XPBoost = {
      id: crypto.randomUUID(),
      multiplier: randomBoost.multiplier,
      duration: 300000,
      expiresAt: new Date(Date.now() + 300000).toISOString(),
      type: randomBoost.type,
      isActive: true
    };

    onCollect(boost);
    setIsVisible(false);
    
    toast.success(
      <div className="flex flex-col items-center gap-2">
        <span className="text-lg font-bold">XP Boost Collected! 🎉</span>
        <div className="flex items-center gap-1">
          <span className="text-purple-500 font-semibold">{randomBoost.multiplier}x</span>
          <span>multiplier for 5 minutes</span>
        </div>
      </div>,
      {
        duration: 5000,
      }
    );
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                initial={{ scale: 0, rotate: 0 }}
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, -5, 5, -5, 0]
                }}
                exit={{ 
                  scale: 0,
                  rotate: 0,
                  transition: { 
                    duration: 0.3,
                    ease: "backIn"
                  }
                }}
                transition={{
                  duration: 2, // Slower flash animation
                  scale: {
                    repeat: Infinity,
                    repeatType: "reverse"
                  }
                }}
                className="fixed bottom-20 right-10 cursor-pointer"
                onClick={handleCollect}
                whileHover={{ scale: 1.2 }}
                whileTap={{ 
                  scale: 0.8,
                  transition: { type: "spring", stiffness: 400 }
                }}
              >
                <div className="relative">
                  {/* XP Icon with shine effect */}
                  <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 shadow-lg">
                    <Star className="h-8 w-8 text-white" />
                    <span className="absolute text-white font-bold text-sm">XP</span>
                    
                    {/* Shine effect */}
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: "linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.8) 45%, transparent 50%)",
                        backgroundSize: "200% 200%",
                      }}
                      animate={{
                        backgroundPosition: ["200% 200%", "-100% -100%"],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </div>
                  
                  {/* Glow effect */}
                  <motion.div
                    className="absolute -inset-4 rounded-full bg-purple-500/30 blur-md -z-10"
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">Click to collect XP Boost!</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </AnimatePresence>
  );
};

export default XPBoostItem;
