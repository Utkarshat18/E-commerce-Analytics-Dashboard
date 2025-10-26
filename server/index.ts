// server/index.ts
import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import { startGenerator } from "./datagenerator.js"; 

const app = express();
const PORT = 3001;

app.get("/", (_req, res) => res.json({ ok: true }));

const server = http.createServer(app);

const wss = new WebSocketServer({ server, path: "/ws" });

wss.on("connection", (socket) => {
  console.log("Client connected");

  socket.send(JSON.stringify({ type: "welcome", ts: Date.now() }));

  socket.on("close", () => console.log("Client disconnected"));
});

startGenerator((order) => {
  const msg = JSON.stringify(order);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) client.send(msg);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
