const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const fs = require('fs');

server.listen(process.env.PORT || 80, function () {
  console.log("Server started");
});

app.use(express.static("static"));

const sockets = [];
io.on('connection', function (socket) {
  sockets.push(socket);
  console.log(socket.id + " joined");
  socket.join("chat");

  socket.on("message", data => {
    socket.to("chat").emit("message", data);
    console.log(socket.id, data);
  });

  socket.on("disconnect", () => {
    sockets.splice(sockets.indexOf(socket), 1);
  });

  socket.on("count", (data, ack) => {
    ack(sockets.length);
  });
});

app.get("/list/:path", function (req, res) {
  var items = fs.readdirSync("static/" + req.params.path);
  var data = {};
  for (var item of items) {
    var stat = fs.statSync("static/" + req.params.path + "/" + item);
    data[item] = stat.isFile() ? "file" : "dir";
  }
  res.json(data);
});
app.get("/list", function (req, res) {
  res.json({ home: "dir" });
});
