import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const productSchema = new Schema({

    title: {
        type: String,
        required: true,
        //agrego el indice
        index: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    
    thumbnail: {
        default: []
    },//Defino x defecto q sea un array vacío, q si no me ingresa el valor sea vacío.
    code: {
        type: String,
        unique: true,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    status : {
        type : Boolean,
        //por defecto va a ser verdadero.Si no lo envío se carga x defecto.
        default : true
    }
})

//plugin de paginate
productSchema.plugin(mongoosePaginate)

const productModel = model("products", productSchema)

export default productModel