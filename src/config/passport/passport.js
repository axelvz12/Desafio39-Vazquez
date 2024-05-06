//importo la estrategia local
import local from 'passport-local'
import passport from 'passport'
import crypto from 'crypto'
import GithubStrategy from 'passport-github2'
//cuando estoy trabajando con estrategia local importo userModel, consulto usuarios (user.js)
import { userModel } from '../../models/user.js'
//importo bcrypt (el hasheo y validacion)
import { createHash, validatePassword } from '../../utils/bcrypt.js'
import { strategyJWT } from './jwtStrategy.js'

//Passport trabaje con uno o mas middlewares, cuantas estrategias voy a implementar
//mi estrategia local va a ser igual a la estrategia local de passport-local
const localStrategy = local.Strategy

const initializePassport = () => {
    //Definir en que rutas se aplican mis estrategias, en este caso las estrategias de consultarlos localmente lo que seria login y registro


    //ESTRATEGIAS DE REGISTRO

    passport.use('register', new localStrategy({ passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => { //llamo a la estrategia register, que va a implementar la estrategia local
        //local strategies trabaja por defecto con user.name y password. En este caso no tengo un user,name, tenemos un email:Por lo cual definimos en usernameField que va a ser un email. Lo que va a simplificar la tarea de poderme registrar va a ser el email.
        //username seria mi email
        //password es la contraseña

        //consulto del req.body lo mismo que /register en sessionRouter.js. Lo copio y pego.
        try {
            const { name, surname, password, age, email } = req.body
            const findUser = await userModel.findOne({ email: email })

            if (findUser) {
                //busco un usuario. Devuelvo un done en vez de un estatus como lo hicimos en el sessionRouter
                //done va a ser mi retorno/return  
                return done(null, false)
                /*EL DONE MANEJA SOLO ESOS 2 VALORES.SI: existe algun error?Ninguno, entonces → null.
               El usuario lo pude registrar correctamente? No → entonces false.
               SI EXISTE EL USUARIO NO LO PUEDO REGISTRAR*/
            } else {
                //guardo en variable el usuario para luego usar el valor
                const user = await userModel.create({ name: name, surname: surname, password: createHash(password), age: age, email: email })
                return done(null, user)
                //Aqui voy a poder generar mi usuario por lo cual retorno null y true. True xq pude crear a mi usuario.
                //devuelvo el usuario
            }
        } catch (e) {
            return done(e)
            //si sucede algun error envío el error
        }
    }))





    //ESTRATEGIAS DE LOGUEO

    //APARTE PARA IMPLEMENTAR LAS SESONES DE LOS USUARIOS VOY A TRABAJAR CON 2 FUNCIONES, PARA AGREGAR O ELIMINAR LAS SESIONES:

    // 1: Inicializar la sesion del usuario (con su respectivo id)
    passport.serializeUser((user, done) => {
        //consulto x un usuario y por un return:done 
        done(null, user._id)
        //me devuelve 2 valores: : que no existió ningun error: null y el identificador deo usuario
    })
    // 2: Eliminar la sesion del usuario
    passport.deserializeUser(async (id, done) => {
        //pido un id, un done        
        const user = await userModel.findById(id)
        //devuelvo un valor. Busco un usuario dicho id...
        done(null, user)
        //...elimino la sesion
    })

    //no uso callback solo uso el usernameField especificando que mi username va a ser mi email
    //aqui no voy a pedir un request porque me voy a loguear
    passport.use('login', new localStrategy({ usernameField: 'email' }, async (username, password, done) => {
        //username representa al email y password a la contraseña
        try {
            const user = await userModel.findOne({ email: username }).lean()
            //aqui indico que email es el username.
            //LA ESTRATEGIA LOCAL NECESITA UN USERNAME Y YO LE ESPECIFICO QUE LO QUE SERIA EL REQUEST BODY DE MI CONSULTA VA A SER EL EMAIL. EN ESTE CASO USERNAME Y EMAIL REPRESENTAN LO MISMO. PASSWORD SIGUE COMO PASSWORD, NO CAMBIA
            if (user && validatePassword(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false)
            }
        } catch (e) {
            return done(e)
        }
    }))






    //ESTRATEGIA DE GITHUB

/*
NOTA: ESTA ESTRATEGIA SE COMENTO DEBIDO A UN ERROR EN POSTMAN AL TESTEAR LA ESTRATEGIA DE JWT, YA QUE SE DEBE INGRESAR LA CLAVE: clientID Y clientSecret. PARA QUE FUNCIONE SE DEBE COLOCAR LAS CLAVES.





// Declara una estrategia de autenticación para la autenticación mediante GitHub, con el nombre "github"
//github es el nombre de mi estrategia
passport.use('github', new GithubStrategy({
    // Configura el ID de cliente de la aplicación GitHub.
    clientID: "",
    // Configura la clave secreta del cliente de la aplicación GitHub.
    clientSecret: "",
    // Configura la URL de devolución de llamada para la autenticación.
    callbackURL: "http://localhost:8000/api/session/githubSession"
}, async (accessToken, refreshToken, profile, done) => {
    //done es lo que voy a retornar
    try {
        console.log(accessToken)
        console.log(refreshToken)
        //LOGUEO DE USUARIO
        // Busca un usuario en la base de datos por su correo electrónico obtenido de la información del perfil.
        const user = await userModel.findOne({ email: profile._json.email }).lean()
        // Si se encuentra un usuario, pasa el control al siguiente middleware con el usuario autenticado.
        if (user) {
            done(null, user)
        } else {
            // Genera un número aleatorio único.
            const randomNumber = crypto.randomUUID()
            // Registra en consola la información del perfil de GitHub.
            console.log(profile._json)
            // Crea un nuevo usuario en la base de datos utilizando la información del perfil de GitHub.
            const userCreated = await userModel.create({ name: profile._json.name, surname: ' ', email: profile._json.email, age: 18, password: createHash(`${profile._json.name}`) })
            // Registra en consola el número aleatorio generado.
            console.log(randomNumber)
            // Pasa el control al siguiente middleware con el usuario creado.
            return done(null, userCreated)
        }
    } catch (error) {
        // Si ocurre un error durante el proceso, pasa el error al siguiente middleware.
        return done(error)
    }
}))


*/





    //ESTRATEGIA DE JWT

    //En lugar de escribir todo el codigo como la estrategia anterior lo que hago es guardarlo en una constante en otro archivo. Entonces queda lo que es el passport solamente el uso de las estrategias y NO su definición.

    passport.use('jwt', strategyJWT)

    

    

}


export default initializePassport