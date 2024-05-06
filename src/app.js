


//*******IMPORTACIONES******************

// Importa el módulo Express para crear el servidor
import express from 'express'
import mongoose from 'mongoose'
import messageModel from './models/messages.js'
import indexRouter from './routes/indexRouter.js'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import initializePassport from './config/passport/passport.js'
import { __dirname } from './path.js'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io' //llaves es una dependencia

//console.log(__dirname)





//*******CONFIGURACIONES O DECLARACIONES******************

// Se crea una instancia de Express para configurar el servidor.
const app = express();
// Se define el puerto en el que el servidor estará escuchando.
const PORT = 8000






//----SERVER---------
// Se define el servidor utilizando la variable 'app'.
// El servidor escucha en el puerto definido por la variable 'PORT'.
// Cuando el servidor está activo, se ejecuta una función anónima para mostrar un mensaje de estado en la consola.
const SERVER = app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
// Muestra un mensaje en la consola indicando que el servidor está activo y escuchando en el puerto especificado.

//declaro un nuevo servidor de sockets.io
const io = new Server(SERVER)






//----CONECTION DB---------
//contraseña que yo defino
mongoose.connect("mongodb+srv://azul:password@cluster0.0wxpkun.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  //cuando esta conexion me devuelva un valor voy a mostrar este mensaje
  .then(() => console.log("DB is connected"))
  //si hay error muestro el error
  .catch(e => console.log(e))







//*******MIDDLEWARES******************

//el servidor podrá recibir json al momento de la petición
app.use(express.json())
//permite que se pueda mandar informacion tambien desde la URL
app.use(express.urlencoded({ extended: true }))

//COOKIES
//todas las generadas aqui se van a hacer con esta clave secreta
app.use(cookieParser("claveSecreta"))



//SESSION.......
//Configuro que:
app.use(session({
  //voy a tener un valor secreto
  secret: '',
  //voy a guardar cada vez que recargue
  resave: true,
  store: MongoStore.create({
    //misma url con la que me conecto a la base de datos
    mongoUrl: "mongodb+srv://azul:password@cluster0.0wxpkun.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    //ttl es el tiempo en el cual vive mi sesion. Yo lo defino. ej: 2hs, 3dias,etc
    //me va a prmitir ingresar sin que yo me loguee
    //El tiempo de vida esta en segundos. 60 minutos x 60 segundos = 1 hora
    ttl: 60 * 60
  }),
  //Fuerzo a q se guarde la sesion en el storage cuando reinicio y que se pueda almacenar cuando tengo una recarga.
  saveUninitialized: true
}))



//......CON ESTO CONFIGURO HANDLEBARS.....

app.engine('handlebars', engine())
//voy a trabajar con handlebars, esto implementa lo que me devuelve mi dependencia

app.set('view engine', 'handlebars')
//set es para setear un valor
//para las vistas de mi aplicacion voy a implementar handlebars

//CON ESTO INDICO DONDE SE ESTA UTILIZANDO
app.set('views', __dirname + '/views')
//las vistas de mi aplicacion se encuentran en __dirname es mi path →seria la carpeta src y lo concateno con la carpeta views








//******* Routes of PASSPORT**********

initializePassport()
//ejecuto la funcion
app.use(passport.initialize())
//iniciá todo lo que serian las estrategias de autentificacion
app.use(passport.session())
//generame lo que sería las sesiones

//TODO LO







//******* RUTA RAÍZ: Manejo de solicitudes**********

//establece que el middleware indexRouter manejará las solicitudes en la ruta raíz de la aplicación.
app.use('/', indexRouter)







//........Routes of COOKIES............

//setea, crea una cookie
//fecha de expiración: maxAge
//signed: true →FIRMA DE COOKIE
app.get('/setCookie', (req, res) => {
  res.cookie('CookieCookie', 'Esto es una cookie :)', { maxAge: 3000000, signed: true }).send("Cookie creada")
})

//Consultar las cookies de mi aplicacion
app.get('/getCookie', (req, res) => {
  //signedCookies: consulto solo por cookies firmadas. SEGURIDAD GARANTIZADA
  res.send(req.signedCookies)
})

//Eliminar cookies
app.get('/deleteCookie', (req, res) => {
  res.clearCookie('CookieCookie').send("Cookie eliminada")
  //res.cookie('CookieCokie', '', { expires: new Date(0) })
});






//........Routes of SESSION............

//ruta para guardar una sesion del usuario
//esta es una forma de guardar un contador de usuarios.
//Consulto: si existe la sesion del usuario consulto por el valor sino la creo con el valor de 1
app.get('/session', (req, res) => {
  console.log(req.session)
  if (req.session.counter) {
    //genero atributo counter: va a contar la cantidad de veces que ingreso mi usuario a esta ruta
    //si ya habias entrado antes lo incremento en 1
    req.session.counter++;
    res.send(`Visitaste el sitio ${req.session.counter} veces.`)
  } else {
    //sos el primer usuario que ingresa
    req.session.counter = 1
    res.send("Bienvenido!")
  }
})


//ruta para loguear usuarios.................

app.post('/login', (req, res) => {
  //consulto email y contraseña
  const { email, password } = req.body
  //Simulacion que tengo una Base de datos como tal.
  if (email == "decoracion@gmail.com" && password == "265444") {
    //si se cumple me pude loguear
    //entonces guardo la session en mi servidor estos valores:
    req.session.email = email
    req.session.password = password
    console.log(req.session)
    return res.send("Login ok")
  }
  // si no cumple con estas condiciones
  res.send("Login invalido")
})



//...........SOCKET.IO..................

// Cuando se establece una conexión con Socket.io, se ejecuta esta función.
// Esta función recibe un socket que representa la conexión con el cliente.
io.on('connection', (socket) => {
  // Se imprime un mensaje en la consola del servidor para indicar la conexión exitosa.
  console.log("Conexión establecida con Socket.io")

  // Cuando el cliente envía un mensaje de 'mensaje', se ejecuta esta función.
  socket.on('mensaje', async (mensaje) => {
    // Se intenta almacenar el mensaje en la base de datos.
    try {
      // Se utiliza un modelo de mensaje (messageModel) para crear un nuevo mensaje en la base de datos.
      await messageModel.create(mensaje)
      // Busca todos los mensajes en la base de datos utilizando el modelo de mensaje (messageModel) y los almacena en la variable 'mensajes'
      const mensajes = await messageModel.find()
      // Se emite el evento 'mensajeLogs' a todos los clientes conectados, enviando el arreglo actualizado de mensajes.
      io.emit('mensajeLogs', mensajes)
    } catch (e) {
      // Si ocurre un error al almacenar el mensaje, se emite el error a todos los clientes conectados.
      io.emit('mensajeLogs', e)
    }
  })
})






