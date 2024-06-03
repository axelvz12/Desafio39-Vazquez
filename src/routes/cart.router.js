// cart.router.js

const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { authTokenMiddleware } = require('../utils/jsonwebtoken');

router.get('/', authTokenMiddleware, cartController.getCart);
router.post('/add-to-cart', authTokenMiddleware, cartController.addToCart);


module.exports = router;
