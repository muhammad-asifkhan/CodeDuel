import React from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Crown
} from "lucide-react";

export default function Result({ gameState, onPlayAgain }) {
  const { winner, players, playerName, opponentDisconnected } = gameState;
  const isWinner = winner?.name === playerName;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        {isWinner || opponentDisconnected ? (
          <>
            <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-neon-green/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-neon-yellow/10 rounded-full blur-3xl animate-pulse delay-700" />
          </>
        ) : (
          <>
            <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-neon-red/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl animate-pulse delay-700" />
          </>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="relative z-10 text-center max-w-lg w-full"
      >
        {/* Trophy or Skull */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="mb-6"
        >
          {isWinner || opponentDisconnected ? (
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Trophy className="w-24 h-24 text-neon-yellow mx-auto drop-shadow-[0_0_30px_rgba(234,179,8,0.5)]" />
            </motion.div>
          ) : (
            <div className="text-8xl">💀</div>
          )}
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`text-5xl font-black mb-2 ${
            (isWinner || opponentDisconnected)
              ? "bg-gradient-to-r from-neon-yellow via-neon-green to-neon-yellow bg-clip-text text-transparent"
              : "bg-gradient-to-r from-neon-red via-neon-purple to-neon-red bg-clip-text text-transparent"
          }`}
        >
          {opponentDisconnected ? "OPPONENT LEFT!" : (isWinner ? "VICTORY!" : "DEFEATED!")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-gray-400 mb-8 text-lg"
        >
          {opponentDisconnected
            ? "Your opponent disconnected from the match. You win by default! 🏆"
            : (isWinner
            ? "You solved it first! Legendary coder! 🔥"
            : `${winner?.name} solved it before you. Next time! 💪`)}
        </motion.p>

        {/* Player Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {players?.map((player, i) => {
            const isThisWinner = player.name === winner?.name;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.2 }}
                className={`p-6 rounded-2xl border ${
                  isThisWinner
                    ? "bg-neon-green/5 border-neon-green/30"
                    : "bg-dark-700/50 border-dark-600"
                }`}
              >
                {isThisWinner && (
                  <Crown className="w-6 h-6 text-neon-yellow mx-auto mb-2" />
                )}
                <h3 className="font-bold text-lg mb-3">{player.name}</h3>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status</span>
                    {player.solved ? (
                      <span className="text-neon-green flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Solved
                      </span>
                    ) : (
                      <span className="text-neon-red flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> Unsolved
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400">Tests</span>
                    <span className="font-mono">
                      {player.passedCount}/{player.totalCount}
                    </span>
                  </div>

                  {player.solveTime && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Time</span>
                      <span className="font-mono text-neon-blue flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {(player.solveTime / 1000).toFixed(1)}s
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Play Again */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPlayAgain}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-neon-purple to-neon-blue px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-neon-purple/25 transition-all"
        >
          <RotateCcw className="w-5 h-5" />
          Play Again
        </motion.button>
      </motion.div>
    </div>
  );
}