
class ProductArrayDTO {    
    constructor(prodId, title, description, code, price , stock, category  ) {
        this.id = prodId.toString()
        this.title = title[0].toUpperCase()+title.slice(1)
        this.description = description
        this.code = code
        this.price = price
        this.stock = stock
        this.category = category
    }
}

module.exports = ProductArrayDTO