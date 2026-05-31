import React from "react";
import { User } from "lucide-react";

export default function ProblemPanel({ problem, opponent, opponentProgress }) {
  if (!problem) return null;

  return (
    <div className="w-[400px] bg-dark-800 border-r border-dark-600 overflow-y-auto p-6">
      {/* Difficulty Badge */}
      <div className="flex items-center gap-3 mb-4">
        <span
          className={`px-2 py-0.5 rounded text-xs font-bold ${
            problem.difficulty === "Easy"
              ? "bg-neon-green/20 text-neon-green"
              : problem.difficulty === "Medium"
              ? "bg-neon-yellow/20 text-neon-yellow"
              : "bg-neon-red/20 text-neon-red"
          }`}
        >
          {problem.difficulty}
        </span>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold mb-4">{problem.title}</h2>

      {/* Description */}
      <div className="prose prose-invert text-gray-300 text-sm leading-relaxed mb-6 whitespace-pre-wrap">
        {problem.description}
      </div>

      {/* Examples */}
      {problem.examples?.map((ex, i) => (
        <div
          key={i}
          className="bg-dark-900 rounded-xl p-4 mb-3 border border-dark-600"
        >
          <p className="text-xs font-mono text-gray-500 mb-2">
            Example {i + 1}
          </p>
          <p className="font-mono text-sm mb-1">
            <span className="text-gray-500">Input: </span>
            <span className="text-neon-blue">{ex.input}</span>
          </p>
          <p className="font-mono text-sm mb-1">
            <span className="text-gray-500">Output: </span>
            <span className="text-neon-green">{ex.output}</span>
          </p>
          {ex.explanation && (
            <p className="text-xs text-gray-500 mt-2">💡 {ex.explanation}</p>
          )}
        </div>
      ))}

      {/* Opponent Progress Card */}
      {opponent && (
        <div className="mt-6 bg-dark-900 border border-neon-red/20 rounded-xl p-4">
          <h4 className="text-sm font-bold text-neon-red mb-3 flex items-center gap-2">
            <User className="w-4 h-4" />
            {opponent.name}'s Progress
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Lines written</span>
              <span className="font-mono text-white">
                {opponentProgress.lineCount}
              </span>
            </div>
            {opponentProgress.totalCount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Tests passed</span>
                <span
                  className={`font-mono ${
                    opponentProgress.passedCount === opponentProgress.totalCount
                      ? "text-neon-green"
                      : "text-neon-yellow"
                  }`}
                >
                  {opponentProgress.passedCount}/{opponentProgress.totalCount}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}