import { FC } from "react";

// Score bar component for results page
const ScoreBar: FC<{
  label: string;
  score: number;
  color: "primary" | "secondary";
  feedback?: string;
}> = ({ label, score, color, feedback }) => {
  const colorClass = color === "primary" ? "bg-primary" : "bg-secondary";
  
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="font-medium text-sm">{label}</span>
        <span className="font-bold text-sm">{score/10}/10</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`${colorClass} h-2 rounded-full score-bar`} 
          style={{ width: `${score}%` }}
        ></div>
      </div>
      {feedback && <p className="text-xs text-gray-500 mt-1">{feedback}</p>}
    </div>
  );
};

export default ScoreBar;