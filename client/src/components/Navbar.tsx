import { useContext } from "react";
import { useLocation } from "wouter";
import { UserContext } from "@/App";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [location, navigate] = useLocation();
  const { username } = useContext(UserContext);
  const isBattlePage = location.startsWith("/battle/");

  const handleStartBattle = () => {
    if (isBattlePage) {
      // If already in battle, navigate home to start a new one
      navigate("/");
    } else {
      // Start a new battle directly with default AI opponent
      navigate("/");
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
            <div className="flex-shrink-0 flex items-center">
              <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" fill="currentColor"/>
                <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 16V21M12 3V8M8 12H3M21 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <h1 className="ml-2 text-xl font-heading font-bold text-primary">MindBoard</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {username !== "Guest" && (
              <div className="hidden md:flex items-center">
                <span className="text-sm font-medium text-gray-700">
                  Playing as: <span className="text-primary font-bold">{username}</span>
                </span>
              </div>
            )}
            <Button 
              className="bg-primary hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 text-sm"
              onClick={handleStartBattle}
            >
              {isBattlePage ? "Abandon Battle" : "Start New Battle"}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
