const { Router } = require('express'); // Asegúrate de requerir 'express'
const { sendMail } = require('../utils/sendEmail.js');

const router = Router();

router.get('/mail', (req, res) => {
    const destinatario = 'projectodigitalgen@gmail.com';
    const subject = 'Email de prueba ecommer Coder';
    const html = '<div><h1>Este es un mail de prueba</h1></div>'; // Corregí el cierre de la etiqueta div

    sendMail(destinatario, subject, html)
        .then(() => {
            res.send('Email enviado');
        })
        .catch((error) => {
            console.error('Error enviando el email:', error);
            res.status(500).send('Error enviando el email');
        });
});

module.exports = router;
