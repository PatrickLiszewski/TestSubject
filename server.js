'use strict';

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from "public" folder
app.use(express.static('public'));

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('changeColor', (color) => {
    console.log('Color changed to:', color);
    // Broadcast to all clients (including sender)
    io.emit('updateColor', color);
  });

  socket.on('bigger', (size) => {
    console.log('time to get bigger!');
    io.emit('makeBig', size);
  });

  socket.on('smaller', (size) => {
    console.log('time to get smaller!');
    io.emit('makeSmall', size);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});