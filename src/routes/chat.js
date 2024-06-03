// En el archivo chat.js
const express = require('express');
const router = express.Router();
const Messages = require('../dao/models/chat.model'); 
const { auth } = require('../middleware/authetication.middleware');
const verifyRole = require('../middleware/verifyRole.middleware');



// Ruta GET para mostrar la vista del chat
router.get('/', auth, verifyRole('user'), async (req, res) => {
  try {
    // Obtener todos los mensajes (puedes ajustar esta lógica según tus necesidades)
    const messages = await Messages.find({});

    // Renderizar la vista 'chat.handlebars' y pasar los mensajes como contexto
    res.render('chat', { messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los mensajes' });
  }
});

// Ruta POST para agregar un nuevo mensaje
router.post('/nchat', async (req, res) => {
  try {
    const messageData = req.body;

    // Crea un nuevo documento de mensaje en la base de datos
    const newMessage = await Messages.create(messageData);

    res.json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el mensaje' });
  }
});

module.exports = router;
