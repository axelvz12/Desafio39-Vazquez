const ProductBuilder = require("../Builders/new-product.builder");
const ProductsDAO = require("../DAO/mongo/product-dao.mongo");
const ProductArrayDTO = require("../DTO/product-array-res.dto");
const generateProducts = require("../utils/products-mock.util");
const winstonLogger = require("../utils/winston/devLogger.winston");


const Products = new ProductsDAO()

const productBuilder = new ProductBuilder()

const productsFind = async (page, limit, sort, cat, query) => {
    try {

        const { docs, categories, ...products } = await Products.allProd(page, limit, sort, cat, query)
        const productsDocs = []
            
        docs.forEach(doc => {
            const { _id, title, description, code, price , stock, category } = doc

            const prodArray = new ProductArrayDTO(_id, title, description, code, price , stock, category)
            
            productsDocs.push(prodArray)
            });
        
        products.productsDocs = productsDocs
        products.catArray = categories
            

        return products
    } catch (error) {
        throw error
    }

}

const productId = async (id) => {
    try {
        const prodId = await Products.prodId (id)
        return prodId
    } catch (error) {
        throw error
    }
}

const addProduct = async (newProdInfo) => {
    try {
        const { title, description, code, price , stock, category, image } = newProdInfo
        productBuilder.checkCode(code)
        productBuilder.checkCategory(category)
        productBuilder.setData(title, description, code, price, stock, category, image)
        
        const newProdData = productBuilder.build()
        
        if (!newProdData.title || !newProdData.description || !newProdData.code || !newProdData.price|| !newProdData.stock || !newProdData.category ) {return 'Falló registro'}
        
        winstonLogger.info(`FROM products.service: New Product added to list`)
        const newProd = await Products.addProd(newProdData)
        return newProd
    } catch (error) {
        throw error
    }
}

const deleteProduct = async (id) => {
    try {
        const deletedProd = await Products.deleteProd(id)
        return deletedProd
    } catch (error) {
        throw error
    }
}

const setProductStock = async (prodId, stock) => {
    try {
        const {oldStock, productUpdated} = await Products.setProductStockDao(prodId, stock)

        winstonLogger.info(`FROM products.service: Product Stock Updated: product id:${prodId} / old Stock: ${oldStock} / updated stock: ${productUpdated.stock}`)

        return {oldStock, productUpdated}
    } catch (error) {
        throw error
    }
}

const mockProducts = async (nro) => {
    try {
        const catArray = []
    
        const productsDocs = generateProducts(nro)
    
        productsDocs = null
    
        const totalPages = Math.round(productsDocs.length/10)
        const nextPage = 2
        let prevPage = nextPage-2
    
        if (prevPage < 0) {prevPage = null}
    
    
        for (const prod of productsDocs) {
            const cat = prod.category
    
            if (!catArray.find((cate) => cate == cat)) {
                catArray.push(cat)
            }
        }
    
        const products = {
            productsDocs,
            catArray,
            totalPages,
            nextPage,
            prevPage,
            hasPrevPage: null,
            hasNextPage: null,
            filter: null,
        }
    
        return products
        
    } catch (error) {
        throw error
    }
}





module.exports = {productsFind, productId, addProduct, deleteProduct, mockProducts, setProductStock}