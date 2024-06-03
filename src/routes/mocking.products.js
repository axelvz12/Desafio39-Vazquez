// productRoutes.js
const express = require('express');
const router = express.Router();
const { generateMockProducts } = require('../controllers/mocking.product'); 

router.get('/', (req, res) => {
    try {
        const products = generateMockProducts(100); // Genera 100 productos aleatorios
        res.status(200).json(products);
    } catch (error) {
        console.error('Error generating mock products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;