const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const token = req.cookies['jwt'];

    if (!token) {
        console.log('Token no encontrado');
        return res.status(401).json({ status: 'error', message: 'No autorizado' });
    }

    try {
        const decodedUser = jwt.verify(token, 'palabrasecretaparatoken');
        req.user = decodedUser;  // Agregar la información del usuario al objeto de solicitud
        next();
    } catch (error) {
        console.log('Error al verificar el token:', error.message);
        return res.status(401).json({ status: 'error', message: 'Token inválido' });
    }
}

module.exports = { auth };