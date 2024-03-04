// script.js

$(document).ready(function () {
    const socket = io();
  
    // Function to append messages to the chat window
    function appendMessage(sender, message) {
      $('#chat-messages').append(`<p><strong>${sender}:</strong> ${message}</p>`);
    }
  
    // Listen for 'chat message' events from the server
    socket.on('chat message', function (data) {
      appendMessage(data.senderId, data.message);
    });
  
    // Listen for 'private message' events from the server
    socket.on('private message', function (data) {
      appendMessage(`Private message from ${data.senderId}`, data.message);
    });
  
    // Listen for 'chat message sent' events from the server
    socket.on('chat message sent', function (data) {
      // Handle additional actions based on the successful sending of a chat message
      console.log(`Chat message successfully sent to ${data.receiverId}`);
    });
  
    // Listen for 'private message sent' events from the server
    socket.on('private message sent', function (data) {
      // Handle additional actions based on the successful sending of a private message
      console.log(`Private message successfully sent to ${data.receiverId}`);
    });
  
    // Handle click event on the send button
    $('#send-button').click(function () {
      const messageInput = $('#message-input');
      const message = messageInput.val().trim();
  
      if (message !== '') {
        // Replace 'receiverId' with the actual receiver's socket.id
        const receiverId = 'receiverId';
  
        // Emit a 'chat message' event to the server
        socket.emit('chat message', { senderId: socket.id, receiverId, message });
  
        // Clear the message input field
        messageInput.val('');
      }
    });
  });
  