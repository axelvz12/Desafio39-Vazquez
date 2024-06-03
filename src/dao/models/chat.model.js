// RUTA DE ACCESO: src/dao/models/chat.model.js


const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  user: String,
  message: String,
});

const Messages = mongoose.model('messages', messageSchema);


module.exports = Messages; 
