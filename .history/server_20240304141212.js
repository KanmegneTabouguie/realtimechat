// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// MongoDB Connection
mongoose.connect('mongodb+srv://kanmegnea:zpBOVYf8VY5o2vE4@learning.o67hjvh.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Socket.io Connection
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle chat events here (sending/receiving messages, etc.)

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
