// RUTA DE ACCESO: src/dto/product.dto.js

class ProductDto {
    constructor(product) {
        console.log('Creando instancia de ProductDto con:', product);
        
        this.title = product.title;
        this.category = product.category;
        this.description = product.description;
        this.price = product.price;
        this.thumbnail = product.thumbnail;
        this.code = product.code;
        this.stock = product.stock;
    }
}

module.exports = {
    ProductDto
};