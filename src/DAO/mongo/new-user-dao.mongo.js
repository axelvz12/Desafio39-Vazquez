const CustomError = require('../../handlers/CustomError')
const EErrors = require('../../handlers/errors/enum-errors')
const TYPE_ERRORS = require('../../handlers/errors/types-errors')
const Users = require('../../models/user.model')
const winstonLogger = require('../../utils/winston/devLogger.winston')

class NewUserDao {
    async checkUser (email) {        
        try {
            const userCheck = await Users.findOne({ email: email })
            return userCheck
        } catch (error) {
            throw error
        }
    }

    async createNewUser (userData) {
        try {
            const newUser = await Users.create(userData)
            return newUser
        } catch (error) {
            throw error
        }
    }

    async getUser (username) {
        try {
            const userRaw = await Users.findOne({ email: username })

            if (!userRaw) {
                CustomError.createError({
                    name: TYPE_ERRORS.BAD_REQUEST,
                    cause: 'Se ingresaron datos incorrectos de usuario',
                    message: 'Invalid user or password',
                    code: EErrors.BAD_REQUEST    
                })
            }
            const {_id, first_name, last_name, age, email, role, carts, password} = userRaw

            let cartOk
            for (const cart of carts) {
                if (cart.status) {
                    cartOk = cart.cart.toString()
                }
            }
            
            const user = {
                id: _id.toString(),
                first_name,
                last_name,
                age,
                email,
                role,
                cart: cartOk,
                password
            }

            return user
        } catch (error) {
            throw error
            
        }
    }

    async getUserById (id) {
        try {
            const userById = await Users.findById(id)
            return userById
        } catch (error) {
            throw error
        }
    }

    async addCartToUserDao (cartId, userId) {
        try {
            const user = await Users.findById(userId)
            for (const cart of user.carts) {
                let cartIdUser = cart.cart.toString()

                if (cartId === cartIdUser) {
                    return 'cart Exists'
                }
            }
            
            user.carts.push({cart: cartId})
            const userUpdated = await Users.updateOne({_id: user._id}, user)

            
        } catch (error) {
            throw error
        }
    }

    async addTicketToUserDao (userId, ticketId) {
        try {
            const user = await Users.findById(userId)
            
            user.tickets.push({ticket: ticketId})
            const userUpdated = await Users.updateOne({_id: user._id}, user)

            winstonLogger.info(`FROM new-user-dao.mongo: Ticket id ${ticketId} inserted to user ${userId}`)
        } catch (error) {
            throw error
        }
    }

    async updateUserDao (userId, user) {
        try {

            const userUpdated = await Users.updateOne({ _id: userId}, user)
            
            return 'user updated'
        } catch (error) {
            throw error
        }
    }

    async checkUserCartDao (userId) {
        try {
            const user = await Users.findById(userId)
            const { carts } = user
            const cartOk = carts.find(obj => obj.status === true)
            if (cartOk) {
                const cartId = cartOk.cart.toString()
                return cartId
                } else {return null}
        } catch (error) {
            throw error
        }
    }
}

module.exports = NewUserDao