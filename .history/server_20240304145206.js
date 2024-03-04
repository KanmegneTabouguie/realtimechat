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

    // Business Logic: Save the chat message to the database
    saveMessageToDatabase(senderId, receiverId, message);

    // Business Logic: Perform additional actions based on the chat message
    // For example, notify other users or update the UI
    io.to(receiverId).emit('chat message', { senderId, message });

    // Business Logic: Additional actions based on the chat message
    // Example: Notify the sender that the message was successfully received
    socket.emit('chat message sent', { receiverId, message });
  });

  // Handle private messages between users
  socket.on('private message', (data) => {
    const { senderId, receiverId, message } = data;

    // Business Logic: Save the private message to the database
    saveMessageToDatabase(senderId, receiverId, message);

    // Business Logic: Perform additional actions based on the private message
    // For example, notify other users or update the UI
    io.to(receiverId).emit('private message', { senderId, message });

    // Business Logic: Additional actions based on the private message
    // Example: Notify the sender that the message was successfully received
    socket.emit('private message sent', { receiverId, message });
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
const PORT = process.env.PORT || 3005;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
