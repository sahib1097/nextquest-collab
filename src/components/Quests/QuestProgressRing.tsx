import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface QuestProgressRingProps {
  progress: number;
}

const QuestProgressRing = ({ progress }: QuestProgressRingProps) => {
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
