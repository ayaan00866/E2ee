const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const upload = multer({ dest: "uploads/" });

app.use(express.static("public"));
app.use(express.json());

app.post("/start", upload.single("messages"), async (req, res) => {
  const { convo, prefix, speed, cookie } = req.body;
  const token = cookie.match(/xs=([^;]+)/) ? cookie.match(/xs=([^;]+)/)[1] : null;
  const messages = fs.readFileSync(req.file.path, "utf-8").split("\n").filter(m => m.trim());
  
  io.emit("status", { text: "🚀 Glitch Bypass Engine Started..." });

  let i = 0;
  setInterval(async () => {
    if (i >= messages.length) i = 0;
    try {
      await axios({
        method: 'POST',
        url: `https://graph.facebook.com/v19.0/t_${convo}/messages`,
        params: { access_token: token, message: `${prefix} ${messages[i]}` },
        headers: { 'Cookie': cookie, 'User-Agent': 'FBAndroid/600.0.0.0.0' }
      });
      io.emit("status", { text: `✅ SENT: ${messages[i]}` });
    } catch (err) {
      io.emit("status", { text: "❌ Blocked! Check Cookie." });
    }
    i++;
  }, speed * 1000);
  res.json({ ok: true });
});

server.listen(process.env.PORT || 3000, () => console.log("Glitch Server Live"));
