
const {Router} = require('express')
const { publicAccess, privateAccess } = require('../middlewares')
const adminUsers = require('../configs/admin-users.config')
const { getUser } = require('../services/users.service')
const CustomError = require('../handlers/CustomError')
const TYPE_ERRORS = require('../handlers/errors/types-errors')
const EErrors = require('../handlers/errors/enum-errors')
const Sales = require('../services/sales.service')

const router = Router()

// ENDPOINT PARA LOGIN

router.get('/login', publicAccess, (req, res) => {
    res.render('login.handlebars')    
})

// ENDPOINT PARA CREAR CUENTA

router.get('/signup', publicAccess, (req, res) => {
    res.render('signup.handlebars')    
})

// ENDPOINT PARA ENTRAR EL PERFIL. 

// Solo se puede ingresar si hay un session iniciada.

router.get('/profile', privateAccess, async (req, res) => {
    const { email } = req.session.user

    res.redirect(`/profile/${email}`)
})



// ENPOINT PARA ENTRAR AL PERFIL

router.get('/profile/:emailUser', privateAccess, async (req, res, next) => {
    try {

        const { emailUser } = req.params

        const user = await getUser(emailUser)

        const emailSession = req.session.user.email

        if (emailSession !== emailUser ) {
            CustomError.createError({
                name: TYPE_ERRORS.FORBIDDEN,
                cause: 'Invalid user in the profile',
                message: 'Forbidden Access',
                code: EErrors.FORBIDDEN
            })
        }

        if (emailUser === adminUsers.email) {
            const user = adminUsers
            return res.render('profile.handlebars', {user})    

        }
    
        res.render('profile.handlebars', {user})    
    } catch (error) {
        next(error)
    }
})



router.get('/ticket/:tid', privateAccess, async (req, res) => {
    try {
        const { tid } = req.params
        const emailSession = req.session.user.email
        const { first_name, cart } = await getUser(emailSession)
        
        const saleData = await Sales.saleFindById(tid)

        res.render('ticket', {saleData, first_name, cart})
        
    } catch (error) {
        console.log(error)
    }

})



module.exports = router