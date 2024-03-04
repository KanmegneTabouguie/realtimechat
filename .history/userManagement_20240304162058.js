// userManagement.js
const onlineUsers = new Set();

function addUser(username) {
  onlineUsers.add(username);
}

function removeUser(username) {
  onlineUsers.delete(username);
}

function getOnlineUsers() {
  return Array.from(onlineUsers);
}

module.exports = {
  addUser,
  removeUser,
  getOnlineUsers,
};
