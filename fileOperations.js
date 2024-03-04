// fileOperations.js
const fs = require('fs');
const path = require('path');

const chatFilePath = path.join(__dirname, 'chat.json');

function readChatFile() {
  try {
    const chatFileData = fs.readFileSync(chatFilePath, 'utf8');
    return JSON.parse(chatFileData);
  } catch (error) {
    console.error('Error reading chat file:', error.message);
    return [];
  }
}

function writeChatFile(data) {
  try {
    const chatFileData = JSON.stringify(data, null, 2);
    fs.writeFileSync(chatFilePath, chatFileData, 'utf8');
  } catch (error) {
    console.error('Error writing to chat file:', error.message);
  }
}

module.exports = {
  readChatFile,
  writeChatFile,
};
