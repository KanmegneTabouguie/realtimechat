// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
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
    socket.emit('chatHistory', fileOperations.readChatFile());
  });

  // Listen for message deletion
  socket.on('deleteMessage', (messageId) => {
    // Find the message in the chat history and remove it
    const deletedMessageIndex = fileOperations.readChatFile().findIndex((msg) => msg.id === messageId);
    if (deletedMessageIndex !== -1) {
      const deletedMessage = fileOperations.readChatFile().splice(deletedMessageIndex, 1)[0];
      // Broadcast the deletion event to all connected clients
      io.emit('messageDeleted', { messageId, username: deletedMessage.username });
      // Update the chat file with the modified history
      fileOperations.writeChatFile(fileOperations.readChatFile());
    }
  });

  // Listen for message edit
  socket.on('editMessage', (editedMessage) => {
    // Find the message in the chat history and update it
    const editedMessageIndex = fileOperations.readChatFile().findIndex((msg) => msg.id === editedMessage.id);
    if (editedMessageIndex !== -1) {
      fileOperations.readChatFile()[editedMessageIndex].text = editedMessage.text;
      // Broadcast the edit event to all connected clients
      io.emit('messageEdited', editedMessage);
      // Update the chat file with the modified history
      fileOperations.writeChatFile(fileOperations.readChatFile());
    }
  });
});

// Start the server
const PORT = process.env.PORT || 3022;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
