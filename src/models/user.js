import { Schema, model } from "mongoose";
import cartModel from './cart.js'

//voy a definir un userSchema que se va a componer de un objeto llamado Schema
//o sea voy a generar el Schema de lo que serian mis usuarios, los datos que van a componer mis usuarios

const userSchema = new Schema({
    //datos del usuario: atributos y tipode datos, se van a definirse en mi modelo
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    /*En la BDD no existe el tipo email, sí en los formularios.
    EL EMAIL ES ÚNICO,todas las aplicaciones sociales y Ecommerce tiene en común. NO PUEDE HABER 2 EMAILS= EN MI APLICACION. Lo puedo restringir desde el BACK, Front y BBD*/
    email: {
        /*defino el email de tipo String y único. Agrego la restriccion aqui. Si ingresan 2 email = ERROR.
        La restriccion se da desde el Front: ej tiene que tener un @, etc. Para la BDD ES UN STRING.
        Ya para este punto el email deberia estar validado*/
        type: String,
        unique: true,
        //agrego el indice
        index: true
    },
    //rol→ creado por defecto cada vez que se ingrese un usuario
    rol: {
        type: String,
        default: "User"
    },


    isLoggedIn: {
        type: Boolean, 
        default: false
      },

      cart_id: {
        type: Schema.Types.ObjectId,
        ref: 'carts'
    }

})



// Define un middleware pre-save para el modelo userSchema, que se ejecuta antes de guardar un nuevo documento de usuario
userSchema.pre('save', async function (next) {
    try {
        // Crea un nuevo documento de carrito con un array de productos vacío
        const newCart = await cartModel.create({ products: [] })
        // Registra el documento de carrito recién creado
        console.log(newCart)
        // Asigna el _id del nuevo documento de carrito al campo cart_id del documento de usuario actual
        this.cart_id = newCart._id
    } catch (e) {
        // Si ocurre un error, pásalo al siguiente middleware en la cadena
        //NEXT se usa para continuar
        next(e)
    }
})

// Define un middleware pre-find para el modelo userSchema, que se ejecuta antes de buscar documentos de usuario
userSchema.pre('find', async function (next) {
    try {
        // Encuentra un documento de carrito por su _id
        const PRODS = await cartModel.findOne({ _id: '661739a0111773eba9eae766' })
        // Registra el documento de carrito encontrado
        console.log(PRODS)
        // Rellena el campo 'cart_id' del documento de usuario actual con el documento de carrito referenciado
        this.populate('cart_id')
    } catch (e) {
        // Si ocurre un error, pásalo al siguiente middleware en la cadena
        next(e)
    }
})


//exporto una constante que va a ser igual a este modelo de nombre users y el siguiente esquema: userSchema
export const userModel = model("users", userSchema)