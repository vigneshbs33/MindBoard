import { apiRequest } from "./queryClient";
import { BattleResult, EvaluationRequest } from "./types";

// API functions for battle-related operations
export const startBattle = async (opponentType: string = "ai", username: string): Promise<number> => {
  const response = await apiRequest("POST", "/api/battles", { opponentType, username });
  const data = await response.json();
  return data.id;
};

export const getBattle = async (id: number): Promise<any> => {
  const response = await apiRequest("GET", `/api/battles/${id}`, undefined);
  return response.json();
};

export const submitSolution = async (id: number, solution: string): Promise<void> => {
  await apiRequest("POST", `/api/battles/${id}/submit`, { solution });
};

export const getBattleResults = async (id: number): Promise<BattleResult> => {
  const response = await apiRequest("GET", `/api/battles/${id}/results`, undefined);
  return response.json();
};

// API functions for leaderboard operations
export const getLeaderboard = async (period: string = "all-time", username?: string): Promise<any[]> => {
  const response = await apiRequest("GET", `/api/leaderboard/${period}?username=${username || ''}`, undefined);
  return response.json();
};
