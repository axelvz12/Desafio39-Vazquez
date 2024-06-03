// RUTA DE ACCESO: src/routes/productRoutes.js

const express = require('express');
const ProductController = require('../controllers/product.controller');
const { auth } = require('../middleware/authetication.middleware');
const verifyRole = require('../middleware/verifyRole.middleware');

const router = express.Router();

const productController = new ProductController();


router.get('/', auth, verifyRole('admin'), async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const { products, hasPrevPage, hasNextPage, prevPage, nextPage } = await productController.getProducts(page);
        const pagination = { hasPrevPage, hasNextPage, prevPage, nextPage, page };
        res.render('inventario', { products, pagination });
    } catch (error) {
        console.error('Error al obtener los datos de los productos:', error);
        res.status(500).send('Error interno del servidor');
    }
});

router.route('/:pid')
    .get(productController.getProductById.bind(productController)) // Obtener un  por su ID
    .put(productController.updateProduct.bind(productController)) // Actualizar un producto existente por su ID
    .delete(productController.deleteProduct.bind(productController)); // Eliminar un usuario existente por su ID

router.route('/')
    .post(productController.createProduct.bind(productController)); // Crear un nuevo producto

// router.get('/search', productController.getProductBy.bind(productController)); // Obtener productos según los parámetros de búsqueda

module.exports = router;

