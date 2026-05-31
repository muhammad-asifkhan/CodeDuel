import React, { useState } from "react";
import { motion } from "framer-motion";
import { Swords, Plus, LogIn, Zap, Code2, Trophy } from "lucide-react";
import toast from "react-hot-toast";

export default function Home({ onCreateRoom, onJoinRoom, gameState }) {
  const [mode, setMode] = useState(null);
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");

  const features = [
    { icon: Code2, text: "Live Editor", color: "text-neon-blue" },
    { icon: Zap, text: "Real-Time", color: "text-neon-yellow" },
    { icon: Trophy, text: "First Wins", color: "text-neon-green" }
  ];

  const handleAction = () => {
    if (!name.trim()) return toast.error("Enter your name!");
    if (mode === "join" && !roomCode.trim()) return toast.error("Enter room code!");
    if (mode === "create") onCreateRoom(name.trim());
    else onJoinRoom(roomCode.trim(), name.trim());
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-neon-pink/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center"
      >
        {/* Logo */}
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="inline-block mb-6"
        >
          <Swords className="w-20 h-20 text-neon-purple mx-auto" />
        </motion.div>

        <h1 className="text-7xl font-black mb-2 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent">
          CodeDuel
        </h1>
        <p className="text-xl text-gray-400 mb-2 font-mono">
          1v1 Real-Time Coding Battle
        </p>
        <p className="text-sm text-gray-600 mb-12 font-mono">
          Solve. Compete. Conquer.
        </p>

        {/* Features */}
        <div className="flex gap-8 justify-center mb-12">
          {features.map(({ icon: Icon, text, color }, i) => (
            <motion.div
              key={text}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="flex flex-col items-center gap-2"
            >
              <Icon className={`w-6 h-6 ${color}`} />
              <span className="text-xs text-gray-500 font-mono">{text}</span>
            </motion.div>
          ))}
        </div>

        {/* Waiting State */}
        {gameState.status === "waiting" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-dark-700/80 backdrop-blur-xl border border-neon-purple/30 rounded-2xl p-8 max-w-md mx-auto"
          >
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-neon-purple/20 flex items-center justify-center mx-auto mb-4">
                <div className="w-4 h-4 rounded-full bg-neon-purple animate-pulse-fast" />
              </div>
              <h3 className="text-xl font-bold mb-2">Waiting for Opponent...</h3>
              <p className="text-gray-400 mb-4">Share this room code:</p>
              <div className="bg-dark-900 rounded-xl p-4 mb-4">
                <span className="text-4xl font-mono font-bold tracking-[0.3em] text-neon-blue">
                  {gameState.roomId}
                </span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(gameState.roomId);
                  toast.success("Room code copied!");
                }}
                className="text-sm text-neon-purple hover:text-neon-pink transition-colors font-mono"
              >
                📋 Click to Copy
              </button>
            </div>
          </motion.div>
        ) : !mode ? (
          /* Initial Buttons */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMode("create")}
              className="group flex items-center gap-3 bg-gradient-to-r from-neon-purple to-neon-pink px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-neon-purple/25 hover:shadow-neon-purple/50 transition-all"
            >
              <Plus className="w-5 h-5" />
              Create Battle
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMode("join")}
              className="group flex items-center gap-3 bg-dark-700 border border-neon-blue/50 px-8 py-4 rounded-xl font-bold text-lg hover:border-neon-blue hover:shadow-lg hover:shadow-neon-blue/25 transition-all"
            >
              <LogIn className="w-5 h-5 text-neon-blue" />
              Join Battle
            </motion.button>
          </motion.div>
        ) : (
          /* Name + Room Code Form */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-dark-700/80 backdrop-blur-xl border border-dark-600 rounded-2xl p-8 w-full max-w-md"
          >
            <h3 className="text-xl font-bold mb-6">
              {mode === "create" ? "⚔️ Create a Battle" : "🎮 Join a Battle"}
            </h3>

            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-dark-900 border border-dark-600 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-neon-purple transition-colors font-mono"
              maxLength={15}
              autoFocus
            />

            {mode === "join" && (
              <input
                type="text"
                placeholder="Room Code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                className="w-full bg-dark-900 border border-dark-600 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-neon-blue transition-colors font-mono text-center text-2xl tracking-[0.3em]"
                maxLength={6}
              />
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setMode(null)}
                className="flex-1 bg-dark-600 hover:bg-dark-800 px-6 py-3 rounded-xl font-medium transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleAction}
                disabled={!name.trim()}
                className="flex-1 bg-gradient-to-r from-neon-purple to-neon-blue px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {mode === "create" ? "Create" : "Join"}
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}