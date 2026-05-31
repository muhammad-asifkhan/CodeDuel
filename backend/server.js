import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import problems from "./problems.js";
import { spawn } from "child_process";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" }
});

// ============ GAME STATE ============
const rooms = new Map();
const playerRooms = new Map();

// ============ LOCAL CODE EXECUTION ============
async function compileAndPrepare(language, code) {
  const fileId = uuidv4();
  let filePath = "";
  let exePath = "";
  let command = "";
  let baseArgs = [];

  try {
    if (language === "python") {
      filePath = join(tmpdir(), `${fileId}.py`);
      await writeFile(filePath, code);
      command = "python";
      baseArgs = [filePath];
    } else if (language === "javascript") {
      filePath = join(tmpdir(), `${fileId}.js`);
      await writeFile(filePath, code);
      command = "node";
      baseArgs = [filePath];
    } else if (language === "cpp") {
      filePath = join(tmpdir(), `${fileId}.cpp`);
      exePath = join(tmpdir(), `${fileId}.exe`);
      await writeFile(filePath, code);
      
      const compiled = await new Promise(resolve => {
        const compileProc = spawn("g++", [filePath, "-I", process.cwd(), "-o", exePath]);
        let errStr = "";
        compileProc.stderr.on("data", d => errStr += d.toString());
        compileProc.on("close", code => resolve({ ok: code === 0, err: errStr }));
        compileProc.on("error", err => resolve({ ok: false, err: err.message }));
      });

      if (!compiled.ok) {
         return { success: false, error: "Compilation Error:\n" + compiled.err, cleanup: async () => { try { await unlink(filePath); } catch (e) {} } };
      }

      command = exePath;
      baseArgs = [];
    } else {
      return { success: false, error: "Unsupported language" };
    }

    const execute = async (input) => {
      return await new Promise((resolve) => {
        const proc = spawn(command, [...baseArgs, JSON.stringify(input)]);
        let stdout = "";
        let stderr = "";

        proc.stdout.on("data", (data) => { stdout += data.toString(); });
        proc.stderr.on("data", (data) => { stderr += data.toString(); });

        proc.on("close", () => {
          resolve({ success: !stderr.trim(), output: stderr.trim() || stdout.trim(), stdout: stdout.trim() });
        });

        proc.on("error", (err) => resolve({ success: false, output: err.message, stdout: "" }));

        setTimeout(() => {
          proc.kill();
          resolve({ success: false, output: "Execution timed out", stdout: "" });
        }, 5000);
      });
    };

    const cleanup = async () => {
      try { await unlink(filePath); } catch (e) {}
      if (exePath) try { await unlink(exePath); } catch (e) {}
    };

    return { success: true, execute, cleanup };
  } catch (error) {
    return { success: false, error: "Preparation failed: " + error.message };
  }
}

async function runTestCases(language, code, testCases) {
  const prep = await compileAndPrepare(language, code);
  
  if (!prep.success) {
     if (prep.cleanup) await prep.cleanup();
     return testCases.map((tc, i) => ({
        testCase: i + 1, input: JSON.stringify(tc.input), expected: JSON.stringify(tc.expected),
        actual: "", passed: false, error: prep.error
     }));
  }

  const results = [];

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    const execRes = await prep.execute(tc.input);

    let passed = false;
    let actual = execRes.output;
    let error = execRes.success ? null : execRes.output;

    if (execRes.success) {
      try {
        const lines = execRes.stdout.split('\n');
        let parsed = null;
        // Parse from the bottom up to ignore preceding console.log statements
        for (let j = lines.length - 1; j >= 0; j--) {
           try {
              if (!lines[j].trim()) continue;
              parsed = JSON.parse(lines[j]);
              break; 
           } catch (e) { /* keep searching up */ }
        }
        
        if (parsed !== null) {
           const expected = tc.expected;
           passed = JSON.stringify(parsed) === JSON.stringify(expected);
           actual = JSON.stringify(parsed);
        } else {
           passed = false;
        }
      } catch {
        passed = false;
      }
    }

    results.push({
      testCase: i + 1,
      input: JSON.stringify(tc.input),
      expected: JSON.stringify(tc.expected),
      actual: actual,
      passed,
      error
    });
  }

  await prep.cleanup();
  return results;
}

// ============ SOCKET.IO LOGIC ============
io.on("connection", (socket) => {
  console.log(`✅ Player connected: ${socket.id}`);

  // --- Create Room ---
  socket.on("create-room", ({ playerName }) => {
    const roomId = uuidv4().slice(0, 6).toUpperCase();
    const problem = problems[Math.floor(Math.random() * problems.length)];

    const room = {
      id: roomId,
      problem,
      players: [
        {
          id: socket.id,
          name: playerName,
          ready: false,
          code: "",
          language: "python",
          testResults: [],
          solved: false,
          solveTime: null,
          passedCount: 0
        }
      ],
      status: "waiting", // waiting | countdown | playing | finished
      startTime: null,
      winner: null
    };

    rooms.set(roomId, room);
    playerRooms.set(socket.id, roomId);
    socket.join(roomId);

    socket.emit("room-created", {
      roomId,
      player: room.players[0],
      problem: {
        ...problem,
        testCases: undefined // hide test cases from client
      }
    });

    console.log(`🏠 Room ${roomId} created by ${playerName}`);
  });

  // --- Join Room ---
  socket.on("join-room", ({ roomId, playerName }) => {
    const room = rooms.get(roomId);

    if (!room) {
      socket.emit("error-msg", { message: "Room not found!" });
      return;
    }

    if (room.players.length >= 2) {
      socket.emit("error-msg", { message: "Room is full!" });
      return;
    }

    if (room.status !== "waiting") {
      socket.emit("error-msg", { message: "Game already in progress!" });
      return;
    }

    const player = {
      id: socket.id,
      name: playerName,
      ready: false,
      code: "",
      language: "python",
      testResults: [],
      solved: false,
      solveTime: null,
      passedCount: 0
    };

    room.players.push(player);
    playerRooms.set(socket.id, roomId);
    socket.join(roomId);

    // Start countdown
    room.status = "countdown";

    io.to(roomId).emit("game-starting", {
      players: room.players.map((p) => ({
        id: p.id,
        name: p.name
      })),
      problem: {
        ...room.problem,
        testCases: undefined
      },
      countdown: 5
    });

    // Countdown then start
    let count = 5;
    const interval = setInterval(() => {
      count--;
      io.to(roomId).emit("countdown-tick", { count });
      if (count <= 0) {
        clearInterval(interval);
        room.status = "playing";
        room.startTime = Date.now();
        io.to(roomId).emit("game-started", { startTime: room.startTime });
      }
    }, 1000);

    console.log(`🎮 ${playerName} joined room ${roomId} — GAME STARTING!`);
  });

  // --- Code Update (live sync for opponent view) ---
  socket.on("code-update", ({ code, language }) => {
    const roomId = playerRooms.get(socket.id);
    if (!roomId) return;
    const room = rooms.get(roomId);
    if (!room) return;

    const player = room.players.find((p) => p.id === socket.id);
    if (player) {
      player.code = code;
      player.language = language;
    }

    // Broadcast to opponent (how many lines they've written)
    socket.to(roomId).emit("opponent-progress", {
      playerId: socket.id,
      lineCount: code.split("\n").length,
      language
    });
  });

  // --- Submit Code ---
  socket.on("submit-code", async ({ code, language }) => {
    const roomId = playerRooms.get(socket.id);
    if (!roomId) return;
    const room = rooms.get(roomId);
    if (!room || room.status !== "playing") return;

    const player = room.players.find((p) => p.id === socket.id);
    if (!player || player.solved) return;

    // Notify both players that submission is being evaluated
    io.to(roomId).emit("submission-running", { playerId: socket.id });

    const results = await runTestCases(language, code, room.problem.testCases);
    const passedCount = results.filter((r) => r.passed).length;
    const allPassed = passedCount === room.problem.testCases.length;

    player.testResults = results;
    player.passedCount = passedCount;
    player.code = code;
    player.language = language;

    // Send results to the submitter
    socket.emit("submission-result", {
      results,
      passedCount,
      totalCount: room.problem.testCases.length,
      allPassed
    });

    // Send progress to opponent
    socket.to(roomId).emit("opponent-submitted", {
      playerId: socket.id,
      passedCount,
      totalCount: room.problem.testCases.length,
      allPassed
    });

    if (allPassed) {
      player.solved = true;
      player.solveTime = Date.now() - room.startTime;

      // Check if game should end
      if (!room.winner) {
        room.winner = player;
        room.status = "finished";

        io.to(roomId).emit("game-over", {
          winner: {
            id: player.id,
            name: player.name,
            solveTime: player.solveTime
          },
          players: room.players.map((p) => ({
            id: p.id,
            name: p.name,
            solved: p.solved,
            solveTime: p.solveTime,
            passedCount: p.passedCount,
            totalCount: room.problem.testCases.length
          }))
        });

        console.log(
          `🏆 ${player.name} WON in room ${roomId}! Time: ${(player.solveTime / 1000).toFixed(1)}s`
        );
      }
    }
  });

  // --- Disconnect ---
  socket.on("disconnect", () => {
    const roomId = playerRooms.get(socket.id);
    if (roomId) {
      const room = rooms.get(roomId);
      if (room) {
        io.to(roomId).emit("player-disconnected", {
          playerId: socket.id
        });

        // Clean up after a delay
        setTimeout(() => {
          rooms.delete(roomId);
        }, 30000);
      }
      playerRooms.delete(socket.id);
    }
    console.log(`❌ Player disconnected: ${socket.id}`);
  });
});

// ============ REST ENDPOINTS ============
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", rooms: rooms.size });
});

app.get("/api/problems", (req, res) => {
  res.json(
    problems.map((p) => ({
      id: p.id,
      title: p.title,
      difficulty: p.difficulty
    }))
  );
});

// ============ START SERVER ============
const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`
  ⚔️  CodeDuel Server Running
  🌐 http://localhost:${PORT}
  🔌 WebSocket ready
  📝 ${problems.length} problems loaded
  `);
});