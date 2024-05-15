const { Router } = require('express')
const Carts = require('../services/carts.service')
const Users = require('../services/users.service')
const CustomError = require('../handlers/CustomError')
const TYPE_ERRORS = require('../handlers/errors/types-errors')
const EErrors = require('../handlers/errors/enum-errors')
const { privateAccess } = require('../middlewares')
const Sales = require('../services/sales.service')
const errorLibrary = require('../constants/errors-library.constant')


const router = Router()

router.get('/', async (req, res) => {
    const carts = await Carts.carts ()
    res.json({payload: carts})
})


router.get('/purchase/:id', privateAccess, async (req, res, next) => {
    try {

        req.logger.http(`${req.method} - ${req.url} / ${req.headers['user.agent']} - ${new Date().toUTCString()}`)
        const {id} = req.params

        const { _id, cartId, cartDocs, user} = await Carts.cartFindId(id)

        const { first_name, last_name, email} = await Users.getUserById(user)
        
        const userData = {
            first_name,
            last_name,
            email
        }

        const cartSend = JSON.stringify(cartDocs)

        res.render('cart-finish', {_id, cartId, cartSend, userData})
    } catch (error) {
        next(error)
    }
})


router.get('/:id', async (req, res) => {
    try {

        const {id} = req.params
    
        const { _id, cartId,  cartDocs, user} = await Carts.cartFindId(id)

        //const tickets = await Users.getUserTickets(user)

        res.render('carts', {_id, cartId, cartDocs, user})
       
        
    } catch (error) {
        console.log(error)
    }
})

router.post('/', async (req, res) => {
    try {

       const {userId} = req.body

        const newCart = await Carts.addCart(userId)

        res.json({payload: newCart})

    } catch (error) {
        console.log({error})
    }
})

router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params
    try {

        const productAdded = await Carts.addProdToCart(cid, pid)
        res.json({payload: productAdded})
    } catch (error) {
        console.log(error)    
    }
})

// ENDPOINT PARA AGREGAR CANTIDAD DE PRODUCTOS A UN CARRITO DESDE REQ.BODY

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { quantity, prodId } = req.body


        const prodAdded = await Carts.addQuantToCart(id, prodId, quantity)
        
        res.json({payload: prodAdded, message: prodAdded})

        
    } catch (error) {
        console.log({error})        
    }
})


router.patch('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params
    const { userId } = req.body
    console.log(userId)

    if (cid === 'new') {
        try {
            const { _id } = await Carts.addCart(userId)

            const newCartId = _id.toString()
            const { cartId, prodMessage } = await Carts.addProdToCart(newCartId, pid)


            res.json({payload: prodMessage})
        } catch (error) {
            console.log(error)    
        }
    } else {
        try {
            const productAdded = await Carts.addProdToCart(cid, pid)
            res.json({payload: productAdded})
        } catch (error) {
            console.log(error)    
        }
    }
})



router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params

        const deletedCart = Carts.deleteCart(id)
        res.json({payload: deletedCart})
        
    } catch (error) {
        console.log({error})        
    }
})


router.delete('/:id/product/:pid', async (req, res) => {
    try {
        const { id, pid } = req.params

        const deletedProdFromCart = await Carts.deleteProductFromCart(id, pid)
        res.json({payload: deletedProdFromCart})
        
    } catch (error) {
        console.log({error})        
    }
})

// ENDPOINT PARA TERMINAR LA COMPRA

router.post('/purchase/:cid', privateAccess, async (req, res, next) => {
    try {
        const { cid } = req.params

        const { cart, email } = req.session.user
        const user = await Users.getUser(email)
        const userCartId = await Users.checkUserCart(user.id)

        if (!cid === cart) {
            CustomError.createError(errorLibrary.ERROR_403.carts_controller_purchase)
        }

        const {cartFinished, newCartId} = await Carts.finishCart(userCartId)

        const saleData = await Sales.purchase(user, cartFinished)

        req.session.user.cart = newCartId
        

        const {_id} = saleData
        const saleId = _id.toString()
        
        res.status(200).json({ticketId: saleId, message: 'Sale Succesful'})
        
    } catch (error) {
        next(error)
    }
})


module.exports = router
