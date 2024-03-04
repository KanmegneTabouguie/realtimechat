// server.js

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const { db, insertUser, saveMessageToDatabase } = require('./db');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files from the public directory
app.use(express.static('public'));

// Socket.io Connection
io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for 'register user' event from a client
  socket.on('register user', (username) => {
    // Store the user in the database
    insertUser(username, socket.id);

    // Emit a 'user registered' event back to the client
    socket.emit('user registered', username);
  });

  // Listen for 'chat message' events from a client
  socket.on('chat message', (data) => {
    const { senderId, receiverId, message } = data;

    // Business Logic: Save the chat message to the database
    // In this example, we assume the receiverId is the user's ID stored in the 'users' table
    // You might need to implement a proper user authentication and retrieve the user's ID based on their username
    saveMessageToDatabase(senderId, receiverId, message);

    // Business Logic: Perform additional actions based on the chat message
    // For example, notify other users or update the UI
    io.to(receiverId).emit('chat message', { senderId, message });

    // Business Logic: Additional actions based on the chat message
    // Example: Notify the sender that the message was successfully received
    socket.emit('chat message sent', { receiverId, message });
  });

  // ... (other socket event handlers)

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start server
const PORT = process.env.PORT || 3006;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
