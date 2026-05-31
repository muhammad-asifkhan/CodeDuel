import React, { useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import toast, { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Battle from "./pages/Battle";
import Result from "./pages/Result";

const SOCKET_URL = "http://localhost:3001";

export default function App() {
  const [page, setPage] = useState("home"); // home | battle | result
  const [socket, setSocket] = useState(null);
  const [gameState, setGameState] = useState({
    roomId: null,
    playerName: "",
    players: [],
    problem: null,
    status: "idle", // idle | waiting | countdown | playing | finished
    countdown: 0,
    startTime: null,
    winner: null,
    myResults: null,
    opponentProgress: { lineCount: 0, passedCount: 0, totalCount: 0 }
  });

  // Connect socket
  useEffect(() => {
    const s = io(SOCKET_URL, {
      transports: ["websocket", "polling"]
    });

    s.on("connect", () => {
      console.log("Connected:", s.id);
    });

    // Room created
    s.on("room-created", ({ roomId, player, problem }) => {
      setGameState((prev) => ({
        ...prev,
        roomId,
        players: [player],
        problem,
        status: "waiting"
      }));
      setPage("battle");
      toast.success(`Room ${roomId} created! Share the code.`);
    });

    // Error
    s.on("error-msg", ({ message }) => {
      toast.error(message);
    });

    // Game starting (opponent joined)
    s.on("game-starting", ({ players, problem, countdown }) => {
      setGameState((prev) => ({
        ...prev,
        players,
        problem: problem || prev.problem,
        status: "countdown",
        countdown
      }));
      setPage("battle");
      toast("⚔️ Opponent found! Get ready!", { icon: "🎮" });
    });

    // Countdown
    s.on("countdown-tick", ({ count }) => {
      setGameState((prev) => ({ ...prev, countdown: count }));
    });

    // Game started
    s.on("game-started", ({ startTime }) => {
      setGameState((prev) => ({
        ...prev,
        status: "playing",
        startTime
      }));
    });

    // Opponent progress
    s.on("opponent-progress", ({ lineCount, language }) => {
      setGameState((prev) => ({
        ...prev,
        opponentProgress: { ...prev.opponentProgress, lineCount }
      }));
    });

    // Submission running
    s.on("submission-running", ({ playerId }) => {
      if (playerId !== s.id) {
        toast("⚡ Opponent submitted their code!", { icon: "😰" });
      }
    });

    // My submission result
    s.on("submission-result", ({ results, passedCount, totalCount, allPassed }) => {
      setGameState((prev) => ({
        ...prev,
        myResults: { results, passedCount, totalCount, allPassed }
      }));

      if (allPassed) {
        toast.success("🎉 All test cases passed!");
      } else {
        toast.error(`${passedCount}/${totalCount} test cases passed`);
      }
    });

    // Opponent submitted
    s.on("opponent-submitted", ({ passedCount, totalCount, allPassed }) => {
      setGameState((prev) => ({
        ...prev,
        opponentProgress: { ...prev.opponentProgress, passedCount, totalCount }
      }));

      if (allPassed) {
        toast("💀 Opponent solved it!", { icon: "😱" });
      }
    });

    // Game over
    s.on("game-over", ({ winner, players }) => {
      setGameState((prev) => ({
        ...prev,
        status: "finished",
        winner,
        players
      }));
      setPage("result");
    });

    // Player disconnected
    s.on("player-disconnected", () => {
      toast.error("Opponent disconnected!");
      setGameState((prev) => ({ ...prev, status: "finished", opponentDisconnected: true }));
    });

    setSocket(s);

    return () => s.disconnect();
  }, []);

  const createRoom = (playerName) => {
    setGameState((prev) => ({ ...prev, playerName }));
    socket?.emit("create-room", { playerName });
  };

  const joinRoom = (roomId, playerName) => {
    setGameState((prev) => ({ ...prev, playerName, roomId }));
    socket?.emit("join-room", { roomId: roomId.toUpperCase(), playerName });
  };

  const submitCode = useCallback((code, language) => {
    socket?.emit("submit-code", { code, language });
  }, [socket]);

  const updateCode = useCallback((code, language) => {
    socket?.emit("code-update", { code, language });
  }, [socket]);

  const resetGame = () => {
    setGameState({
      roomId: null,
      playerName: "",
      players: [],
      problem: null,
      status: "idle",
      countdown: 0,
      startTime: null,
      winner: null,
      myResults: null,
      opponentDisconnected: false,
      opponentProgress: { lineCount: 0, passedCount: 0, totalCount: 0 }
    });
    setPage("home");
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#1a1a2e",
            color: "#fff",
            border: "1px solid #a855f733"
          }
        }}
      />

      {page === "home" && (
        <Home
          onCreateRoom={createRoom}
          onJoinRoom={joinRoom}
          gameState={gameState}
        />
      )}

      {page === "battle" && (
        <Battle
          socket={socket}
          gameState={gameState}
          onSubmit={submitCode}
          onCodeUpdate={updateCode}
        />
      )}

      {page === "result" && (
        <Result gameState={gameState} onPlayAgain={resetGame} />
      )}
    </div>
  );
}