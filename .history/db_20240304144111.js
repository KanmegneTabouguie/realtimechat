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
    createMessagesTable();
  }
});

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

module.exports = {
  db,
  saveMessageToDatabase,
};
