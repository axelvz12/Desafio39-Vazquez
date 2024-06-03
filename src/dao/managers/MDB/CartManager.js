// RUTA RELATIVA: src/dao/managers/MDB/CartManager.js

const { cartModel } = require('../../models/carts.model');  
const ProductManager = require('../MDB/ProductManager');  

class CartManager {
  constructor() {
    this.productManager = new ProductManager();
  }

//------------------------------------CREAR CARRITO------------------------------------//
  async createCart(userId) {
    try {
      const newCart = await cartModel.create({
        userId,
        products: [],
        total: 0, 
      });
      return newCart;
    } catch (error) {
      console.error("Error al crear el carrito:", error.message);
      return null;
    }
  }

//------------------------------------TRAER CARRITO SEGUN ID------------------------------------//
  async getCartByUserId(userId) {
    try {
        const cart = await cartModel
            .findOne({ userId })
            .populate('products.productId');

        if (!cart) {
            return null;
        }

        return cart;
    } catch (error) {
        console.error("Error al obtener el carrito:", error.message);
        return null;
    }
}

//------------------------------------AGREGAR PRODUCTOS AL CARRITO------------------------------------//
  
  async addProductToCart(userId, productId, quantity) {
    try {
      let cart = await cartModel.findOne({ userId });

      if (!cart) {
        cart = await this.createCart(userId);
      }

      const existingProduct = cart.products.find((product) => product.productId.id === productId);

      // Asegurarse de que no exceda el stock disponible
      const stockAvailable = await this.getProductStock(productId);
      const requestedQuantity = existingProduct ? existingProduct.quantity + quantity : quantity;

      if (requestedQuantity > stockAvailable) {
        console.log(`No hay suficiente stock disponible. Stock actual: ${stockAvailable}`);
        return null; 
      }

      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }

      // Calcular el total del carrito
      cart.total = await this.calculateCartTotal(cart);

      await cart.save();
      return cart;
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error.message);
      return null;
    }
  }


//------------------------------------OBTENER STOCK DE PRODUCTOS------------------------------------//

  async getProductStock(productId) {
    try {
      const product = await this.productManager.getProductById(productId);
      return product ? product.stock : 0;
    } catch (error) {
      console.error("Error al obtener el stock del producto:", error.message);
      return 0;
    }
  }




  
//------------------------------------CALCULAR EL TOTAL DEL CARRITO------------------------------------//
  async calculateCartTotal(cart) {
    let total = 0;

    for (const product of cart.products) {
      const productPrice = await this.getProductPrice(product.productId);
      total += productPrice * product.quantity;
    }

    return total;
  }


//------------------------------------OBTENER EL PRECIO------------------------------------//
  async getProductPrice(productId) {
    try {
      const product = await this.productManager.getProductById(productId);
      return product ? product.price : 0;
    } catch (error) {
      console.error("Error al obtener el precio del producto:", error.message);
      return 0;
    }
  }

//------------------------------------ELIMINA TODOS LOS PRODUCTOS DEL CARRITO-----------------------------------//
async clearCart(userId) {
  try {
    let cart = await cartModel.findOne({ userId });

    if (!cart) {
      console.log("No se encontró el carrito para limpiar.");
      return null;
    }

    // Limpiar todos los productos del carrito
    cart.products = [];
    cart.total = 0;

    await cart.save();
    return cart;
  } catch (error) {
    console.error("Error al limpiar el carrito:", error.message);
    return null;
  }
}

//------------------------------------ELIMINAR UN PRODUCTO DEL CARRITO------------------------------------//
async removeProductFromCart(userId, productId) {
  try {
    let cart = await cartModel.findOne({ userId });

    if (!cart) {
      console.log("No se encontró el carrito para eliminar el producto.");
      return null;
    }

    // Filtrar el producto específico a eliminar
    cart.products = cart.products.filter(product => product.productId.toString() !== productId.toString());

    // Calcular el nuevo total del carrito
    cart.total = await this.calculateCartTotal(cart);

    await cart.save();
    return cart;
  } catch (error) {
    console.error("Error al eliminar el producto del carrito:", error.message);
    return null;
  }
}

//------------------------------------ELIMINA LOS PRODUCTOS COMPRADOS-----------------------------------//
  async clearCartWithProducts(userId, productsToPurchase) {
    try {
      let cart = await cartModel.findOne({ userId });
  
      if (!cart) {
        console.log("No se encontró el carrito para limpiar.");
        return null;
      }
  
      // Filtrar los productos que no se compraron
      cart.products = cart.products.filter(product => !productsToPurchase.find(p => p.productId.toString() === product.productId.toString()));
  
      // Calcular el nuevo total del carrito
      cart.total = await this.calculateCartTotal(cart);
  
      await cart.save();
      return cart;
    } catch (error) {
      console.error("Error al limpiar el carrito:", error.message);
      return null;
    }
  }
}





module.exports = CartManager;
