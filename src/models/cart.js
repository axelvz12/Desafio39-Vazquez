import { Schema, model } from "mongoose";

const cartSchema = new Schema({
    //solamente voy a tener un atributo: productos

    products: {

        type: [

            {
                
                id_prod: {
                    type: Schema.Types.ObjectId,
                    required: true,
                    //tengo que referenciar el id a una coleccion: productos
                    ref: 'products'
                },
                

                quantity: {
                    type: Number,
                    required: true
                }


            }

        ],

        default: []
    }
})

// Establece un pre-hook en el esquema del carrito antes de de ejecutar una operación 'findOne'
cartSchema.pre('findOne', function() {
  // Este middleware se ejecuta antes de realizar la operación 'findOne' en el esquema del carrito

   // Utiliza la función 'populate' de Mongoose para reemplazar los IDs en el campo 'products.id_prod'
    // con los documentos reales correspondientes de la otra colección.

     // Esto garantiza que al buscar un carrito, los documentos referenciados en el campo 'products.id_prod'
    // se "pueblen" con los detalles de los productos antes de devolver el resultado.
    this.populate('products.id_prod');
});


const cartModel = model("carts", cartSchema)
export default cartModel