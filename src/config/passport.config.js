const passport = require('passport');
const passportJWT = require('passport-jwt');
const UserDaoMongo = require('../dao/managers/MDB/userDao.mongo');
const sessionsService = new UserDaoMongo();
const GithubStrategy = require('passport-github2')

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const initializePassport = () => {
    
    
    
    const cookieExtractor = req => {
        let token = null;
        if (req && req.cookies) {
            token = req.cookies['jwt'];
            console.log('Token extraído de la cookie:', token);
        }
        return token;
    };
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: 'palabrasecretaparatoken',
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload);
        } catch (error) {
            return done(error);
        }
    }));
    passport.use('github', new GithubStrategy({
        clientID: 'Iv1.2a8ed0b0c9586810',
        clientSecret: '452e8160a12ca8d50ced1321a8379c8538cd48b5',
        callbackURL: 'http://localhost:8080/session/githubcallback',
        // Desactivar el uso de sesiones
        session: false,
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let userResponse = await sessionsService.getUsersBy({ email: profile._json.email });
            console.log('Correo electrónico del perfil de GitHub:', profile._json.email);
            console.log('Respuesta del servicio getUsersBy:', userResponse);

            if (userResponse.status === 'success' && userResponse.users.length > 0) {
                // Usuario encontrado, utiliza el primer usuario del array
                let user = userResponse.users[0];
                console.log('Usuario existente:', user);
                return done(null, user);
            } else {
                // Si no hay usuarios, crea uno nuevo
                let newUser = {
                    first_name: profile._json.name,
                    last_name: profile._json.name,
                    email: profile._json.email,
                    password: 'hola'
                };

                let result = await sessionsService.createUser(newUser);
                console.log('Nuevo usuario creado:', result);
                return done(null, result);
            }
        } catch (error) {
            console.error('Error en la estrategia de GitHub:', error);
            return done(error);
        }
    }));

};


module.exports = { 
    initializePassport
};
