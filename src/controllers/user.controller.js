const { userService } = require('../repositories/index');
const { createHash } = require('../utils/hashBcrypt');
const CustomError = require("../utils/errors/customError");
const generateUserErrorInfo = require("../utils/errors/userErrors");
const errorsDictionary = require("../utils/errors/errorsDictionary");
const logger = require('../utils/logger').logger;

class UserController {
    constructor() {
        this.service = userService;
    }

    async getUsers(page = 1) {
        try {
            const options = { page, limit: 10 };
            const result = await this.service.getUsersPaginate(options);
            return result;
        } catch (error) {
            logger.error('Error al obtener los usuarios:', error); 
            throw new Error('Error interno del servidor');
        }
    }

    getUsersBy = async (req, res) => {
        const query = req.query;
        try {
            const result = await this.service.getUsersBy(query);
            res.send(result);
        } catch (error) {
            logger.error('Error al obtener usuarios por consulta:', error); 
            res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
        }
    }

    createUser = async (req, res, next) => {
        try {
            const { first_name, last_name, age, email, password } = req.body;

            if (!first_name || !last_name || !email) {

                throw new CustomError(
                    "User creation error",
                    {
                        cause: generateUserErrorInfo({ first_name, last_name, email }),
                        code: errorsDictionary.INVALID_TYPES_ERROR
                    }
                );
            }
            const newUser = ({ first_name, last_name, age, email, password: createHash(password) });
        
            const result = await this.service.createUser(newUser);
            return res.send(result);
        } catch (error) {
            logger.error('Error al crear usuario:', error);
            next(error);

        }
    }

    updateUser = async (req, res) => {
        const { uid } = req.params;
        const userData = req.body;
        try {
            const result = await this.service.updateUser(uid, userData);
            res.send(result);
        } catch (error) {
            logger.error(`Error al actualizar usuario con ID ${uid}:`, error);
            res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
        }
    }

    deleteUser = async (req, res) => {
        const { uid } = req.params; 
        try {
            const result = await this.service.deleteUser(uid); 
            res.send(result);
        } catch (error) {
            logger.error(`Error al eliminar usuario con ID ${uid}:`, error);
            res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
        }
    }

    async getUserById(req, res) {
        const { id } = req.params;
        try {
          const user = await this.service.getUserById(id);
    
          if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
          }
    
          return user; 
        } catch (error) {
            logger.error(`Error al obtener usuario por ID ${id}:`, error);
          throw new Error('Error interno del servidor');
        }
      }
    }
module.exports = UserController;
