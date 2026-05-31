import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

export default function Terminal({ results, visible, onClose }) {
  if (!results || !visible) return null;

  const { results: testResults, passedCount, totalCount, allPassed } = results;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-dark-800 border-t border-dark-600 overflow-hidden"
        >
          <div className="p-4 max-h-64 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm flex items-center gap-2">
                {allPassed ? (
                  <CheckCircle2 className="w-5 h-5 text-neon-green" />
                ) : (
                  <XCircle className="w-5 h-5 text-neon-red" />
                )}
                Test Results: {passedCount}/{totalCount}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-white text-sm transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-dark-900 rounded-full h-2 mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(passedCount / totalCount) * 100}%` }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={`h-2 rounded-full ${
                  allPassed ? "bg-neon-green" : "bg-neon-yellow"
                }`}
              />
            </div>

            {/* Test Case Results */}
            <div className="space-y-2">
              {testResults.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex items-start gap-3 p-3 rounded-lg ${
                    r.passed
                      ? "bg-neon-green/5 border border-neon-green/20"
                      : "bg-neon-red/5 border border-neon-red/20"
                  }`}
                >
                  {r.passed ? (
                    <CheckCircle2 className="w-5 h-5 text-neon-green shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-neon-red shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 font-mono text-xs">
                    <p className="text-gray-400 font-bold mb-1">
                      Test Case {r.testCase}
                    </p>
                    <p>
                      <span className="text-gray-500">Input:    </span>
                      <span className="text-gray-300">{r.input}</span>
                    </p>
                    <p>
                      <span className="text-gray-500">Expected: </span>
                      <span className="text-neon-green">{r.expected}</span>
                    </p>
                    <p>
                      <span className="text-gray-500">Got:      </span>
                      <span className={r.passed ? "text-neon-green" : "text-neon-red"}>
                        {r.actual}
                      </span>
                    </p>
                    {r.error && (
                      <p className="text-neon-red mt-1 bg-neon-red/5 p-2 rounded">
                        ⚠️ {r.error}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}