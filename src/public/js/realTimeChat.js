document.addEventListener('DOMContentLoaded', () => {
  const chatMessages = document.getElementById('chatMessages');
  const chatForm = document.getElementById('chatForm');
  const userInput = document.getElementById('user');
  const messageInput = document.getElementById('message');
  const btnGoToIndex = document.getElementById('btnGoToIndex');

  const socket = io();

  socket.on('chats', (chats) => {
    chats.forEach((chat) => {
      addChatToChatList(chat);
    });
  });

  socket.on('chat', (newChat) => {
    addChatToChatList(newChat);
  });

  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = userInput.value;
    const message = messageInput.value;

    if (user && message) {
      socket.emit('chatMessage', { user, message });
      userInput.value = '';
      messageInput.value = '';
    } else {

    }
  });

  btnGoToIndex.addEventListener('click', () => {
    window.location.href = '/'; 
  });

  function addChatToChatList(chat) {
    const chatElement = document.createElement('p');
    chatElement.textContent = `${chat.user}: ${chat.message}`;
    chatMessages.appendChild(chatElement);
  }
});
