// --------------------REPOSITORY-------------------------
const UserRepository = require('./user.repository');
const ProductRepository = require('./product.repository');

// --------------------DAO-------------------------
const { UserDao } = require('../dao/factory');
const { ProductDao } = require('../dao/factory');


const userService = new UserRepository(new UserDao());
const productService = new ProductRepository(new ProductDao());



module.exports = {
    productService,
    userService

};