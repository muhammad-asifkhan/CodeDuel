import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export default function Timer({ startTime, status }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (status !== "playing") return;

    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [status, startTime]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-2 bg-dark-700 px-4 py-1.5 rounded-full">
      <Clock className="w-4 h-4 text-neon-yellow" />
      <span className="font-mono font-bold text-neon-yellow text-lg">
        {formatTime(elapsed)}
      </span>
    </div>
  );
}