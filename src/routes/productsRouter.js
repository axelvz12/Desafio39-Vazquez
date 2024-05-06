import { Router } from "express";
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from "../controllers/productController.js";


//TRAIGO TODOS LOS METODOS QUE ESTABA EN app.js y reemplazo app x productsRouter
const productsRouter = Router();




//********METDOS GET: limit, page, sort asc/desc, query (filter)***************


//Pruebas en Postman:http://localhost:8000/api/products?limit=2&page=1&sort=asc&filter=Smartphone


// Esta ruta maneja las solicitudes GET a '/products'.
// Recibe opcionalmente los parámetros 'limit', 'page', 'filter' y 'ord' desde la URL para limitar la cantidad de productos devueltos, paginar los resultados, filtrar por estado o categoría, y ordenar por precio.

productsRouter.get('/', async (req, res) => {
    try {
        // Paso 1: Obtiene los parámetros 'limit', 'page', 'filter' y 'sort' de la consulta HTTP.
        const { limit = 10, page = 1, filter, sort } = req.query;
        //los parametros son los mismos de los controladores: query y options
        const products = await getProducts(query, options);


        //CODIGO INTERNO TRABAJANDO EN EL CONTROLADOR



        // Paso 6: Envía la respuesta con el formato requerido.
        // Renderiza la plantilla home.handlebars ubicada en la ruta proporcionada y devuelve el HTML generado como parte de la respuesta HTTP con un código de estado 200.
        res.status(200).send({
            status: "success",
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: prevPage,
            nextPage: nextPage,
            page: page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
        });
    } catch (error) {
        // Maneja cualquier error y devuelve un mensaje de error 500 (Internal Server Error).
        res.status(500).render('templates/error', {
            error: error,
        });
    }
});


// Esta ruta maneja la consulta de productos. El identificador de producto (pid) no es un valor fijo, es generado por crypto.

productsRouter.get('/:pid', async (req, res) => {

    try {
        // Paso 1: Consulta el parámetro de la solicitud para obtener el identificador del producto.
        const PRODUCTID = req.params.pid


        //paso2: CODIGO INTERNO EN EL CONTROLADOR


        //LLAMO A LA FUNCIÓN DEL CONTROLADOR: 
        const PROD = await getProduct(PRODUCTID);

        // Paso 3: Si producto existe, lo devuelve. Sino, devuelve un mensaje de error 404 al cliente por solicitar un ID que no existe.

        if (PROD) {

            res.status(200).send(PROD)
            // Devuelve el producto con el código de estado 200 (OK).

        } else {
            res.status(404).send("Producto no encontrado")
            // Devuelve un mensaje de error 404 (Not Found).
        }

    } catch (e) {
        res.status(500).send(`Error interno del servidor al consultar producto: ${e}`)
        // Paso 4: Si ocurre algún error durante la consulta del producto, se maneja aquí y se devuelve un mensaje de error 500 (Internal Server Error).
    }

})


//********METDOS POST********CREAR


// Esta ruta maneja la creación de productos mediante una solicitud POST.

productsRouter.post('/', async (req, res) => {
    // req.body: Permite recibir información enviada desde el cliente, similar al contenido de un formulario.

    try {
        // Paso 1: Se extrae la información del cuerpo de la solicitud, que se espera contenga los datos del producto a crear.
        let product = req.body;
        console.log(product)



        //paso2: CODIGO INTERNO EN EL CONTROLADOR


        //llamo a la función createProduct desde el controlador.
        const mensaje = await createProduct(product)
        return product



        // Paso 3: Si el producto se crea con éxito, mensaje de estado 201. 201 porqu fue creado.  
        res.status(201).send(mensaje)

    } catch (error) {
        // Paso 5: Si ocurre algún error durante el proceso de creación del producto, se maneja aquí y se devuelve un mensaje de error 500 (Internal Server Error).
        res.status(500).send(`Error interno del servidor al consultar producto: ${error}`);
    }
})


//********METDOS PUT******ACTUALIZAR

// Esta ruta maneja la actualización de productos mediante una solicitud PUT.
// Verifica en ProductManager el método updateProducts.
// La solicitud debe ser de tipo PUT y debe incluir un ID de producto válido y los datos actualizados del producto.
productsRouter.put('/:pid', async (req, res) => {

    try {
        // Paso 1: Se consulta el ID del producto desde los parámetros de la solicitud. Se convierte a cadena si es necesario.
        const PRODUCTID = req.params.pid;

        // Paso 2: Se obtienen los datos actualizados del producto desde el cuerpo de la solicitud.
        let upProduct = req.body;


        //paso3: CODIGO INTERNO EN EL CONTROLADOR


        //llamo a la función createProduct desde el controlador.
        const prod = await updateProduct(PRODUCTID, upProduct)


        // Paso 4: Si la actualización del producto es exitosa, se devuelve un mensaje de éxito con el código de estado 200 (OK).
        res.status(200).send(prod);
    } catch (e) {
        // Paso 6: Si ocurre algún error durante el proceso de actualización del producto, se maneja aquí y se devuelve un mensaje de error 500 (Internal Server Error).
        res.status(500).send(`Error interno del servidor al actualizar producto: ${e}`);
    }
})


//********METDOS DELETE*******BORRAR

// Esta ruta maneja la eliminación de productos mediante una solicitud DELETE.
// Se refiere a la función deleteProduct en ProductsManager.js para la lógica de eliminación.
productsRouter.delete('/:pid', async (req, res) => {

    try {
        // Paso 1: Se consulta el ID del producto desde los parámetros de la solicitud. Se convierte a cadena si es necesario.
        const PRODUCTID = req.params.pid;

        // Paso 2: No se consultan datos adicionales del cuerpo de la solicitud ya que la eliminación se realiza solo con el ID del producto.



        //paso3: CODIGO INTERNO EN EL CONTROLADOR



        //llamo a la función deleteProduct desde el controlador.
        const mensaje = await deleteProduct(PRODUCTID);



        // Paso 4: Si la eliminación del producto es exitosa, se devuelve un mensaje de éxito con el código de estado 200 (OK).
        res.status(200).send(mensaje);

    } catch (e) {
        // Paso 6: Si ocurre algún error durante el proceso de eliminación del producto, se maneja aquí y se devuelve un mensaje de error 500 (Internal Server Error).
        res.status(500).send(`Error interno del servidor al eliminar producto: ${e}`);
    }

})

//exporto de este archivo para ser importado en app.js

export default productsRouter
