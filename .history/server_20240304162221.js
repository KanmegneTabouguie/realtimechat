// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const userManagement = require('./userManagement');
const messageHandling = require('./messageHandling');
const fileOperations = require('./fileOperations');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Handle user connections
io.on('connection', (socket) => {
  console.log('User connected');

  // Listen for user joining the chat
  socket.on('join', (username) => {
    userManagement.addUser(username);

    // Update the user list for all connected clients
    io.emit('updateUserList', userManagement.getOnlineUsers());

    // Notify everyone about the new user
    io.emit('message', { type: 'notification', text: `${username} has joined the chat` });
  });

  // Listen for new messages
  socket.on('message', (message) => {
    const newMessage = messageHandling.createMessage(socket.username, message.text);
    fileOperations.readChatFile().push(newMessage);

    // Broadcast the message to all connected clients
    io.emit('message', { type: 'user', ...newMessage });

    // Update the chat file with the new message
    fileOperations.writeChatFile(fileOperations.readChatFile());
  });

  // Listen for user disconnect
  socket.on('disconnect', () => {
    userManagement.removeUser(socket.username);

    // Update the user list for all connected clients
    io.emit('updateUserList', userManagement.getOnlineUsers());

    // Notify everyone about the user leaving
    io.emit('message', { type: 'notification', text: `${socket.username} has left the chat` });
    console.log('User disconnected');
  });

  // ... (rest of the code remains unchanged)
});

// ... (rest of the code remains unchanged)
