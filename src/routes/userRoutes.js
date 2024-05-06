import { Router } from "express";
import { userModel } from "../models/user.js";

/*crea un enrutador en Express.js para manejar las solicitudes relacionadas con las operaciones de usuario en la aplicación web.*/
const userRouter = Router()

//  ↓ DEFINIMOS LAS RUTAS DE MI APLICACIÓN
// de momento definiremos 2, primeros acercamientos


//toda funcion q consulta 1 BDD debe ser async
//ruta get para obtener todos los usuarios en la ruta inicial /
userRouter.get('/', async (req, res) => {
      //en try consulto los usuarios
      try {
            //en userModel tengo todos los metodos para consultar, eliminar,etc  
            //uso metodo find para traer todos los usuarios de mi aplicacion
            const users = await userModel.find()
            res.status(200).send(users)

      } catch (e) {
            res.status(500).send("Error al consultar usuarios", e)
      }//capturo error con catch 
})


//BORRAMOS ESTA RUTA POST PORQUE YA VOY A TRABAJARLO MEDIANTE UNA SESSION

//ruta post para crear nuevo usuario

/*userRouter.post('/', async (req, res) => {
      try {
            //creo un nuevo usuario
            //req.body datos enviados x cliente al servidor en una solicitud HTTP POST o PUT.

            const { name, surname, password, age, email } = req.body
            //creo esos datos con create
            //le envio a mi BDD x metodo create esos datos creados
            const resultado = await userModel.create({ name, surname, password, age, email })
            res.status(201).send(resultado)

      } catch (e) {
            res.status(500).send("Error al crear usuarios", e)
      }
})*/


export default userRouter