// db.js

const mysql = require('mysql2');

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

// Function to insert a user into the 'users' table
function insertUser(username, socketId) {
  const insertUserQuery = `
    INSERT INTO users (username, socketId)
    VALUES (?, ?)
  `;

  db.query(insertUserQuery, [username, socketId], (err, results) => {
    if (err) {
      console.error('Error inserting user:', err.message);
    } else {
      console.log('User inserted successfully:', results);
    }
  });
}

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

module.exports = { db, insertUser, saveMessageToDatabase };
