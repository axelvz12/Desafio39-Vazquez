const { Router } = require('express');
const SessionController = require('../controllers/session.controller');
const { authTokenMiddleware } = require('../utils/jsonwebtoken');
const passport = require('passport');

const router = Router();
const sessionController = new SessionController();

router.post('/register', sessionController.register.bind(sessionController));
router.get('/failregister', async (req, res) => {
  res.send({ error: 'falla en el register' });
});

router.post('/login', sessionController.login.bind(sessionController));
router.get('/current', authTokenMiddleware, sessionController.current.bind(sessionController));
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/githubcallback', sessionController.githubCallback.bind(sessionController));
router.get('/faillogin', async (req, res) => {
  res.send({ error: 'falla en el register' });
});
router.get('/logout', sessionController.logout.bind(sessionController));

module.exports = router;