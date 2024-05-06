//Para que me devuelva la url. Dado este archivo devolveme el path
// Importa las funciones fileUrlToPath y dirname de los módulos 'url' y 'path' respectivamente.
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Convierte la URL del archivo actual en su correspondiente ruta de sistema de archivos.
let __filename = fileURLToPath(import.meta.url);

//dirname NO es palabra reservada
//se implementa guiones bajos al trabajar con path
// dirname() toma la ruta de un archivo y devuelve el nombre del directorio padre.
// Se asigna la ruta del directorio actual (__dirname) utilizando la función dirname() con la ruta del archivo (__filename).
export const __dirname = dirname(__filename);
