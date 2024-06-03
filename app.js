const express = require('express');
const http = require('http');
const helmet = require('helmet');
const exphbs = require('express-handlebars');
const path = require('path');
const { auth } = require('./src/middleware/authetication.middleware');
const verifyRole = require('./src/middleware/verifyRole.middleware');

const { Server: ServerIO } = require('socket.io');
const cors = require('cors');
const cookieParser = require ('cookie-parser');
const { authTokenMiddleware } = require('./src/utils/jsonwebtoken');
const handleErrors = require('./src/middleware/errors/index');

//------------------------------LOGGER------------------------------
const loggerTestRoutes = require('./src/routes/loggerTest');
const { addLogger, logger } = require('./src/utils/logger');

//------------------------------CONFIGURACION------------------------------
const {configObject } = require('./src/config/config');

//------------------------------SESSION------------------------------
const FileStore = require('session-file-store')

const sessionRouter = require('./src/routes/session.router');
const passport = require('passport')
const { initializePassport } = require('./src/config/passport.config')

//------------------------------MODELS------------------------------
const { productModel } = require('./src/dao/models/products.model');
const Messages = require('./src/dao/models/chat.model');

//------------------------------MANAGERS------------------------------
const ProductManager = require('./src/dao/managers/MDB/ProductManager');
const CartManager = require('./src/dao/managers/MDB/CartManager'); 

//------------------------------ROUTERS------------------------------
const chatRouter = require('./src/routes/chat');
const purchaseRoutes = require('./src/routes/purchase');
const usersRouter = require('./src/routes/user.router');
const cartRouter = require('./src/routes/cart.router');
const productRouter = require('./src/routes/product.router');
const mockingProductRouter = require('./src/routes/mocking.products');

//------------------------------GESTOR------------------------------
const productManager = new ProductManager(productModel);
const cartManager = new CartManager();

const bodyParser = require('body-parser');
const app = express();
const server = http.createServer(app);
const io = new ServerIO(server, {
  cors: {
    origin: '*',
  },
});

//  ------------------------------Middleware para configurar la política de seguridad de contenido ------------------------------
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "script-src": ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com", "https://cdn.socket.io/"],
      "style-src": ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],

    },
  })
);

//  ------------------------------------------------------------Middleware-------------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser('cookiefirmada'));
initializePassport();
app.use(passport.initialize());

app.use(addLogger);

//  -----------------------------------------------------Configuración de Handlebars ------------------------------------------
const hbs = exphbs.create({
  extname: 'handlebars',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'src', 'views', 'layouts'),
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
  helpers: {
    eq: function (a, b) {
      return a === b;
    },
  },
});

app.engine('handlebars', hbs.engine);
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'handlebars');


//  --------------------------------------------------Rutas principales u otras rutas ------------------------------

app.use('/session', sessionRouter);

app.get('/login', (req, res) => {
  res.render('login');4

});

app.get('/register', (req, res) => {
  res.render('register');
});

app.get('/', authTokenMiddleware, (req, res) => {
  const user = req.user;
  res.render('index', { user });
});

app.use('/users', usersRouter);

app.use('/inventario', productRouter);

app.use('/cart', cartRouter);

app.use('/chat', chatRouter);

const testRouter = require('./src/routes/testRouter'); 
app.use('/pruebas', testRouter);

app.use('/mockingproducts', mockingProductRouter);

app.use('/loggerTest', loggerTestRoutes);

app.use(handleErrors);

//-----------------------------PARA BORRAR---------------------------------
app.get('/home', (req, res) => {
  res.render('home', { products: productManager.products });
});

app.get('/realTimeProducts', (req, res) => {
  res.render('realTimeProducts', { products: productManager.products });
});
//-----------------------------PARA BORRAR---------------------------------



app.get('/products', auth, verifyRole('user'), async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;

    const result = await productManager.getProducts({ limit, page });

    const user = req.user;

    res.render('products', {
      products: result.docs,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      currentLimit: limit,
      user,  // Pasar el usuario a la vista
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

app.post('/vistaproduct', async (req, res) => {
  try {
      const productId = req.body.productId;

      // Obtén el producto específico según el ID
      const product = await productManager.getProductById(productId);

      // Renderiza la vista con la información del producto
      res.render('vistaproduct', { product });

  } catch (error) {
      logger.error(error);
      res.status(500).json({ error: 'Error al obtener el producto' });
  }
});





app.use('/purchase', (req, res, next) => {

  if (req.isAuthenticated()) {
    req.body.userId = req.user.id;
  }
  next(); 
}, purchaseRoutes);



//  -----------------------------------------------------Servir archivos estáticos -------------------------------------------------
app.use(express.static(path.join(__dirname, 'src', 'public')));



// ---------------------------------------------------Socket del lado del servidor ----------------------------------------------------
io.on('connection', async (socket) => {
  logger.info('Cliente conectado');

  // Lógica para productos
  // Obtener la lista de productos y enviarla al cliente cuando se conecta
  const productList = await productManager.getProducts();
  io.to(socket.id).emit('updateProducts', productList);

  // Manejar evento de nuevo producto
  socket.on('newProduct', async (newProduct) => {
    await productManager.addProduct(newProduct);
    const updatedProductList = await productManager.getProducts();
    io.emit('updateProducts', updatedProductList);
  });

  // Manejar evento de eliminación de producto
  socket.on('deleteProduct', async ({ productId }) => {
    const result = await productManager.deleteProduct(productId);
    if (result.success) {
      const updatedProductList = await productManager.getProducts();
      io.emit('updateProducts', updatedProductList);
    }
    io.to(socket.id).emit('deleteProduct', result);
  });


//---------------- LOGICA PARA MENSAJES------------------

  // Obtener mensajes existentes y enviarlos al cliente recién conectado
  try {
    const messages = await Messages.find();
    socket.emit('messages', messages);
  } catch (error) {
    logger.error('Error al obtener mensajes existentes:', error.message);
  }

  // Manejar nuevo mensaje del chat
  socket.on('chatMessage', async ({ user, message }) => {
    try {
      const newMessage = new Messages({ user, message });
      await newMessage.save();
      io.emit('chat', newMessage);
    } catch (error) {
      logger.error('Error al guardar el mensaje en la base de datos:', error.message);
    }
  
  });


});

//-------------------------- INICIA EL SERVIDOR----------------------------

server.listen(configObject.port, () => {
  logger.info(`Servidor escuchando en http://localhost:${configObject.port}`);
});
