// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const { db, saveMessageToDatabase } = require('./db'); // Import the database functions

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Socket.io Connection
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle chat events here (sending/receiving messages, etc.)

  // Listen for 'chat message' events from a client
  socket.on('chat message', (data) => {
    const { senderId, receiverId, message } = data;

    // Store the message in the database
    saveMessageToDatabase(senderId, receiverId, message);

    // Emit the message to the receiver
    io.to(receiverId).emit('chat message', { senderId, message });
  });

  // Handle private messages between users
  socket.on('private message', (data) => {
    const { senderId, receiverId, message } = data;

    // Store the private message in the database
    saveMessageToDatabase(senderId, receiverId, message);

    // Emit the private message to the receiver
    io.to(receiverId).emit('private message', { senderId, message });
  });

  // Join a room (used for private messaging)
  socket.on('join room', (room) => {
    socket.join(room);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start server
const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
