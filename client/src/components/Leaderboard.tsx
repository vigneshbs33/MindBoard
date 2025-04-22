import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type LeaderboardPeriod = "all-time" | "monthly" | "weekly";

export default function Leaderboard() {
  const [activePeriod, setActivePeriod] = useState<LeaderboardPeriod>("all-time");
  
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: [`/api/leaderboard/${activePeriod}`],
  });
  
  const handleTabChange = (period: LeaderboardPeriod) => {
    setActivePeriod(period);
  };
  
  return (
    <div className="max-w-4xl mx-auto mt-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-heading font-bold mb-2">Creativity Champions</h2>
        <p className="text-gray-600">See how your creative skills stack up against others</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="flex border-b">
          <Button
            variant="ghost"
            className={`flex-1 py-4 font-heading font-medium rounded-none ${
              activePeriod === "all-time" ? "text-primary border-b-2 border-primary" : "text-gray-500"
            }`}
            onClick={() => handleTabChange("all-time")}
          >
            All Time
          </Button>
          <Button
            variant="ghost"
            className={`flex-1 py-4 font-heading font-medium rounded-none ${
              activePeriod === "monthly" ? "text-primary border-b-2 border-primary" : "text-gray-500"
            }`}
            onClick={() => handleTabChange("monthly")}
          >
            This Month
          </Button>
          <Button
            variant="ghost"
            className={`flex-1 py-4 font-heading font-medium rounded-none ${
              activePeriod === "weekly" ? "text-primary border-b-2 border-primary" : "text-gray-500"
            }`}
            onClick={() => handleTabChange("weekly")}
          >
            This Week
          </Button>
        </div>
        
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b text-left text-sm font-medium text-gray-500">
                  <th className="py-3 px-4 w-16">#</th>
                  <th className="py-3 px-4">Player</th>
                  <th className="py-3 px-4">Battles</th>
                  <th className="py-3 px-4">Win Rate</th>
                  <th className="py-3 px-4 text-right">Avg Score</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      Loading leaderboard...
                    </td>
                  </tr>
                ) : leaderboard?.length ? (
                  leaderboard.map((entry, index) => (
                    <tr 
                      key={entry.userId} 
                      className={`border-b hover:bg-gray-50 ${entry.isCurrentUser ? 'bg-primary/5' : ''}`}
                    >
                      <td className="py-3 px-4 font-bold">{index + 1}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div 
                            className={`w-8 h-8 rounded-full ${
                              index === 0 ? 'bg-primary' : 
                              index === 1 ? 'bg-secondary' : 
                              index === 2 ? 'bg-accent' : 'bg-gray-500'
                            } text-white font-bold flex items-center justify-center text-sm mr-3`}
                          >
                            {entry.username.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{entry.username}</p>
                            <p className="text-xs text-gray-500">
                              {index === 0 ? 'Creative Genius' : 
                               index === 1 ? 'Idea Generator' : 
                               index === 2 ? 'Rising Star' : 
                               entry.isCurrentUser ? 'You' : 'Competitor'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{entry.totalBattles}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className={`${
                                entry.winRate > 65 ? 'bg-green-500' : 
                                entry.winRate > 50 ? 'bg-amber-500' : 'bg-red-500'
                              } h-2 rounded-full`} 
                              style={{ width: `${entry.winRate}%` }}
                            ></div>
                          </div>
                          <span>{entry.winRate}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-bold">
                        {(entry.avgScore / 10).toFixed(1)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      No leaderboard data available yet. Start a battle to be the first!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
