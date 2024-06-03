const { configObject } = require("../config/config");

let UserDao;
let ProductDao;
let CartsDao;

switch (configObject.persistence) {
    case 'FILE':
        // Aquí se van a asignar las implementaciones de FILE para UserDao, ProductDao, y CartsDao
        // Ejemplo: UserDao = require("./managers/FILE/userDao.file");
        break;
    case 'MEMORY':
        // Aquí  se van a asignar las implementaciones de MEMORY para UserDao, ProductDao, y CartsDao
        // Ejemplo: UserDao = require("./managers/MEMORY/userDao.memory");
        break;

    default:
        // Conexión a la base de datos de Mongo
        const { connectToDatabase } = require("../config/config");
        connectToDatabase();

        // Implementaciones Mongo para UserDaoMongo
        const UserDaoMongo = require("./managers/MDB/userDao.mongo");
        UserDao = UserDaoMongo;

        // Implementaciones Mongo para ProductDaoMongo
        const ProductDaoMongo = require("./managers/MDB/productDao.mongo");
        ProductDao = ProductDaoMongo;


        break;
}

module.exports = { UserDao, ProductDao, CartsDao };
