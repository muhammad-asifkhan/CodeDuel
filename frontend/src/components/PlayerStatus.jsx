import React from "react";
import { User } from "lucide-react";

export default function PlayerStatus({ playerName, opponent, opponentProgress }) {
  return (
    <div className="flex items-center gap-6">
      {/* Me */}
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-neon-green" />
        <span className="text-sm font-medium text-neon-green">
          {playerName} (You)
        </span>
      </div>

      <span className="text-gray-600">⚔️</span>

      {/* Opponent */}
      <div className="flex items-center gap-2">
        {opponent ? (
          <>
            <div className="w-2 h-2 rounded-full bg-neon-red" />
            <span className="text-sm font-medium text-neon-red">
              {opponent.name}
            </span>
            <span className="text-xs text-gray-500 font-mono ml-1">
              ({opponentProgress.lineCount} lines)
            </span>
          </>
        ) : (
          <>
            <div className="w-2 h-2 rounded-full bg-gray-600 animate-pulse" />
            <span className="text-sm text-gray-500">Waiting...</span>
          </>
        )}
      </div>
    </div>
  );
}