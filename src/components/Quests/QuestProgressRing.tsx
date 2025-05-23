import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { 
  HoverCard,
  HoverCardTrigger,
  HoverCardContent 
} from "@/components/ui/hover-card";
import { Clock, Award, Target, Zap } from "lucide-react";
import 'react-circular-progressbar/dist/styles.css';
import { useTheme } from "@/contexts/ThemeContext";

interface QuestProgressRingProps {
  // progress: number;
  xpReward: number;
  dueDate: string;
  difficulty: string;
  description: string;
}

const QuestProgressRing = ({ xpReward, dueDate, difficulty, description }: QuestProgressRingProps) => {
  const { currentTheme } = useTheme();
  const isCyberpunkTheme = currentTheme.name === "Cyberpunk";
  // Calculate progress (mock for now - in real app would track actual progress)
  const progress = 50; // Example: 50% complete

  if (isCyberpunkTheme) {
    return (
      <HoverCard>
        <HoverCardTrigger>
          <div className="w-16 h-16 relative cursor-pointer group">
            <CircularProgressbar
              value={progress}
              text=""
              styles={buildStyles({
                rotation: 0.25,
                strokeLinecap: 'round',
                pathTransitionDuration: 0.5,
                pathColor: '#00ffff',
                trailColor: 'rgba(0, 255, 255, 0.1)',
                backgroundColor: 'transparent',
              })}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center -mt-1">
              <div className="flex items-center gap-0.5">
                <Zap className="w-3 h-3 text-cyan-400" />
                <span className="text-[11px] font-mono text-cyan-400 tracking-wider">{xpReward}</span>
              </div>
              <span className="text-[9px] font-mono text-cyan-400/80 tracking-wider mt-0.5">XP</span>
            </div>
            <div className="absolute inset-0 rounded-full border-2 border-cyan-500/50 shadow-[0_0_10px_rgba(0,255,255,0.3)] pointer-events-none" />
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-80 p-4 bg-black border-2 border-cyan-500 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
          <div className="space-y-3">
            <h4 className="font-mono text-cyan-400 tracking-wider">MISSION PARAMETERS</h4>
            <p className="text-sm text-cyan-300/90 font-mono">{description}</p>
            <div className="flex items-center gap-4 text-sm text-cyan-300/80 font-mono">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>DEADLINE: {dueDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>REWARD: {xpReward} XP</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4 text-cyan-400" />
                <span>DIFFICULTY: {difficulty}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-cyan-500/30">
              <div className="flex items-center gap-2">
                <div className="h-1 flex-1 bg-cyan-500/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-cyan-500 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs text-cyan-400 font-mono">{progress}%</span>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    );
  }

  return (
    <div className="w-16 h-16 relative">
      <CircularProgressbar
        value={progress}
        text={`${progress}%`}
        styles={buildStyles({
          rotation: 0.25,
          strokeLinecap: 'round',
          textSize: '24px',
          pathTransitionDuration: 0.5,
          pathColor: 'hsl(var(--primary))',
          textColor: 'hsl(var(--primary))',
          trailColor: 'hsl(var(--muted))',
        })}
      />
    </div>
  );
};

export default QuestProgressRing;
