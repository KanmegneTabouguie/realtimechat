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
    // Save the message to the store with timestamp
    const newMessage = {
      username: socket.username,
      text: message.text,
      timestamp: new Date(),
    };
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

  // Listen for user typing
  socket.on('typing', () => {
    // Broadcast the typing event to all connected clients
    socket.broadcast.emit('userTyping', { username: socket.username, isTyping: true });
  });

  // Listen for user stopping typing
  socket.on('stopTyping', () => {
    // Broadcast the stop typing event to all connected clients
    socket.broadcast.emit('userTyping', { username: socket.username, isTyping: false });
  });

  // Listen for chat history request
  socket.on('requestHistory', () => {
    // Send the chat history to the user who requested it
    socket.emit('chatHistory', db);
  });

  // Listen for message deletion
  socket.on('deleteMessage', (messageId) => {
    // Find the message in the chat history and remove it
    const deletedMessageIndex = db.findIndex((msg) => msg.id === messageId);
    if (deletedMessageIndex !== -1) {
      const deletedMessage = db.splice(deletedMessageIndex, 1)[0];
      // Broadcast the deletion event to all connected clients
      io.emit('messageDeleted', { messageId, username: deletedMessage.username });
      // Update the chat file with the modified history
      updateChatFile();
    }
  });

  // Listen for message edit
  socket.on('editMessage', (editedMessage) => {
    // Find the message in the chat history and update it
    const editedMessageIndex = db.findIndex((msg) => msg.id === editedMessage.id);
    if (editedMessageIndex !== -1) {
      db[editedMessageIndex].text = editedMessage.text;
      // Broadcast the edit event to all connected clients
      io.emit('messageEdited', editedMessage);
      // Update the chat file with the modified history
      updateChatFile();
    }
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
const PORT = process.env.PORT || 3018;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
