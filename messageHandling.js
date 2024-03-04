// messageHandling.js
const { v4: uuidv4 } = require('uuid');

function createMessage(username, text) {
  return {
    id: uuidv4(),
    username,
    text,
    timestamp: new Date(),
  };
}

module.exports = {
  createMessage,
};
