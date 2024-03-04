$(document).ready(function () {
    const socket = io();
    const userId = Math.random().toString(36).substr(2, 9); // Unique identifier for the user (demo purpose)
  
    // Function to add a message to the chat
    function addMessage(message, senderId) {
      const isCurrentUser = senderId === userId;
      const senderClass = isCurrentUser ? 'current-user' : 'other-user';
      
      const messageElement = $('<div>').addClass(`message ${senderClass}`).text(`${message} (${isCurrentUser ? 'You' : 'Other user'})`);
      $('#chat-messages').append(messageElement);
    }
  
    // Event listener for the Send button
    $('#send-button').click(function () {
      const message = $('#message-input').val();
      
      if (message.trim() !== '') {
        // Emit a 'chat message' event to the server
        socket.emit('chat message', { message, senderId: userId });
  
        // Clear the input field
        $('#message-input').val('');
      }
    });
  
    // Listen for 'chat message' events from the server
    socket.on('chat message', function (data) {
      addMessage(data.message, data.senderId);
    });
  
    // Handle additional chat-related events and features as needed
  });
  