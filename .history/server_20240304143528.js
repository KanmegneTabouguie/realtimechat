const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mysql = require('mysql2');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// MySQL Connection
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'yvan2021',
  database: 'realtimechat',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
  } else {
    console.log('Connected to MySQL');
    // Create the 'messages' table if it doesn't exist
    createMessagesTable();
  }
});

// Function to create the 'messages' table
function createMessagesTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      senderId VARCHAR(255) NOT NULL,
      receiverId VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.query(createTableQuery, (err, results) => {
    if (err) {
      console.error('Error creating messages table:', err.message);
    } else {
      console.log('Messages table created or already exists');
    }
  });
}

// Socket.io Connection
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle chat events here (sending/receiving messages, etc.)

  // Listen for 'chat message' events from a client
  socket.on('chat message', (data) => {
    const { senderId, receiverId, message } = data;

    // Store the message in the database
    saveMessageToDatabase(senderId, receiverId, message);

    // Emit the message to the receiver
    io.to(receiverId).emit('chat message', { senderId, message });
  });

  // Handle private messages between users
  socket.on('private message', (data) => {
    const { senderId, receiverId, message } = data;

    // Store the private message in the database
    saveMessageToDatabase(senderId, receiverId, message);

    // Emit the private message to the receiver
    io.to(receiverId).emit('private message', { senderId, message });
  });

  // Join a room (used for private messaging)
  socket.on('join room', (room) => {
    socket.join(room);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Function to save a message to the 'messages' table
function saveMessageToDatabase(senderId, receiverId, message) {
  const insertMessageQuery = `
    INSERT INTO messages (senderId, receiverId, message)
    VALUES (?, ?, ?)
  `;

  db.query(insertMessageQuery, [senderId, receiverId, message], (err, results) => {
    if (err) {
      console.error('Error inserting message:', err.message);
    } else {
      console.log('Message inserted successfully:', results);
    }
  });
}

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
