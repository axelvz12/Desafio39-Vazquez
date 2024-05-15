const mongoose = require('mongoose')

const saleCollection = 'sale'


const saleSchema = new mongoose.Schema({

    code: {
        type: String,
        required: true
    },

    saleDescription: {
        type: String,
        required: true
    },
    
    total: {
        type: Number,
        required: true
    },
    
    createdAt: {
        type: Date,
        default: Date.now 
    },
    
    user: {
        type: String,
        required: true
    },

})




const sales = mongoose.model(saleCollection, saleSchema)



module.exports = sales