$(document).ready(function () {
    const socket = io();
    const userId = Math.random().toString(36).substr(2, 9); // Unique identifier for the user (demo purpose)
  
    // Function to add a message to the chat
    function addMessage(message, senderId, isPrivate) {
      const isCurrentUser = senderId === userId;
      const senderClass = isCurrentUser ? 'current-user' : 'other-user';
      const messageElement = $('<div>').addClass(`message ${senderClass}`).text(`${isCurrentUser ? 'You' : 'Other user'}: ${message}`);
  
      if (isPrivate) {
        messageElement.addClass('private-message');
      }
  
      $('#chat-messages').append(messageElement);
    }
  
    // Event listener for the Send button
    $('#send-button').click(function () {
      const message = $('#message-input').val();
      const receiverId = $('#receiver-id').val(); // Assuming you have a way to input the receiver's ID
  
      if (message.trim() !== '' && receiverId.trim() !== '') {
        // Emit a 'private message' event to the server
        socket.emit('private message', { senderId: userId, receiverId, message });
  
        // Clear the input field
        $('#message-input').val('');
      }
    });
  
    // Listen for 'private message' events from the server
    socket.on('private message', function (data) {
      addMessage(data.message, data.senderId, true);
    });
  
    // Handle additional chat-related events and features as needed
  });
  