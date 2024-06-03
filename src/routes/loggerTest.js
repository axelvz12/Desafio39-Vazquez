const express = require('express');

const { logger } = require('../utils/logger');
 // Importa el logger configurado
const router = express.Router();

router.get('/', (req, res) => {
  logger.debug('Debug log (should appear in development)');
  logger.http('HTTP log (should appear in development)');
  logger.info('Info log (should appear in both development and production)');
  logger.warning('Warning log (should appear in both development and production)');
  logger.error('Error log (should appear in both development and production)');
  logger.fatal('Fatal log (should appear in both development and production)');
  res.send('Logs registrados, revisa la consola y el archivo errors.log si estás en producción.');
});

module.exports = router;
