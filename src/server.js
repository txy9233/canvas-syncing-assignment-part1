const http = require('http');
const fs = require('fs');
const socketio = require('socket.io');

const PORT = process.env.PORT || process.env.NODE_PORT || 3000;

const index = fs.readFileSync(`${__dirname}/../client/index.html`);

let score = 0;


const onRequest = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const server = http.createServer(onRequest);
server.listen(PORT);

const io = socketio(server);

const onJoin = (sock) => {
  const socket = sock;

  socket.join('room1');
};


const onDisconnect = (sock) => {
  const socket = sock;

  socket.on('disconnect', () => {
    socket.leave('room1');
  });
};


const onMsg = (sock) => {
  const socket = sock;

  socket.on('updateScore', (data) => {
    score += data;

    io.sockets.in('room1').emit('updated', score);
  });
};


io.sockets.on('connection', (socket) => {
  onJoin(socket);
  onMsg(socket);
  onDisconnect(socket);
});


console.log(`listening on port ${PORT}`);
