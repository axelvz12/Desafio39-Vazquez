// RUTA RELATIVA: src/routes/purchase.routes.js
const fs = require('fs');
const path = require('path'); // Asegúrate de importar el módulo path
const express = require('express');
const router = express.Router();
const { sendMail } = require('../utils/sendEmail');
const PurchaseManager = require('../dao/managers/MDB/PurchaseManager');
const UserController = require('../controllers/user.controller');
const userController = new UserController();


const purchaseManager = new PurchaseManager();


router.post('/', async (req, res) => {
  const { userId } = req.body; 
  console.log('ID del usuario:', userId);

  if (!userId) {
    return res.status(400).json({ error: 'Se requiere el ID de usuario para realizar la compra.' });
  }

  try {
    const ticket = await purchaseManager.createPurchaseTicket(userId);
    if (ticket) {
    
      const user = await userController.getUserById({ params: { id: userId } });
    
    if (!user || !user.user || !user.user.email) {
      return res.status(404).json({ error: 'Usuario no encontrado o correo electrónico no disponible.' });
    }

      const userEmail = user.user.email; 

      // Lee el archivo HTML de confirmación de compra
      const htmlPath = path.join(__dirname, '..', 'html', 'confirmationEmail.html');
      const htmlContent = fs.readFileSync(htmlPath, 'utf8');

      // Reemplaza las variables dinámicas en el HTML
      const processedHtml = htmlContent.replace('{{ ticketId }}', ticket.id);

      // Envía el correo electrónico
      const subject = 'Confirmación de Compra';
      await sendMail(userEmail, subject, processedHtml);


      return res.status(201).json({ ticket });
    } else {
      return res.status(500).json({ error: 'No se pudo completar la compra.' });
    }
  } catch (error) {
    console.error('Error al realizar la compra:', error);
    return res.status(500).json({ error: 'Ocurrió un error al procesar la compra.' });
  }
});




module.exports = router;