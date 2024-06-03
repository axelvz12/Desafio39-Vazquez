const { faker } = require('@faker-js/faker');

const generateMockProduct = () => {
    const product = {
        title: faker.commerce.productName(),
        category: faker.commerce.department(),
        description: faker.commerce.productDescription(),
        price: faker.number.float({ min: 1, max: 1000, multipleOf: 0.01 }),
        thumbnail: faker.image.url(),
        code: faker.number.int({ min: 100, max: 1000 }),
        stock: faker.number.int({ min: 0, max: 100 }),
    };
    return product;
};

const generateMockProducts = (quantity) => {
    const products = [];
    for (let i = 0; i < quantity; i++) {
        const product = generateMockProduct();
        products.push(product);
    }
    return products;
};

module.exports = {
    generateMockProducts, 
};