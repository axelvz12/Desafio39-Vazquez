// RUTA DE ACCESO: src/repositories/productRepository.js

const { ProductDto } = require('../dto/productDto');

class ProductRepository {
    constructor(productDao) {
        this.dao = productDao; // Instancia de ProductDao según la configuración
    }

    async createProduct({ title, category, description, price, thumbnail, code, stock }) {
        const newProduct = new ProductDto({
            title,
            category,
            description,
            price,
            thumbnail,
            code,
            stock
        });

        return this.dao.addProduct(newProduct);
    }

    async getProductsPaginate({ page = 1, limit = 10 }) {
        try {
            const options = { page, limit };
            const result = await this.dao.getProductsPaginate(options);

            return result;
        } catch (error) {
            console.error('Error al obtener el listado paginado de usuarios:', error);
            throw new Error('Error al obtener el listado paginado de usuarios');
        }
    }

    async getProductsBy(query) {
        return this.dao.getProductsBy(query);
    }

    async updateProduct(pid, productToUpdate) {
        return this.dao.updateProduct(pid, productToUpdate);
    }

    async deleteProduct(productId) {
        return this.dao.deleteProduct(productId);
    }

    async getProductById(id) {
        return this.dao.getProductById(id);
    }

    async increaseProductStock(productId, quantity) {
        return this.dao.increaseProductStock(productId, quantity);
    }

    async reduceProductStock(productId, quantity) {
        return this.dao.reduceProductStock(productId, quantity);
    }
}

module.exports = ProductRepository;
