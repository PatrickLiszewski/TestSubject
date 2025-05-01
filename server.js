'use strict';

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Properties of the Test Subject are saved here as global variables
let currentColor = 'red';
let currentSize = '100px';

// Serve static files from "public" folder
app.use(express.static('public'));

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.emit('updateColor', currentColor);
  socket.emit('changeSize', currentSize);

  socket.on('changeColor', (color) => {
    console.log('Color changed to:', color);
    currentColor = color;
    io.emit('updateColor', color);
  });

  socket.on('sendSize', (size) => {
    console.log('time to change size!');
    currentSize = size;
    io.emit('changeSize', size);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});