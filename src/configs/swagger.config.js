
const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación de mi api',
            description: 'Mi api'
        }
    },
    apis:['./src/docs/**/*.yaml']
}

module.exports = swaggerOptions