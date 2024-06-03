const winston = require('winston');
const { configObject } = require('../config/config');

const customLevels = {
  levels: {
    fatal: 0,
    error:1,
    warning: 2,
    info: 3,
    debug: 4,
    http: 5
},
colors: {
    fatal: 'red',
    error: 'yellow',
    warning: 'yellow',
    info: 'blue',
    debug: 'white',
    http: 'blue'
}
};

// Agregar colores personalizados a los niveles
winston.addColors(customLevels.colors);

// Configuración del transporte para consola
const consoleTransport = new winston.transports.Console({
  level: configObject.modo === 'desarrollo' ? 'debug' : 'info', // Mostrará 'debug' en desarrollo e 'info' en producción
  format: winston.format.combine(
    winston.format.colorize({ all: true }), 
    winston.format.simple() 
  )
});

// Configuración del transporte para archivo de errores
const fileTransport = new winston.transports.File({
  filename: './errors.log',
  level: 'error', // Guardará solo 'error' y 'fatal' en el archivo 'errors.log'
  format: winston.format.simple()
});
// Crear logger
const logger = winston.createLogger({
  levels: customLevels.levels,
  transports: [consoleTransport, fileTransport]
});
logger.info(`El nivel de logging configurado es: ${consoleTransport.level}`);
logger.info(`Logger mode: ${configObject.modo}`); 

const addLogger = (req, res, next) => {
  req.logger = logger; 
  req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`); // Registra un log de info
  next(); 
};

module.exports = {
  addLogger,
  logger
};
