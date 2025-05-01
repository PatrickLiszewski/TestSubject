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
let currentRadius = "50%";
let prevShape = "circle";

// Serve static files from "public" folder
app.use(express.static('public'));

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.emit('updateColor', currentColor);
  socket.emit('updateSize', currentSize);
  socket.emit('updateShape', currentRadius, prevShape);

  socket.on('changeColor', (color) => {
    console.log('Color changed to:', color);
    currentColor = color;
    io.emit('updateColor', color);
  });

  socket.on('sendSize', (size) => {
    console.log('Time to change size!');
    currentSize = size;
    io.emit('updateSize', size);
  });

  socket.on('morphShape', (radius, lastShape) => {
    console.log('Shifting shape!');
    currentRadius = radius;
    prevShape = lastShape;
    io.emit('updateShape', radius, lastShape);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});