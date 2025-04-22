
import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { 
  HoverCard,
  HoverCardTrigger,
  HoverCardContent 
} from "@/components/ui/hover-card";
import { Clock, Award, Target } from "lucide-react";
import 'react-circular-progressbar/dist/styles.css';

interface QuestProgressRingProps {
  xpReward: number;
  dueDate: string;
  difficulty: string;
  description: string;
}

const QuestProgressRing = ({ xpReward, dueDate, difficulty, description }: QuestProgressRingProps) => {
  // Calculate progress (mock for now - in real app would track actual progress)
  const progress = 50; // Example: 50% complete

  return (
    <HoverCard>
      <HoverCardTrigger>
        <div className="w-16 h-16 relative cursor-pointer">
          <CircularProgressbar
            value={progress}
            text={`${xpReward}XP`}
            styles={buildStyles({
              rotation: 0.25,
              strokeLinecap: 'round',
              textSize: '24px',
              pathTransitionDuration: 0.5,
              pathColor: `rgba(255,223,0,100)`,
              textColor: '#3e2e1e',
              trailColor: '#d6d6d6',
              backgroundColor: '#3e98c7',
            })}
          />
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-4">
        <div className="space-y-2">
          <h4 className="font-medium">Quest Details</h4>
          <p className="text-sm text-gray-500">{description}</p>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{dueDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Award className="w-4 h-4" />
              <span>{xpReward} XP</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              <span>{difficulty}</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default QuestProgressRing;
