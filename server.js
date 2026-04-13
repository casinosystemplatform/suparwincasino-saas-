const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let players = {};

// 🌐 Health check route
app.get("/", (req, res) => {
  res.send("🎰 Casino Backend Running");
});

// 🧠 Broadcast function
function broadcast(data) {
  Object.values(players).forEach(p => {
    if (p.ws.readyState === 1) {
      p.ws.send(JSON.stringify(data));
    }
  });
}

// 🎮 WebSocket connection
wss.on("connection", (ws) => {
  const id = Math.random().toString(36).substring(2, 10);

  players[id] = {
    ws,
    balance: 1000,
    bet: null
  };

  ws.send(JSON.stringify({
    type: "init",
    id,
    balance: 1000
  }));

  // 📩 receive message
  ws.on("message", (msg) => {
    const data = JSON.parse(msg);
    const player = players[id];

    // 💰 place bet
    if (data.type === "bet") {
      player.bet = data;
      console.log("Bet placed:", data);
    }

    // 🎲 spin roulette
    if (data.type === "spin") {
      spinRoulette();
    }
  });

  // ❌ disconnect
  ws.on("close", () => {
    delete players[id];
  });
});

// 🎲 Roulette Engine
function spinRoulette() {
  const result = Math.floor(Math.random() * 37);

  console.log("🎲 Winning number:", result);

  setTimeout(() => {
    Object.keys(players).forEach(id => {
      let p = players[id];

      if (!p.bet) return;

      if (p.bet.number === result) {
        p.balance += p.bet.amount * 10; // win
      } else {
        p.balance -= p.bet.amount; // lose
      }

      p.ws.send(JSON.stringify({
        type: "balance",
        balance: p.balance
      }));

      p.bet = null;
    });

    broadcast({
      type: "result",
      result
    });

  }, 2000);
}

// 🚀 Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🎰 Casino server running on port ${PORT}`);
});
