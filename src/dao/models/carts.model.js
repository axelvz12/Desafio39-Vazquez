// RUTA DE ACCESO: src/dao/models/carts.model.js

const { Schema, model } = require('mongoose');

const collection = 'carts';

const cartsSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'products',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  total: {
    type: Number,
    default: 0,
  },
});

cartsSchema.pre('findOne', function () {
  this.populate('products.productId');
});

const cartModel = model(collection, cartsSchema);

module.exports = {
  cartModel,
};
