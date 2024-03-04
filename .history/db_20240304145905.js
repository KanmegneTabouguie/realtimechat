// db.js

const mysql = require('mysql2');

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
    createUsersTable(); // Create the 'users' table if it doesn't exist
    createMessagesTable(); // Create the 'messages' table if it doesn't exist
  }
});

// Function to create the 'users' table
function createUsersTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      socketId VARCHAR(255) NOT NULL
    )
  `;

  db.query(createTableQuery, (err, results) => {
    if (err) {
      console.error('Error creating users table:', err.message);
    } else {
      console.log('Users table created or already exists');
    }
  });
}

// Function to create the 'messages' table
function createMessagesTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      senderId INT NOT NULL,
      receiverId INT NOT NULL,
      message TEXT NOT NULL,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (senderId) REFERENCES users(id),
      FOREIGN KEY (receiverId) REFERENCES users(id)
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
