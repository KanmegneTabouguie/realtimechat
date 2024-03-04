// script.js
const socket = io();
let username = '';
let editingMessageId = null;

// Function to prompt for a username
function promptForUsername() {
  const userInput = prompt('Enter your name:');
  if (userInput && userInput.trim() !== '') {
    username = userInput.trim();
    // Send username to the server
    socket.emit('join', username);
    setupEventListeners();
  } else {
    console.error('Invalid username. Please refresh and enter a valid username.');
  }
}

// Function to handle typing event
function handleTyping() {
  socket.emit('typing');
}

// Function to format timestamp
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours}:${minutes}`;
}

// Function to send a message
function sendMessage() {
  const messageInput = $('#m');
  const message = messageInput.val();
  if (message.trim() !== '') {
    if (editingMessageId) {
      // If editing, send an edit request
      socket.emit('editMessage', { id: editingMessageId, text: message });
      editingMessageId = null;
    } else {
      // If not editing, send a regular message
      socket.emit('message', { text: message });
    }
    messageInput.val('');
  }
}

// Function to request chat history
function requestChatHistory() {
  socket.emit('requestHistory');
}

// Function to delete a message
function deleteMessage(messageId) {
  socket.emit('deleteMessage', messageId);
}

// Function to edit a message
function startEditing(messageId, messageText) {
  editingMessageId = messageId;
  const editMessageInput = $('#m');
  editMessageInput.val(messageText);

  // Show the edit message container
  $('#edit-message-container').show();
}

// Function to confirm the edit
function confirmEdit() {
  const editMessageInput = $('#m');
  const editedMessage = editMessageInput.val();
  sendMessage();
  // Hide the edit message container
  $('#edit-message-container').hide();
}

// Function to cancel the edit
function cancelEdit() {
  editingMessageId = null;
  // Hide the edit message container
  $('#edit-message-container').hide();
}

// Setup event listeners after getting the username
function setupEventListeners() {
  // Listen for message deletion
  socket.on('messageDeleted', (data) => {
    // Implement UI changes if needed
    console.log(`Message deleted by ${data.username}: ${data.messageId}`);
  });

  // Listen for message edit
  socket.on('messageEdited', (editedMessage) => {
    // Implement UI changes if needed
    console.log(`Message edited by ${editedMessage.username}: ${editedMessage.id} - ${editedMessage.text}`);
  });

  // Receive messages from the server
  socket.on('message', (msg) => {
    const messages = $('#messages');
    if (msg.type === 'notification') {
      messages.append($('<li>').text(`- ${msg.text}`));
    } else {
      const listItem = $('<li>').html(`<strong>${msg.username}:</strong> ${msg.text} <span class="timestamp">${formatTimestamp(msg.timestamp)}</span>`);
      if (msg.username === username) {
        const deleteButton = $('<button>').text('Delete').click(() => deleteMessage(msg.id));
        const editButton = $('<button>').text('Edit').click(() => startEditing(msg.id, msg.text));
        listItem.append(deleteButton, editButton);
      }
      messages.append(listItem);
    }
  });

  // Listen for user list updates
  socket.on('updateUserList', (users) => {
    const onlineUsersList = $('#online-users');
    onlineUsersList.empty();
    users.forEach((user) => {
      onlineUsersList.append($('<li>').text(user));
    });
  });

  // Listen for user typing indicator
  socket.on('userTyping', (data) => {
    const typingIndicator = $('#typing-indicator');
    if (data.isTyping) {
      typingIndicator.text(`${data.username} is typing...`);
    } else {
      typingIndicator.text('');
    }
  });

  // Listen for chat history
  socket.on('chatHistory', (history) => {
    const messages = $('#messages');
    messages.empty();
    history.forEach((msg) => {
      if (msg.type === 'notification') {
        messages.append($('<li>').text(`- ${msg.text}`));
      } else {
        const listItem = $('<li>').html(`<strong>${msg.username}:</strong> ${msg.text} <span class="timestamp">${formatTimestamp(msg.timestamp)}</span>`);
        if (msg.username === username) {
          const deleteButton = $('<button>').text('Delete').click(() => deleteMessage(msg.id));
          const editButton = $('<button>').text('Edit').click(() => startEditing(msg.id, msg.text));
          listItem.append(deleteButton, editButton);
        }
        messages.append(listItem);
      }
    });
  });
}

// Prompt for username when the script is loaded
promptForUsername();
