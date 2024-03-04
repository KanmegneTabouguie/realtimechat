// script.js

$(document).ready(() => {
    let socket;
    let username;
  
    // Function to append a message to the chat window
    function appendMessage(sender, message) {
      $('#chat-messages').append(`<p><strong>${sender}:</strong> ${message}</p>`);
    }
  
    // Prompt the user to enter a username
    while (!username) {
      username = prompt('Enter your username:');
    }
  
    // Connect to the server and register the user
    socket = io();
    socket.emit('register user', username);
  
    // Handle the 'user registered' event
    socket.on('user registered', (registeredUsername) => {
      console.log(`Registered as: ${registeredUsername}`);
      // Now that the user is registered, show the chat container
      $('#chat-container').show();
  
      // Handle form submission (sending messages)
      $('form').submit(() => {
        const messageInput = $('#message-input');
        const message = messageInput.val().trim();
  
        if (message !== '') {
          // Replace 'receiverId' with the actual receiver's user ID or username
          const receiverId = 'user123';
  
          // Emit a 'chat message' event to the server
          socket.emit('chat message', { senderId: socket.id, receiverId, message });
  
          // Display the sent message in the chat window
          appendMessage(username, message);
  
          // Clear the message input field
          messageInput.val('');
        }
  
        return false; // Prevent the form from submitting and reloading the page
      });
  
      // Handle the 'chat message' event from the server
      socket.on('chat message', (data) => {
        const { senderId, message } = data;
        // Replace 'receiverId' with the actual receiver's user ID or username
        const receiverId = 'user123';
  
        // Display the received message in the chat window
        appendMessage(senderId, message);
      });
  
      // Handle the 'chat message sent' event from the server (optional)
      socket.on('chat message sent', (data) => {
        const { receiverId, message } = data;
        // You can add additional logic here, such as displaying a notification to the sender
      });
    });
  });
  