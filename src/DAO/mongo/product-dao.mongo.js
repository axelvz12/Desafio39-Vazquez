const CustomError = require('../../handlers/CustomError')
const TYPE_ERRORS = require('../../handlers/errors/types-errors')
const Products = require('../../models/product.model')
const errorLibrary = require('../../constants/errors-library.constant')




class ProductsDAO {
    async allProd (page, limit, sort, cat, query) {
        try {
            
            const categories = []
            
            if(cat) {
                const products = await Products.paginate ({category: cat}, { page, limit: 5, })
                products.filter = cat
                return products
            }
            
            if (query) {
                const productsTitles = await Products.find({status: true})
                const productsIds = []
                for (const product of productsTitles) {
                    
                    if (product.title.search(query) !== -1 ) {
                        productsIds.push(product._id.toString())
                    }
                }
                
                
                const products = await Products.paginate ({_id: { $in: productsIds}}, { page, limit: 5, }) 
                
                return products
            }

            if (sort) {
                if(sort == "asc") 
                {//sort = 1
                const products = await Products.paginate ({}, { page, limit: 5, sort: { price: -1 }})
                return products
                
                } else if (sort == "desc")
                 {//sort = -1
                const products = await Products.paginate ({}, { page, limit: 5, sort: { price: 1 }})
                return products
                }
                 // else {sort = null}
            }
 
            if(limit) {
                const products = await Products.paginate ({}, { page, limit: limit})
                return products
            }
            
            const products = await Products.paginate ({}, { page, limit: 10 }) 
            

            for (const prod of products.docs) {
                const cat = prod.category

                if (!categories.find((cate) => cate == cat)) {
                    categories.push(cat)
                }
            }

            products.categories = categories

            return products            
        } catch (error) {
            CustomError.createError(errorLibrary.ERROR_500.products_DB_Mongo)
        }
    }

    async prodId (id) {
        try {
            const prodId = await Products.findOne({ _id: id , status: true })
            return prodId
        } catch (error) {
            throw error
        }
    }


    async addProd (newProdInfo) {
        try {
            const { code } = newProdInfo

            if(!await Products.findOne({code: code})) {
                const newProd = await Products.create(newProdInfo)
                return 'Se creó nuevo producto'
            } else {
                return 'Invalid code'
            }
        } catch (error) {
            throw error
        }
        
    }

    async setProductStockDao (prodId, newStock) {
        try {
            const product = await Products.findById(prodId)
            const oldStock = product.stock
            product.stock += newStock
            
            if (product.status == false) {
                product.status = true
            }
            
            const ret = await Products.updateOne({ _id: prodId}, product ) 

            const {_id, __v, title, description, code, price, stock, category, status} = await Products.findById(prodId)
            
            const productUpdated = {
                id: _id.toString(),
                title: title[0].toUpperCase()+title.slice(1),
                description,
                code,
                price,
                stock,
                category,
                status
            }

            return {productUpdated, oldStock}
        } catch (error) {
            throw error
        }
    }

    async deleteProd (id) {
        try {
            await Products.updateOne({ _id: id}, {status: false})
            return 'Product deleted'
        } catch (error) {
            throw error
        }
    }

}






module.exports = ProductsDAO


