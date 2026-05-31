import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CountdownOverlay({ status, countdown }) {
  return (
    <AnimatePresence>
      {status === "countdown" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 countdown-overlay flex items-center justify-center"
        >
          <motion.div
            key={countdown}
            initial={{ scale: 3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {countdown > 0 ? (
              <span className="text-9xl font-black bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                {countdown}
              </span>
            ) : (
              <span className="text-7xl font-black text-neon-green">GO!</span>
            )}
            <p className="text-2xl text-gray-400 mt-4 font-mono">
              {countdown > 0 ? "Get Ready..." : "Start Coding!"}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
