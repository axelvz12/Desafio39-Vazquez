//MANEJO DE PRODUCTOS en una base de datos utilizando un ORM  (Object-Relational Mapping) como Mongoose en Node.js.


// Importa el modelo de producto desde el archivo product.js en la carpeta models
import productModel from "../models/product.js";


export const getProducts = async (query, options) => {

    // Paso 2: Construye el objeto de consulta para la base de datos, utilizando el filtro correspondiente.
    const query = filter ? (filter === 'true' || filter === 'false' ? { status: filter } : { category: filter }) : {};
    // Paso 3: Construye el objeto de consulta para el método de ordenamiento, utilizando 'price' como clave y 'sort' como dirección de ordenamiento.
    const sortQuery = sort ? { price: sort === 'asc' ? 1 : -1 } : {};
    // Paso 4: Realiza la consulta a la base de datos, aplicando el filtro, paginación y ordenamiento.
    const options = { limit: parseInt(limit), page: parseInt(page), sort: sortQuery };

    // Paso 5: Calcula si hay páginas previas y siguientes.
    const prevPage = products.prevPage ? parseInt(page) - 1 : null;
    const nextPage = products.nextPage ? parseInt(page) + 1 : null;


    const products = await productModel.paginate(query, options);
    return products

}

//..........................................

//Función para OBTENER un producto POR SU ID

// Realiza la consulta a la base de datos para encontrar un producto por su ID

export const getProduct = async (PRODUCTID) => {
    // Paso 2: Consulta en la base de datos el producto con el ID proporcionado.
    /* Nota: Todo dato consultado desde un parámetro es de tipo string. Si el ID es numérico, se necesita convertirlo. */
    // Llama a ProductManager para devolver el producto con el ID solicitado.
    const PROD = await productModel.findById(PRODUCTID)
    return PROD
}


//..........................................

//Función para CREAR UN NUEVO producto


export const createProduct = async (product) => {
    
    // Paso 2: Llamo al modelo. Al crear un nuevo prod.
    // Crea un nuevo producto en la base de datos y devuelve un mensaje
    const mensaje = await productModel.create(product);
    return mensaje;
}




//..........................................

// Función para actualizar un producto existente

export const updateProduct = async (PRODUCTID, upProduct) => {
    // Paso 3: Se llama a ProductManager para actualizar el producto en la base de datos y obtener un mensaje de confirmación.
    const prod =await productModel.findByIdAndUpdate(PRODUCTID, upProduct);
    return prod
}




//..........................................

// Función para eliminar un producto existente por su ID


export const deleteProduct = async (PRODUCTID) => {
    // Paso 3: Elimina un producto existente por su ID de la base de datos y devuelve un mensaje
    const mensaje = await productModel.findByIdAndDelete(PRODUCTID);
    return mensaje;
}




