const UserDaoMongo = require('../dao/managers/MDB/userDao.mongo');
const { createHash, isValidPassword } = require('../utils/hashBcrypt');
const { generateToken } = require('../utils/jsonwebtoken');
const passport = require('passport');
const { UserDto } = require('../dto/userDto');
const logger = require('../utils/logger').logger;

class SessionController {
  constructor() {
    this.sessionsService = new UserDaoMongo();
  }

  async register(req, res) {
    try {
      const { first_name, last_name, age, email, password } = req.body;

      let userResponse = await this.sessionsService.getUsersBy({ email });
      let user = userResponse.status === 'success' ? userResponse.users[0] : null;

      if (user) {
        return res.status(400).send({ status: 'error', message: 'El usuario ya existe' });
      }

      const newUser = new UserDto({ first_name, last_name, age, email, password: createHash(password),
        cart: undefined });


      await this.sessionsService.createUser(newUser);

      res.redirect('/login');
    } catch (error) {
      logger.error('Error en el registro:', error);
      res.status(500).send({ status: 'error', message: 'Error en el registro' });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;

    try {
      const userResponse = await this.sessionsService.getUsersBy({ email });

      if (!userResponse || userResponse.users.length === 0) {
        return res.status(401).send('No coincide las credenciales');
      }

      const user = userResponse.users[0];

      if (!isValidPassword(password, user.password)) {
        return res.status(401).send('No coincide las credenciales');
      }

      const token = generateToken({
        first_name: user.first_name,
        last_name: user.last_name,
        id: user._id,
        email: user.email,
        role: user.rol
      });

      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.redirect('/session/current');
    } catch (error) {
      logger.error('Error en el inicio de sesión:', error);
      res.status(500).send({ status: 'error', message: 'Error en el inicio de sesión', error: error.message });
    }
  }

  async current(req, res) {
    const user = req.user;
    if (user.role === 'admin') {
      res.redirect('/');
    } else {
      res.redirect('/products');
    }
  }

  async githubCallback(req, res, next) {
    passport.authenticate('github', { failureRedirect: '/session/login' }, async (err, user) => {
      try {
        if (err || !user) {
          logger.error('Fallo en la autenticación de GitHub');
          return res.redirect('/session/login');
        }

        const token = generateToken({
          first_name: user.first_name,
          last_name: user.last_name,
          id: user._id,
          email: user.email,
          role: user.rol
        });

        res.cookie('jwt', token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        });

        res.redirect('/session/current');
      } catch (error) {
        logger.error('Error en la autenticación de GitHub:', error);
        res.redirect('/session/login');
      }
    })(req, res, next);
  }

  async logout(req, res) {
    res.clearCookie('jwt');
    res.redirect('/login');
  }
}

module.exports = SessionController;
