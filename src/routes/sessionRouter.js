import { Router } from "express";
import passport from "passport";



// Crea un enrutador en Express.js para manejar las solicitudes relacionadas con las operaciones de usuario en la aplicación web.
const sessionRouter = Router();



//......INICIO DE SESION....................

sessionRouter.get('/login', passport.authenticate('login'), async (req, res) => {
    //indico la estrategia que voy a implementar que es la de passport.authenticate('entre parentesis va el nombre de la estrategia que es el nombre que utilice en la configuracion . En este caso login')
    //va a aplicar la estrategia de login, cuando aplique la estrategia de login genera la sesión.
    try {
        console.log(req)
        //↓esto me devuelve que no se cargó ningun valor
        if (!req.user) {
            //si en la consulta request no existe, no guarde ningun valor
            return res.status(401).send("Usuario o contraseña no validos")
            //devuelvo mensaje 401 sino te podes loguear x no tener credenciales
        }


        //En cambio si existe el usuario cargado en mi aplicacion me va a generar una sesion
        req.session.user = {
            //aqui voy a guardar en nombre y el email
            email: req.user.email,
            name: req.user.name
        }

        res.status(200).send("Usuario logueado correctamente")
        //devuelvo 200 si todo ok

    } catch (e) {
        res.status(500).send("Error al loguear usuario")
        //si tengo algun error
    }

});




//...................REGISTRO......

// Definición de la ruta POST '/register' en el enrutador de sesiones.
sessionRouter.post('/register', passport.authenticate('register'), async (req, res) => {
    //aplico la estrategia a nivel del middleware entre las dos comas.(entre las 2 partes)
    //entre parentesis el nombre de la estrategia que es register
    try {
        //aqui indico que hacer cuando se registra un nuevo usuario. Lo único que voy a responder es si se creo el usuario o no.
        console.log(req)
        if (!req.user) {
            //si el usuario  existe
            return res.status(400).send("Usuario existente")
            //devuelvo 400, si usuario ya fue creado 
        }
        res.status(200).send("Usuario creado correctamente")
        //200 si no existe

    } catch (e) {
        res.status(500).send("Error al registrar usuario")
        //captura errores
    }

})



//////// Ruta GITHUB    //////////////


// Ruta GET para la autenticación de GitHub de mi usuario, que utiliza Passport.js para iniciar la autenticación utilizando la estrategia 'github' configurada previamente.
sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => { r })
//el scope de mi aplicacion, el SCOPE es lo que yo voy a devolver va a ser mi email (user:email). Cuando hago referencia a mi usuario, hago referencia a mi email.
//El usuario en Github va a ser mi email

//LA ANTERIOR ME VA A REDIRECCIONAR AUTOMATICAMENTE A LA SIGUIENTE RUTA CUANDO MI USUARIO SE LOGUEA CORRECTAMENTE
// Ruta GET para manejar la devolución de llamada de autenticación de GitHub, utilizada después de que el usuario haya autorizado la aplicación en GitHub.
//nombre de la estrategis ('github')
sessionRouter.get('/githubSession', passport.authenticate('github'), async (req, res) => {
    // Registra en consola la solicitud HTTP entrante.
    console.log(req)
    // Establece los datos de usuario en la sesión actual basados en la información del usuario autenticado.
    req.session.user = {
        email: req.user.email,
        name: req.user.name
    }
    // Redirige al usuario a la página principal de la aplicación. "API/PRODUCT"
    res.redirect('/api/products')
})
////////fin  Ruta GITHUB    //////////////



////////inicio  Ruta CURRENT    //////////////
//consulto si el usuario se logueo correctamente o no
//verifico que esta autenticado con jwt

sessionRouter.get('/current', passport.authenticate('jwt'), (req, res) => {
    //estrategia jwt. → passport.use('jwt', strategyJWT) se encuentra en config/passport/passport.js
    console.log(req)
    res.status(200).send("Usuario logueado")
})
////////fin  Ruta CURRENT    //////////////



/* ORIGINALMENTE ESTE ES EL CODIGO DE LA CLASE para logout

// Ruta GET para manejar la solicitud de cierre de sesión.
sessionRouter.get('/logout', (req, res) => {
    // Destruye la sesión actual del usuario.
    req.session.destroy(function (e) {
        if (e) {
            // Si hay un error al destruir la sesión, registra el error en consola.
            console.log(e)
        } else {
            // Si la sesión se destruye correctamente, devuelve un estado 200 y redirige al usuario a la página principal.
            res.status(200).redirect("/")
        }
    })
})
*/

/////.....inicio LOGOUT.....///////
// Definición de la ruta GET '/logout' en el enrutador de sesiones.
sessionRouter.get('/logout', async (req, res) => {
    try {
        if (req.session.email) {
            await userModel.findOneAndUpdate({ email: req.session.email }, { isLoggedIn: false });
            // Destruye la sesión actual del usuario.
            req.session.destroy(function (e) {
                // Verifica si ocurrió algún error durante la destrucción de la sesión.
                if (e) {
                    // Si hubo un error, imprimirlo en la consola.
                    console.error("Error al cerrar sesión:", e);
                    res.status(500).send("Error al cerrar sesión");

                } else {
                    // Si la sesión se destruyó correctamente, enviar una respuesta de estado 200 y redirigir al usuario a la página de inicio ('/').
                    res.status(200).redirect("/");
                    //res.status(200).redirect("/api/session/login") Esta ruta aun no esta implementada visualmente. Aca deberia haber un formulario.Con lo cual optamos por la de inicio.
                }
            });

        } else {
            // Si el usuario no está autenticado, simplemente redirigirlo a la página de inicio
            res.redirect("/");
        }


    } catch (error) {
        // Manejo de errores
        console.error("Error al cerrar sesión:", error);
        res.status(500).send("Error al cerrar sesión");
    }
});
/////..... fin  LOGOUT.....///////desloguearse




////////inicio  Ruta JWT    //////////////

// Configuración de la ruta '/testJWT' en el enrutador 'sessionRouter' para probar la autenticación JWT
//session: fale porque no quiero generar una sesion como tal sino solo testear.
sessionRouter.get('/testJWT', passport.authenticate('jwt', { session: false }), (req, res) => {
      // La solicitud ha pasado la autenticación JWT y req.user contiene los datos del usuario autenticado
     // Envía una respuesta con estado HTTP 200 y envía los datos del usuario en la respuesta
    res.status(200).send(req.user)
})

////////fin  Ruta JWT    //////////////



export default sessionRouter;
