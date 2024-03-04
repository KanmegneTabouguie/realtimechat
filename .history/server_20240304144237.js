// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const { db, saveMessageToDatabase } = require('./db'); // Import the database functions

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files from the public directory
app.use(express.static('public'));

// Socket.io Connection
io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for 'chat message' events from a client
  socket.on('chat message', (data) => {
    const { senderId, receiverId, message } = data;

    // Placeholder: Handle the chat message event
    console.log(`Received chat message from ${senderId} to ${receiverId}: ${message}`);

    // Store the message in the database
    saveMessageToDatabase(senderId, receiverId, message);

    // Emit the message to the receiver
    io.to(receiverId).emit('chat message', { senderId, message });
  });

  // Handle private messages between users
  socket.on('private message', (data) => {
    const { senderId, receiverId, message } = data;

    // Placeholder: Handle the private message event
    console.log(`Received private message from ${senderId} to ${receiverId}: ${message}`);

    // Store the private message in the database
    saveMessageToDatabase(senderId, receiverId, message);

    // Emit the private message to the receiver
    io.to(receiverId).emit('private message', { senderId, message });
  });

  // Join a room (used for private messaging)
  socket.on('join room', (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
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
