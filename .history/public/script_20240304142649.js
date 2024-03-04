$(document).ready(function () {
    const socket = io();
  
    // Function to add a message to the chat
    function addMessage(message) {
      $('#chat-messages').append('<div class="message">' + message + '</div>');
    }
  
    // Event listener for the Send button
    $('#send-button').click(function () {
      const message = $('#message-input').val();
      
      if (message.trim() !== '') {
        // Emit a 'chat message' event to the server
        socket.emit('chat message', message);
  
        // Clear the input field
        $('#message-input').val('');
      }
    });
  
    // Listen for 'chat message' events from the server
    socket.on('chat message', function (message) {
      addMessage(message);
    });
  
    // Handle additional chat-related events and features as needed
  });
  