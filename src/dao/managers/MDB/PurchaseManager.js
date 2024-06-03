// RUTA RELATIVA: src/dao/managers/MDB/PurchaseManager.js


const CartManager = require('./CartManager');
const ProductManager = require('./ProductManager');
const UserDaoMongo = require('./userDao.mongo');
const Ticket = require('../../models/ticket.model'); 

class PurchaseManager {
  constructor() {
    this.cartManager = new CartManager();
    this.productManager = new ProductManager();
    this.UserDaoMongo = new UserDaoMongo();
  }

  //------------------------------------CREAR TICKET DE COMPRA AL HACER CLIC EN EL BOTÓN------------------------------------//
  async createPurchaseTicket(userId) {
    try {
        const cart = await this.cartManager.getCartByUserId(userId);

        if (!cart || cart.products.length === 0) {
            console.log("No hay productos en el carrito para crear el ticket.");
            return null;
        }

        // Verificar si hay suficiente stock para cada producto
        for (const product of cart.products) {
            const stockAvailable = await this.cartManager.getProductStock(product.productId);

            if (product.quantity > stockAvailable) {
                console.log(`No hay suficiente stock disponible para el producto ${product.productId}. Stock actual: ${stockAvailable}`);
                return null;
            }

            // Reducir el stock del producto
            await this.productManager.reduceProductStock(product.productId, product.quantity);
        }

        // Obtener la información del usuario
        const user = await this.UserDaoMongo.getUserById(userId);
        if (!user.user || !user.user.email) {
            console.log(`No se encontró el usuario o no se proporcionó el email para el usuario con ID ${userId}`);
            return null;
        }


        // Crear un ticket de compra
        const ticket = await Ticket.create({
            code: this.generateUniqueCode(),
            amount: cart.total,
            purchaser: cart.userId,
            email: user.user.email,
            products: cart.products.map(product => ({
                productId: product.productId,
                quantity: product.quantity,
            })),
        });
        console.log("Ticket de compra creado:", ticket);

        // Limpiar el carrito después de la compra
        await this.cartManager.clearCart(userId);


        return ticket;
    } catch (error) {
        console.error("Error al crear el ticket de compra:", error.message);
        return null;
    }
}

  



  

  // Función para generar códigos únicos (puedes ajustar según tus necesidades)
  generateUniqueCode() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }
}

module.exports = PurchaseManager;
