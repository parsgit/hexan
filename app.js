var events = require('events');
var eventEmitter = new events.EventEmitter();

const open = require('open');
const express = require('express');
const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

exports.express = express;
exports.http = http;
exports.app = app;
exports.io = io;

exports.port = 3000;
exports.server = 'localhost';

app.get('/socket.io/socket.io.js',(req,res)=>{
  res.sendFile('node_modules/socket.io-client/dist/socket.io.js',{ root: process.cwd() });
})

exports.run =(autoOpenBrowser=true)=> {
  http.listen(exports.port, () => {

    console.log(`app listening at http://${exports.server}:${exports.port}`);

      if (autoOpenBrowser) {
        exports.openBrowser();
      }
    });
};

let countuser = 0;

exports.onconnect =(callback=false)=>{
  io.on('connection', (socket) => {
    countuser++;

    if(callback){
      callback(socket);
    }

    ondisconnect(socket);
  });
}

exports.ondisconnect =(callback=false)=> {
  eventEmitter.on('disconnect', callback);
}

function ondisconnect(socket) {
  socket.on('disconnect', () => {
    countuser--;

    eventEmitter.emit('disconnect',socket);

    if (countuser<=0) {
      setTimeout(function () {
        if (countuser<=0)
        exports.close();
      },2000);

    }
  });
}


exports.openBrowser=()=>{
  (async () => {
    // Opens the URL in the default browser.
    await open(`http://${exports.server}:${exports.port}`);
    })();
}


exports.setStatic=(_path,name)=>{
  app.use(name, express.static(path.join(_path ,name)));
}


exports.close=()=>{
  process.exit();
}
