const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(process.env.PORT || 80, function () {
  console.log("Server started");
});

app.use(express.static("static"));

io.on('connection', function (socket) {
  console.log(socket.id + " joined");
  socket.join("chat");
  socket.on("message", data => {
    socket.to("chat").emit("message", data);
    console.log(socket.id, data);
  });
});
