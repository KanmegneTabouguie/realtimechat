// public/script.js

// Establish a connection to the server
const socket = io();

// Listen for 'user registered' event from the server
socket.on('user registered', (username) => {
  // Display a welcome message or perform other actions when the user is registered
  $('#chat-messages').append($('<li>').text(`Welcome, ${username}!`));
});

// Listen for 'chat message' event from the server
socket.on('chat message', (data) => {
  // Display the chat message in the chat container
  $('#chat-messages').append($('<li>').text(`${data.senderId}: ${data.message}`));
});

// Listen for 'chat message sent' event from the server
socket.on('chat message sent', (data) => {
  // Perform actions when the chat message is successfully sent
  // For example, update the UI or provide a confirmation message
  console.log(`Message sent to ${data.receiverId}: ${data.message}`);
});

// Click event listener for the Send button
$('#send-button').click(() => {
  const message = $('#message-input').val();

  // Emit the 'chat message' event to the server
  socket.emit('chat message', {
    senderId: 'senderUserId', // Replace with the actual sender's user ID
    receiverId: 'receiverUserId', // Replace with the actual receiver's user ID
    message: message,
  });

  // Clear the message input field
  $('#message-input').val('');
});

// ... (other event listeners)
