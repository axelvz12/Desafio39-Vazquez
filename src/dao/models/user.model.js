const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')

const usersCollection = 'users';

const usersSchema = new mongoose.Schema({
    first_name: {
        type: String,
        index: true
    },
    last_name: {
        type: String,
        required: true
    },
    full_name: {
        type: String,
        required: true
    },
    age: {
        type: Number
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts'
    }

});

usersSchema.pre('findOne', function () {
    this.populate('cart');
  });

  usersSchema.plugin(mongoosePaginate)

const userModel = mongoose.model(usersCollection, usersSchema);

module.exports = {
    userModel
};
