const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const fs = require('fs');
const nodemailer = require('nodemailer');

server.listen(process.env.PORT || 80, function () {
  console.log("Server started");
});

app.use(express.static("static"));

const sockets = [];
var mailTimeout = false;
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

  socket.on("summon", (message, ack) => {
    if (mailTimeout) {
      ack && ack("Couldn't summon the master of this realm : too many tries, retry later.");
      return;
    }

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'auth.smtp.1and1.fr',
        port: 465,
        auth: {
            user: "summon@terry.gonguet.com",
            pass: "FuckMySQL"
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"George Summon" <summon@terry.gonguet.com>', // sender address
        to: 'terry@gonguet.com', // list of receivers
        subject: 'You\'ve been summoned to the human realm', // Subject line
        text: 'ca2-imd-wos.herokuapp.com\n' + message, // plain text body
        html: '<a href="https://ca2-imd-wos.herokuapp.com/" target="_blank">Portal</a><br><p>' + message + '</p>' // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          ack && ack("Cannot summon the master of this plane.");
            return console.log(error);
        }
        mailTimeout = true;
        setTimeout(function () {
          mailTimeout = false;
        }, 30 * 60 * 1000);
        console.log('Message sent: %s', info.messageId);
        ack && ack("The master of this domain has been summoned.");
    });
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
