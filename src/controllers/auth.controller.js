const {Router} = require('express')
const Users = require('../models/user.model')
//const adminUsers = require('../configs/admin-users')
const passport = require('passport')
const CustomError = require('../handlers/CustomError')
const TYPE_ERRORS = require('../handlers/errors/types-errors')
const EErrors = require('../handlers/errors/enum-errors')



const router = Router()



const url = `/products`

// ENDPOINT PARA EL LOGIN

router.post(
    '/login',
    passport.authenticate('login'),
    async (req, res, next) => {
    try {

    
        const sessionUser = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            role: req.user.role,
        }

        if (req.user.cart) {
            sessionUser.cart = req.user.cart
        } else { sessionUser.cart = null}

        req.session.user = sessionUser

        res.json({status: 'Success', message: 'Login Succesfull', url})

    } catch (error) {
        next(error)
    }

}
)

router.get('/fail-login', (req, res) => {
    res.json({status:'error', message: 'Login Failed' })
})


// Endpoint que redirecciona a github para autenticar el usuario

router.get(
    '/github',
    passport.authenticate('github', { scope: ['user: email']}, (req, res) => {})
)


// Endpoint que nos retorna github con el usuario autenticado y sus datos

router.get(
    '/githubcallback',
    passport.authenticate('github', { failureRedirect: '/auth/fail-login' }),
    (req, res) => {
        req.session.user = req.user
        res.redirect('/products') 
    }
)




module.exports = router