import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XPBoost, XPBoostType } from "@/types/boost";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "@/contexts/ThemeContext";
import { Star } from "lucide-react";

interface XPBoostItemProps {
  onCollect: (boost: XPBoost) => void;
}

const XPBoostItem = ({ onCollect }: XPBoostItemProps) => {
  const { currentTheme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const collectSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio
    try {
      collectSound.current = new Audio("/assets/themes/cyberpunk/audio/CollectItem.mp3");
      collectSound.current.load();
    } catch (error) {
      console.error("Failed to load audio:", error);
    }
  }, []);

  useEffect(() => {
    const showBoost = () => {
      if (!isVisible) {
        setIsVisible(true);
        timeoutRef.current = setTimeout(() => {
          setIsVisible(false);
        }, 30000); // 30 seconds
      }
    };

    const startInterval = () => {
      const intervalDuration = Math.random() * (70000 - 30000) + 10000;
      intervalRef.current = setTimeout(() => {
        if (Math.random() < 0.3) {
          showBoost();
        }
        startInterval();
      }, intervalDuration);
    };

    startInterval();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [isVisible]);

  const handleCollect = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const boostTypes = [
      { type: XPBoostType.STANDARD, multiplier: 1.5, color: "#00ff9d" },
      { type: XPBoostType.PREMIUM, multiplier: 2, color: "#ff00ff" },
      { type: XPBoostType.ULTRA, multiplier: 3, color: "#00ffff" }
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
    setIsAnimating(false);

    if (collectSound.current) {
      try {
        collectSound.current.currentTime = 0;
        const playPromise = collectSound.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Failed to play audio:", error);
          });
        }
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    }

    toast.success(
      <div className="flex flex-col items-center gap-2">
        <span className="text-lg font-bold text-cyan-400">XP BOOST ACQUIRED! ⚡</span>
        <div className="flex items-center gap-1">
          <span className="text-pink-500 font-semibold">{randomBoost.multiplier}x</span>
          <span className="text-cyan-400">multiplier for 5 minutes</span>
        </div>
      </div>,
      { duration: 5000 }
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
                  duration: 2,
                  scale: {
                    repeat: Infinity,
                    repeatType: "reverse"
                  }
                }}
                className="fixed bottom-20 right-10 cursor-pointer z-[9999]"
                onClick={handleCollect}
                whileHover={{ scale: 1.2 }}
                whileTap={{ 
                  scale: 0.8,
                  transition: { type: "spring", stiffness: 400 }
                }}
              >
                <div className="relative">
                  <div className="relative flex items-center justify-center w-16 h-16 rounded-lg bg-black border-2 border-cyan-500 shadow-[0_0_15px_rgba(0,255,255,0.5)]">
                    <Star className="h-8 w-8 text-cyan-400" />
                    <span className="absolute text-cyan-400 font-bold text-sm tracking-wider">XP</span>
                    
                    <motion.div
                      className="absolute inset-0 rounded-lg"
                      style={{
                        background: "linear-gradient(45deg, transparent 40%, rgba(0,255,255,0.3) 45%, transparent 50%)",
                        backgroundSize: "200% 200%",
                      }}
                      animate={{
                        backgroundPosition: ["200% 200%", "-100% -100%"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </div>
                  
                  <motion.div
                    className="absolute -inset-4 rounded-lg bg-cyan-500/20 blur-md -z-10"
                    animate={{
                      opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  <motion.div
                    className="absolute -inset-2 rounded-lg border border-pink-500/50"
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
            <TooltipContent className="bg-black border border-cyan-500 text-cyan-400">
              <p className="text-sm font-mono">CLICK TO COLLECT XP BOOST</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </AnimatePresence>
  );
};

export default XPBoostItem;
