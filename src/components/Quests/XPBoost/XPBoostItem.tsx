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

interface XPBoostItemProps {
  onCollect: (boost: XPBoost) => void;
}

const animationFrames = [
  "F_U_CardExp_Back1.png",
  "F_U_CardExp_Back2.png",
  "F_U_CardExp_Back3.png",
  "F_U_CardExp_Back4.png",
  "F_U_CardExp1.png",
  "F_U_CardExp2.png",
  "F_U_CardExp3.png",
  "F_U_CardExp4.png",
];

const XPBoostItem = ({ onCollect }: XPBoostItemProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const collectSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    collectSound.current = new Audio("/assets/CollectItem.mp3");
  }, []);

  useEffect(() => {
    // Function to show XP boost and auto-hide
    const showBoost = () => {
      if (!isVisible) {
        setCurrentFrame(0);
        setIsVisible(true);
        timeoutRef.current = setTimeout(() => {
          setIsVisible(false);
        }, 20000); // Disappear after 20s
      }
    };

    // Start interval when component mounts
    const startInterval = () => {
      const intervalDuration = Math.random() * (70000 - 30000) + 10000;
      intervalRef.current = setTimeout(() => {
        if (Math.random() < 0.3) {
          showBoost();
        }
        startInterval(); // Restart interval
      }, intervalDuration);
    };

    startInterval();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, []);

  const handleCollect = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    let frame = 0;
    const frameInterval = setInterval(() => {
      frame++;
      if (frame < animationFrames.length) {
        setCurrentFrame(frame);
      } else {
        clearInterval(frameInterval);
        finishCollect();
      }
    }, 100);
  };

  const finishCollect = () => {
    const boostTypes = [
      { type: XPBoostType.STANDARD, multiplier: 1.5, color: "#D6BCFA" },
      { type: XPBoostType.PREMIUM, multiplier: 2, color: "#9B87F5" },
      { type: XPBoostType.ULTRA, multiplier: 3, color: "#8B5CF6" },
    ];

    const randomBoost = boostTypes[Math.floor(Math.random() * boostTypes.length)];

    const boost: XPBoost = {
      id: crypto.randomUUID(),
      multiplier: randomBoost.multiplier,
      duration: 300000,
      expiresAt: new Date(Date.now() + 300000).toISOString(),
      type: randomBoost.type,
      isActive: true,
    };

    onCollect(boost);
    setIsVisible(false);
    setIsAnimating(false);

    if (collectSound.current) {
      collectSound.current.currentTime = 0;
      collectSound.current.play();
    }

    toast.success(
      <div className="flex flex-col items-center gap-2">
        <span className="text-lg font-bold">XP Boost Collected! 🎉</span>
        <div className="flex items-center gap-1">
          <span className="text-purple-500 font-semibold">
            {randomBoost.multiplier}x
          </span>
          <span>multiplier for 5 minutes</span>
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
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="fixed bottom-20 right-10 cursor-pointer z-50"
                onClick={handleCollect}
              >
                <div className="relative rounded-md shadow-xl bg-gray-700 p-1">
                <motion.img
                  src={`/assets/${animationFrames[currentFrame]}`}
                  alt="XP Boost"
                  className="w-20 h-20 object-contain"
                  animate={
                    !isAnimating
                      ? {
                          scale: [1, 1.1, 1],
                          opacity: [1, 0.9, 1],
                        }
                      : {}
                  }
                  transition={
                    !isAnimating
                      ? {
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }
                      : {}
                  }
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
