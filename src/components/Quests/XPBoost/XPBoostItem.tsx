import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XPBoost, XPBoostType } from "@/types/boost";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  "F_U_CardExp4.png"
];

const XPBoostItem = ({ onCollect }: XPBoostItemProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const showBoost = () => {
      setIsVisible(true);
      setCurrentFrame(0);
    };

    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        showBoost();
      }
    }, Math.random() * (120000 - 30000) + 30000);

    return () => clearInterval(interval);
  }, []);

  const handleCollect = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    let frame = 0;

    const animate = setInterval(() => {
      frame++;
      if (frame < animationFrames.length) {
        setCurrentFrame(frame);
      } else {
        clearInterval(animate);
        finishCollect();
      }
    }, 100); // ~12.5 fps
  };

  const finishCollect = () => {
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
    setIsAnimating(false);

    toast.success(
      <div className="flex flex-col items-center gap-2">
        <span className="text-lg font-bold">XP Boost Collected! 🎉</span>
        <div className="flex items-center gap-1">
          <span className="text-purple-500 font-semibold">{randomBoost.multiplier}x</span>
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
                <img
                  src={`/assets/${animationFrames[currentFrame]}`}
                  alt="XP Boost"
                  className="w-20 h-20 object-contain"
                />
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
