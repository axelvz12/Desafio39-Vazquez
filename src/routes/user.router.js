const { Router } = require('express');
const UserController = require('../controllers/user.controller');
const { auth } = require('../middleware/authetication.middleware');
const verifyRole = require('../middleware/verifyRole.middleware');

const router = Router();
const userController = new UserController();

router.get('/', auth, verifyRole('admin'), async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const { users, hasPrevPage, hasNextPage, prevPage, nextPage } = await userController.getUsers(page);
        const pagination = { hasPrevPage, hasNextPage, prevPage, nextPage, page };
        console.log('Pagination:', pagination);
        res.render('users', { users, pagination });
    } catch (error) {
        console.error('Error al obtener los datos de los usuarios:', error);
        res.status(500).send('Error interno del servidor');
    }
});

router.route('/:uid')
    .get(userController.getUserById.bind(userController)) // Obtener un usuario por su ID
    .put(userController.updateUser.bind(userController)) // Actualizar un usuario existente por su ID
    .delete(userController.deleteUser.bind(userController)); // Eliminar un usuario existente por su ID

router.route('/')
    .post(userController.createUser.bind(userController)); // Crear un nuevo usuario

router.get('/search', userController.getUsersBy.bind(userController)); // Obtener usuarios según los parámetros de búsqueda

module.exports = router;