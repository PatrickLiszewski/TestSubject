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
let darkModeOn = false;
let glowOn = false;
let rainbowMode = false;

// Serve static files from "public" folder
app.use(express.static('public'));

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.emit('updateColor', currentColor);
  socket.emit('updateSize', currentSize);
  socket.emit('updateShape', currentRadius, prevShape);
  socket.emit('setDarkMode', darkModeOn, glowOn);
  socket.emit('setRainbow', rainbowMode);

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

  socket.on('newMessage', (msgText) => {
    console.log('Displaying message!')
    io.emit('displayMessage', msgText);
  });  

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });

  socket.on("toggleDarkMode", (enabledDark, enabledGlow) => {
    console.log("Dark mode set to:", enabledDark);
    darkModeOn = enabled;
    glowOn = enabledGlow;
    io.emit("setDarkMode", darkModeOn, glowOn);
  });

  socket.on('toggleRainbow', (enabled) => {
    rainbowMode = enabled;
    io.emit('setRainbow', rainbowMode);
  });

});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});