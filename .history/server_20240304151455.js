const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Store for messages
const db = [];

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Handle user connections
io.on('connection', (socket) => {
  console.log('User connected');

  // Listen for user joining the chat
  socket.on('join', (username) => {
    // Add user to the chat
    socket.username = username;
    io.emit('message', { type: 'notification', text: `${username} has joined the chat` });
  });

  // Listen for new messages
  socket.on('message', (message) => {
    // Save the message to the store
    db.push({ username: socket.username, text: message });

    // Broadcast the message to all connected clients
    io.emit('message', { type: 'user', username: socket.username, text: message });
  });

  // Listen for user disconnect
  socket.on('disconnect', () => {
    io.emit('message', { type: 'notification', text: `${socket.username} has left the chat` });
    console.log('User disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 3010;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
