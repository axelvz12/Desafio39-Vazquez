// Import the correct model for the "messages" collection
const { Messages } = require('../../models/chat.model');

class ChatManager {
  // ...

  async getMessages() {
    try {
      const messages = await Messages.find();
    } catch (error) {
      throw error;
    }
  }
  
  async postMessage(user, messageText) {
    try {
      const newMessage = new Messages({ user, message: messageText });
      await newMessage.save();
      return newMessage;
    } catch (error) {
      throw error;
    }
  }

  // ...
}

module.exports = ChatManager;
