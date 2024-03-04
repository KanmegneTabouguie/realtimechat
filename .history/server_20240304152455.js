const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// File path for storing chat messages
const chatFilePath = path.join(__dirname, 'chat.json');

// Read existing chat messages from the file
let db = [];
try {
  const chatFileData = fs.readFileSync(chatFilePath, 'utf8');
  db = JSON.parse(chatFileData);
} catch (error) {
  console.error('Error reading chat file:', error.message);
}

// Store for online users
const onlineUsers = new Set();

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Handle user connections
io.on('connection', (socket) => {
  console.log('User connected');

  // Listen for user joining the chat
  socket.on('join', (username) => {
    // Add user to the chat
    socket.username = username;
    onlineUsers.add(username);

    // Update the user list for all connected clients
    io.emit('updateUserList', Array.from(onlineUsers));

    // Notify everyone about the new user
    io.emit('message', { type: 'notification', text: `${username} has joined the chat` });
  });

  // Listen for new messages
  socket.on('message', (message) => {
    // Save the message to the store
    const newMessage = { username: socket.username, text: message };
    db.push(newMessage);

    // Broadcast the message to all connected clients
    io.emit('message', { type: 'user', ...newMessage });

    // Update the chat file with the new message
    updateChatFile();
  });

  // Listen for user disconnect
  socket.on('disconnect', () => {
    onlineUsers.delete(socket.username);

    // Update the user list for all connected clients
    io.emit('updateUserList', Array.from(onlineUsers));

    // Notify everyone about the user leaving
    io.emit('message', { type: 'notification', text: `${socket.username} has left the chat` });
    console.log('User disconnected');
  });
});

// Update the chat file with the current chat messages
function updateChatFile() {
  try {
    const chatFileData = JSON.stringify(db, null, 2);
    fs.writeFileSync(chatFilePath, chatFileData, 'utf8');
  } catch (error) {
    console.error('Error writing to chat file:', error.message);
  }
}

// Start the server
const PORT = process.env.PORT || 3011;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
