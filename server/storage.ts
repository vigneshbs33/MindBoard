import { 
  users, type User, type InsertUser,
  battles, type Battle, type InsertBattle,
  scores, type Score, type InsertScore,
  leaderboard, type LeaderboardEntry, type InsertLeaderboardEntry
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Battle methods
  getBattle(id: number): Promise<Battle | undefined>;
  createBattle(battle: Omit<InsertBattle, "userId"> & { userId: number }): Promise<Battle>;
  updateBattle(id: number, updates: Partial<Battle>): Promise<Battle>;
  
  // Score methods
  getScoreByBattleId(battleId: number): Promise<Score | undefined>;
  createScore(score: InsertScore): Promise<Score>;
  
  // Leaderboard methods
  getLeaderboard(period: string, username?: string): Promise<LeaderboardEntry[]>;
  updateLeaderboard(username: string, userId: number, isWin: boolean): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private battles: Map<number, Battle>;
  private scores: Map<number, Score>;
  private leaderboardEntries: Map<number, LeaderboardEntry>;
  
  private userId: number;
  private battleId: number;
  private scoreId: number;
  private leaderboardId: number;
  
  constructor() {
    this.users = new Map();
    this.battles = new Map();
    this.scores = new Map();
    this.leaderboardEntries = new Map();
    
    this.userId = 1;
    this.battleId = 1;
    this.scoreId = 1;
    this.leaderboardId = 1;
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const id = this.userId++;
    const newUser = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }
  
  // Battle methods
  async getBattle(id: number): Promise<Battle | undefined> {
    return this.battles.get(id);
  }
  
  async createBattle(battle: Omit<InsertBattle, "userId"> & { userId: number }): Promise<Battle> {
    const id = this.battleId++;
    const newBattle = { 
      ...battle, 
      id, 
      userSolution: null,
      aiSolution: null,
      userScore: null,
      aiScore: null,
      userWon: null,
      createdAt: new Date().toISOString() 
    } as Battle;
    
    this.battles.set(id, newBattle);
    return newBattle;
  }
  
  async updateBattle(id: number, updates: Partial<Battle>): Promise<Battle> {
    const battle = this.battles.get(id);
    if (!battle) {
      throw new Error(`Battle with ID ${id} not found`);
    }
    
    const updatedBattle = { ...battle, ...updates };
    this.battles.set(id, updatedBattle);
    return updatedBattle;
  }
  
  // Score methods
  async getScoreByBattleId(battleId: number): Promise<Score | undefined> {
    return Array.from(this.scores.values()).find(score => score.battleId === battleId);
  }
  
  async createScore(score: InsertScore): Promise<Score> {
    const id = this.scoreId++;
    const newScore = { ...score, id };
    this.scores.set(id, newScore);
    return newScore;
  }
  
  // Leaderboard methods
  async getLeaderboard(period: string, username?: string): Promise<LeaderboardEntry[]> {
    // In a real app, we would filter by period
    // For simplicity, we'll return all entries
    const entries = Array.from(this.leaderboardEntries.values());
    
    // Mark current user
    if (username) {
      return entries.map(entry => ({
        ...entry,
        isCurrentUser: entry.username === username
      })).sort((a, b) => b.avgScore - a.avgScore);
    }
    
    return entries
      .map(entry => ({ ...entry, isCurrentUser: false }))
      .sort((a, b) => b.avgScore - a.avgScore);
  }
  
  async updateLeaderboard(username: string, userId: number, isWin: boolean): Promise<void> {
    // Find existing entry
    let entry = Array.from(this.leaderboardEntries.values())
      .find(entry => entry.userId === userId);
    
    if (entry) {
      // Update existing entry
      const totalBattles = entry.totalBattles + 1;
      const wins = isWin ? entry.wins + 1 : entry.wins;
      
      const updatedEntry = {
        ...entry,
        totalBattles,
        wins,
        winRate: Math.round((wins / totalBattles) * 100)
      };
      
      this.leaderboardEntries.set(entry.id, updatedEntry);
    } else {
      // Create new entry
      const id = this.leaderboardId++;
      const newEntry = {
        id,
        userId,
        username,
        totalBattles: 1,
        wins: isWin ? 1 : 0,
        winRate: isWin ? 100 : 0,
        avgScore: 0
      };
      
      this.leaderboardEntries.set(id, newEntry);
    }
  }
}

export const storage = new MemStorage();
