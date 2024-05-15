const passport = require('passport')
const local = require('passport-local')

const GithubStrategy = require('passport-github2')
const Users = require('../models/user.model')
const {createHash, useValidPassword} = require('../utils/crypt-password.util')
const { ghClientId, ghClientSecret } = require('./passport-github.config')
const { createUser, getUserById, getUser } = require('../services/users.service')
const CustomError = require('../handlers/CustomError')
const TYPE_ERRORS = require('../handlers/errors/types-errors')
const EErrors = require('../handlers/errors/enum-errors')
const generateUserErrorInfo = require('../handlers/errors/generate-user-error-info')
const winstonLogger = require('../utils/winston/devLogger.winston')





const LocalStrategy = local.Strategy

const initializePassport = () => {
    passport.use(
        'register',
        new LocalStrategy(
            {passReqToCallback: true, usernameField: 'email'},
            async (req, username, password, done) => {
                try {
                    const { first_name, last_name, age, email } = req.body
                    
                    if (!first_name || !last_name || !email) {
                        console.log('Se llama a error desde passport register')
                        CustomError.createError({
                            name: TYPE_ERRORS.BAD_REQUEST,
                            cause: generateUserErrorInfo({ first_name, last_name, email}),
                            message: 'Error trying to create User',
                            code: EErrors.BAD_REQUEST
                        })

                    }


                    const user = await Users.findOne({ email: username })
                    if (user) {
                        console.log('Se genera error desde el checkeo de mail')
                        CustomError.createError({
                            name: TYPE_ERRORS.BAD_GATEWAY,
                            cause: 'User exists',
                            message: 'The user mail exists',
                            code: EErrors.BAD_REQUEST
                        })
                    }
                    
                    const newUserInfo = { 
                        first_name,
                        last_name,
                        email,
                        age,
                        password: createHash(password),
                    }
                    
            

                    const newUser = await createUser(newUserInfo)

                    return done(null, newUser)

                } catch (error) {
                    done(error)
                }
            }
        )
    )
    passport.serializeUser((user, done) => {
        
        winstonLogger.info(`Se ha serializado al usuario ${user.email}`)
        //console.log('Se ha serializado al usuario '+user.email)
        done(null, user.id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = getUserById(id)
        done(null, user)
    })
}

passport.use(
    'login', 
    new LocalStrategy(
            { usernameField: 'email' },
            async (username, password, done) => {
                try {
                    
                    const user = await getUser(username)

                    if (!user) {

                        console.log('Se genera error desde el checkeo de mail desde passport.login')
                        CustomError.createError({
                        name: TYPE_ERRORS.BAD_REQUEST,
                        cause: 'User Invalid',
                        message: 'The user does not exists',
                        code: EErrors.BAD_REQUEST,
                        })
                        }
                            
                    if (!useValidPassword(user, password)) {
                        CustomError.createError({
                            name: TYPE_ERRORS.BAD_REQUEST,
                            cause: 'Password does not match',
                            message: 'Datos Incorrectos',
                            code: EErrors.BAD_REQUEST,
                        })
 
                    }

                    return done(null, user)
                } catch (error) {
                    done(error)
                }                            
            }
    )
)


passport.use(
    'github',
    new GithubStrategy(
        {
            clientID: ghClientId,
            clientSecret: ghClientSecret,
            callback: 'http://localhost:3000/auth/githubcallback',
        },
        async (accessToken, RefreshToken, profile, done) => {
            try {

                const { id, login, name, email } = profile._json

                console.log(id, login, name, email)

                const user = await Users.findOne({ email: email })

                if (!user) {
                    const newUserInfo = {
                        first_name: name,
                        email,
                        githubId: id,
                        githubUsername: login,
                    }

                    const newUser = await Users.create(newUserInfo)

                    return done(null, newUser)
                }

            return done(null, user)
            } catch (error) {
                done(error)
            }
        }
    )
)


module.exports = initializePassport