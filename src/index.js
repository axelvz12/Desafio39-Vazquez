const express = require('express')
const handlebars = require('express-handlebars')
const session = require('express-session')
const passport = require('passport')

const mongoConnect = require('./db')
const router = require('./router')
const { port } = require('./configs/app.config')
const initializePassport = require('./configs/passport.config')
const sessionConfig = require('./configs/session.config')
const generateProduct = require('./utils/products-mock.util')
const errorMiddleware = require('./middlewares/errors')
const logger = require('./middlewares/winston-logger.middleware')
const winstonLogger = require('./utils/winston/devLogger.winston')
const swaggerOptions = require('./configs/swagger.config')


const swaggerUiExpress = require('swagger-ui-express')
const swaggerJSDoc = require('swagger-jsdoc')


const app = express()

app.engine('handlebars', handlebars.engine())
app.set('views', process.cwd() + '/src/views')
app.set('view engine', 'handlebars') 


app.use(express.json()) 
app.use(express.static(process.cwd() + '/src/public')) 
app.use(express.urlencoded({ extended: true }))


const specs = swaggerJSDoc(swaggerOptions)

app.use('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

app.use(session(sessionConfig))

initializePassport()



app.use(passport.initialize())
app.use(passport.session())



mongoConnect()


// LOGGER

app.use(logger)

router(app)

app.use(errorMiddleware)

app.listen(port, ()=> {
    winstonLogger.info(`\x1b[32mINTERNAL: Server is running at port ${port}\x1b[0m`)
})

