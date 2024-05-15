
const mongoose = require('mongoose')

const userCollection = 'user'

const userSchema = new mongoose.Schema({
	first_name: String,
	last_name: String,
	age: Number,
	email: {
	type: String,
	unique: true
	},
	password: String,
	role: {
		type: String,
		enum: ['cliente', 'admin'],
		default: 'cliente',
	},
	//githubId: Number,
	//githubUsername: String,
	carts: {
        type: [
            {
            cart: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'cart',
            },
			status: {
				type: Boolean,
				default: true
			},
            },
        ],
    },
	tickets: {
        type: [
            {
            ticket: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'ticket',
            },
			status: {
				type: Boolean,
				default: true
			},
            },
        ],
    },
})


const Users = mongoose.model(userCollection, userSchema)


module.exports = Users