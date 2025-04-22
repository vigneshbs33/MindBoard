// Battle types
export interface Battle {
  id: number;
  prompt: string;
  userId: number;
  userSolution?: string;
  aiSolution?: string;
  userScore?: number;
  aiScore?: number;
  userWon?: boolean;
  completed: boolean;
  opponentType: "ai" | "human";
  createdAt: string;
}

// Score types
export interface Score {
  id: number;
  battleId: number;
  userOriginality: number;
  userLogic: number;
  userExpression: number;
  aiOriginality: number;
  aiLogic: number;
  aiExpression: number;
  judgeFeedback: string;
  userOriginalityFeedback: string;
  userLogicFeedback: string;
  userExpressionFeedback: string;
  aiOriginalityFeedback: string;
  aiLogicFeedback: string;
  aiExpressionFeedback: string;
}

// Battle result including scores
export interface BattleResult {
  battle: Battle;
  scores: Score;
}

// Evaluation request to OpenAI
export interface EvaluationRequest {
  prompt: string;
  userSolution: string;
  aiSolution: string;
}

// Evaluation response from OpenAI
export interface EvaluationResponse {
  userScore: {
    originality: number;
    logic: number;
    expression: number;
    originalityFeedback: string;
    logicFeedback: string;
    expressionFeedback: string;
    total: number;
  };
  aiScore: {
    originality: number;
    logic: number;
    expression: number;
    originalityFeedback: string;
    logicFeedback: string;
    expressionFeedback: string;
    total: number;
  };
  judgeFeedback: string;
  winner: "user" | "ai";
}

// Leaderboard entry
export interface LeaderboardEntry {
  userId: number;
  username: string;
  totalBattles: number;
  wins: number;
  winRate: number;
  avgScore: number;
  isCurrentUser: boolean;
}
