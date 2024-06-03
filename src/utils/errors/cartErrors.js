const CustomError = require('./customError');

const cartErrors = {
    ADD_PRODUCT_ERROR: new CustomError({
        name: 'AddProductError',
        message: 'Error al agregar el producto al carrito.',
        code: 500
    }),
    GET_CART_ERROR: new CustomError({
        name: 'GetCartError',
        message: 'Error al cargar el carrito.',
        code: 500
    })
};

module.exports = cartErrors;