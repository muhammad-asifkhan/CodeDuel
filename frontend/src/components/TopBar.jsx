import React from "react";
import { Swords } from "lucide-react";
import Timer from "./Timer";
import PlayerStatus from "./PlayerStatus";

export default function TopBar({
  roomId,
  startTime,
  status,
  playerName,
  opponent,
  opponentProgress
}) {
  return (
    <div className="bg-dark-800 border-b border-dark-600 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Swords className="w-5 h-5 text-neon-purple" />
        <span className="font-bold text-sm">
          Room: <span className="text-neon-blue font-mono">{roomId}</span>
        </span>
      </div>

      <Timer startTime={startTime} status={status} />

      <PlayerStatus
        playerName={playerName}
        opponent={opponent}
        opponentProgress={opponentProgress}
      />
    </div>
  );
}
