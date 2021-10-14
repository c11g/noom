import http from "http";
import express from "express";
import { WebSocketServer } from "ws";

const app = express();
const PORT = 3000;

app.set("view engine", "pug");
app.set("views", `${__dirname}/views`);

app.use("/public", express.static(`${__dirname}/public`));

app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const sockets = [];
wss.on("connection", (socket) => {
  console.log("Connected to Browser");

  sockets.push(socket);

  socket.on("message", (messageObj) => {
    const { nickname, message } = JSON.parse(messageObj);
    sockets.forEach((aSocket) => {
      aSocket.send(
        `${nickname}${socket === aSocket ? "(ME)" : ""}: ${message}`
      );
    });
  });

  socket.on("close", () => console.log("Disconnected from Browswer"));
});

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
