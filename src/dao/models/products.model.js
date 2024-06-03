// RUTA DE ACCESO: src/dao/models/products.model.js

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')

const productsCollection = 'products';

const productsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  stock: {
    type: Number,
    required: true,
  },
});


productsSchema.plugin(mongoosePaginate)

const productModel = mongoose.model(productsCollection, productsSchema);

module.exports = {
  productModel,
};
