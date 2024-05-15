const {Router} = require('express')
const Users = require('../models/user.model')
const {createUser} = require('../services/users.service')


const passport = require('passport')
const CustomError = require('../handlers/CustomError')
const generateUserErrorInfo = require('../handlers/errors/generate-user-error-info')
const EErrors = require('../handlers/errors/enum-errors')
const TYPE_ERRORS = require('../handlers/errors/types-errors')


/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Get all users
 *     description: Retrieve a list of all users
 *     responses:
 *       '200':
 *         description: A list of users
 */

const router = Router()

// ENDPOINT PARA CREAR USUARIO

const url = '/products'


router.post(
    '/', 
    passport.authenticate('register'),
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


        res
            .status(201)
            .json({status: 'Success', message: 'User has been register', url})

    } catch (error) {
        next(error)
    }

})








module.exports = router