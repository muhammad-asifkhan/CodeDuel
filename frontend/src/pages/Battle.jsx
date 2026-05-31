import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Code2, Send, Loader2 } from "lucide-react";

// Components
import CountdownOverlay from "../components/CountdownOverlay";
import TopBar from "../components/TopBar";
import ProblemPanel from "../components/ProblemPanel";
import CodeEditor from "../components/CodeEditor";
import Terminal from "../components/Terminal";
import LanguageSelector from "../components/LanguageSelector";

export default function Battle({ socket, gameState, onSubmit, onCodeUpdate }) {
  const {
    problem,
    status,
    countdown,
    startTime,
    myResults,
    opponentProgress,
    players,
    playerName,
    roomId
  } = gameState;

  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Set starter code when problem/language changes
  useEffect(() => {
    if (problem?.starterCode?.[language]) {
      setCode(problem.starterCode[language]);
    }
  }, [problem, language]);

  // Send code updates to server (debounced)
  useEffect(() => {
    const debounce = setTimeout(() => {
      if (status === "playing") {
        onCodeUpdate(code, language);
      }
    }, 500);
    return () => clearTimeout(debounce);
  }, [code, language, status, onCodeUpdate]);

  // Handle submission results
  useEffect(() => {
    if (myResults) {
      setSubmitting(false);
      setShowResults(true);
    }
  }, [myResults]);

  const handleSubmit = () => {
    setSubmitting(true);
    setShowResults(false);
    onSubmit(code, language);
  };

  const opponent = players?.find((p) => p.id !== socket?.id);

  return (
    <div className="h-screen flex flex-col bg-dark-900">
      {/* Countdown */}
      <CountdownOverlay status={status} countdown={countdown} />

      {/* Top Bar */}
      <TopBar
        roomId={roomId}
        startTime={startTime}
        status={status}
        playerName={playerName}
        opponent={opponent}
        opponentProgress={opponentProgress}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left — Problem */}
        <ProblemPanel
          problem={problem}
          opponent={opponent}
          opponentProgress={opponentProgress}
        />

        {/* Right — Editor + Terminal */}
        <div className="flex-1 flex flex-col">
          {/* Editor Header */}
          <div className="bg-dark-800 border-b border-dark-600 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Code2 className="w-4 h-4 text-neon-purple" />
              <LanguageSelector
                language={language}
                setLanguage={setLanguage}
                hasCpp={!!problem?.starterCode?.cpp}
              />
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={submitting || status !== "playing"}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-sm transition-all ${
                submitting
                  ? "bg-dark-600 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-neon-green to-emerald-500 text-dark-900 hover:shadow-lg hover:shadow-neon-green/25"
              }`}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit
                </>
              )}
            </motion.button>
          </div>

          {/* Monaco Editor */}
          <CodeEditor
            language={language}
            code={code}
            onChange={setCode}
            disabled={status !== "playing"}
          />

          {/* Test Results Terminal */}
          <Terminal
            results={myResults}
            visible={showResults}
            onClose={() => setShowResults(false)}
          />
        </div>
      </div>
    </div>
  );
}