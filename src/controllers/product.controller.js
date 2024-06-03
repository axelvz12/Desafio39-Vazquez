// RUTA DE ACCESO: src/controllers/productController.js
const { productService } = require('../repositories/index');
const CustomError = require("../utils/errors/customError");
const generateProductErrorInfo = require("../utils/errors/productErrors");
const errorsDictionary = require("../utils/errors/errorsDictionary");
const logger = require('../utils/logger').logger;

class ProductController {
    constructor() {
        this.service = productService;
    }

    async createProduct(req, res, next) {
        try {
            const { title, category, description, price, thumbnail, code, stock } = req.body;

            if (!title || !category || !description || !price || !thumbnail || !code || !stock) {
                throw new CustomError(
                    "Product creation error",
                    {
                        cause: generateProductErrorInfo({ title, category, description, price, thumbnail, code, stock }),
                        code: errorsDictionary.INVALID_TYPES_ERROR
                    }
                );
            }

            const newProduct = await this.service.createProduct({
                title,
                category,
                description,
                price,
                thumbnail,
                code,
                stock
            });

            res.status(201).json(newProduct);
        } catch (error) {
            next(error); 
        }
    }

    async getProducts(page = 1) {
        try {
            const options = { page, limit: 10 };
            const result = await this.service.getProductsPaginate(options);
            return result;
        } catch (error) {
            logger.error('Error al obtener los usuarios:', error);
            throw new Error('Error interno del servidor');
        }
    }
    
    async getProductById(req, res) {
        try {
            const { id } = req.params;
            const product = await this.service.getProductById(id);
            if (product) {
                res.status(200).json(product);
            } else {
                res.status(404).json({ message: 'Producto no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el producto', error: error.message });
        }
    }

    updateProduct = async (req, res) => {
        const { pid } = req.params;
        const productData = req.body;
        try {
            const result = await this.service.updateProduct(pid, productData);
            res.send(result);
        } catch (error) {
            res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
        }
    }

    deleteProduct = async (req, res) => {
        const { pid } = req.params; 
        try {
            const result = await this.service.deleteProduct(pid); 
            res.send(result);
        } catch (error) {
            logger.error('Error al eliminar producto:', error);
            res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
        }
    }

    async increaseProductStock(req, res) {
        try {
            const { id } = req.params;
            const { quantity } = req.body;
            const result = await this.service.increaseProductStock(id, quantity);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error al aumentar el stock del producto', error: error.message });
        }
    }

    async reduceProductStock(req, res) {
        try {
            const { id } = req.params;
            const { quantity } = req.body;
            const result = await this.service.reduceProductStock(id, quantity);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error al reducir el stock del producto', error: error.message });
        }
    }
}

module.exports = ProductController;
