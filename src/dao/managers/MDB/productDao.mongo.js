const { productModel } = require('../../models/products.model');
const mongoose = require('mongoose');

class ProductDaoMongo {

  //------------------------------------AGREGAR PRODUCTO-----------------------------------//
  async addProduct(productData) {
    try {
      const { code } = productData;

      if (!code) {
        console.error("El código del producto es obligatorio");
        return null;
      }

      const existingProduct = await productModel.findOne({ code: code.toLowerCase() });

      if (existingProduct) {
        console.error("Ya existe un producto con el mismo código:", existingProduct);
        return null;
      }

      const product = await productModel.create({ ...productData, code: code.toLowerCase() });

      console.log("Producto agregado correctamente:", product);

      return product.toObject();
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      return null;
    }
  }

  //------------------------------------ELIMINAR PRODUCTO------------------------------------//
  async deleteProduct(id) {
    try {
      console.log('ID del producto a eliminar:', id);
        const product = await productModel.findByIdAndDelete(id);

        if (!product) {
            return { status: 'error', message: 'Producto no encontrado' };
        }

        return { status: 'success', message: 'Producto eliminado correctamente' };
    } catch (error) {
        console.error('Error al eliminar el producto por ID:', error);
        return { status: 'error', message: 'Error al eliminar el producto por ID' };
    }
}
  //-----------------------------------OBTENER PRODUCTOS------------------------------------//
  async getProductsPaginate({ limit = 10, page = 1 } = {}) {
    try {    
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
        };

        const result = await productModel.paginate({}, options);

        // Asegúrate de devolver los valores correctamente
        return { 
            status: 'success', 
            products: result.docs,
            totalDocs: result.totalDocs,
            limit: result.limit,
            totalPages: result.totalPages,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page
        };
    } catch (error) {
        console.error('Error al obtener el listado paginado de productos:', error);
        return { status: 'error', message: 'Error al obtener el listado paginado de productos' };
    }
}

  //-----------------------------------OBTENER PRODUCTOS POR ID------------------------------------//
  async getProductById(id) {
    try {
      const product = await productModel.findById(id);
      return product;
    } catch (error) {
      console.error("Error al obtener el producto por ID:", error.message);
      return null;
    }
  }

  //-----------------------------------EXISTENCIA DE PRODUCTOS------------------------------------//
  async productExists(code) {
    const existingProduct = await productModel.findOne({ code });
    return existingProduct !== null;
  }

  //-----------------------------------REDUCIR EXISTENCIA------------------------------------//
  async reduceProductStock(productId, quantity) {
    try {
      const product = await productModel.findById(productId);
      if (!product) {
        throw new Error(`El producto con el ID ${productId} no fue encontrado.`);
      }

      // Reducir la cantidad de stock disponible
      product.stock -= quantity;

      // Guardar los cambios en la base de datos
      await product.save();

      console.log(`Se redujo el stock del producto ${productId} en ${quantity}.`);
    } catch (error) {
      console.error(`Error al reducir el stock del producto ${productId}:`, error.message);
      throw error;
    }
  }

  //-----------------------------------AUMENTAR EXISTENCIA------------------------------------//
  async increaseProductStock(productId, quantity) {
    try {
      const product = await productModel.findById(productId);
      if (!product) {
        throw new Error(`El producto con el ID ${productId} no fue encontrado.`);
      }

      // Aumentar la cantidad de stock disponible
      product.stock += quantity;

      // Guardar los cambios en la base de datos
      await product.save();

      console.log(`Se aumentó el stock del producto ${productId} en ${quantity}.`);
    } catch (error) {
      console.error(`Error al aumentar el stock del producto ${productId}:`, error.message);
      throw error;
    }
  }


  async updateProduct(id, productData) {
    try {
        const product = await productModel.findByIdAndUpdate(
            id,
            { $set: productData },
            { new: true, lean: true }
        );

        console.log(`Producto actualizado en dao:`, product);

        if (!product) {
            return { status: 'error', message: 'Producto no encontrado' };
        }

        return { status: 'success', product, message: 'Producto actualizado correctamente' };
    } catch (error) {
        console.error('Error al editar el producto por ID:', error);
        return { status: 'error', message: 'Error al editar el producto por ID' };
    }
}
}
module.exports = ProductDaoMongo;
