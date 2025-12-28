import { Product } from '../models/product.js';
import path from 'path';
import fs from 'fs/promises';


// Función auxiliar modificada para recibir la carpeta de destino 
const saveToDisk = async (file, targetFolder) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = `img-${uniqueSuffix}${ext}`;
    
    // PASO A: Guardar en el DISCO DURO (Sistema Operativo)
    // Usamos path.join para que Windows no se queje
    const systemPath = path.join(targetFolder, filename); 
    
    // Escribimos el archivo usando la ruta de sistema
    await fs.writeFile(systemPath, file.buffer);
    
    // PASO B: Generar ruta para la WEB (Base de Datos)
    // 1. Tomamos la ruta de carpeta y archivo
    // 2. FORZAMOS el cambio de barras invertidas (\) a barras normales (/)
    // Esto asegura que el frontend reciba "uploads/carpeta/foto.jpg"
    const webPath = path.join(targetFolder, filename).split(path.sep).join('/');

    // OPCIONAL: Si quieres guardar la URL COMPLETA en base de datos:
    // return `${process.env.BACKEND_URL}/${webPath}`;
    
    // RECOMENDADO: Guardar ruta relativa normalizada
    return webPath; 
};

export async function checkProductExistence(productData) {
    const existingProduct = await Product.findOne({ 
        where: {
            brand: productData.brand, 
            lineUp: productData.lineUp 
        }
    });
    
    if (existingProduct) {
        throw new Error("PRODUCT_EXISTS");
    }
}

export async function checkImages(files) {
        if( !files || files.length === 0 ) {
        //Lanzamos error si no hay imágenes
        throw new Error("NO_IMAGES");
    }
    console.log("Imágenes recibidas: ", files.length);
}

export async function createFolder(productData) {
    //esta logica de el nombramiento de la carpeta deberia ser movida a utils de producto
    //creacion dinamica del nombre de la carpeta
    //limpiza de los nombres
    const safeType = productData.productType.
        trim().
        replace(/\s+/g, '-').
        toLowerCase();
    const safeLineUp = productData.lineUp.
        trim().
        replace(/\s+/g, '-').
        toLowerCase();

    //creacion de la carpeta
    const folderName = `${safeType}-${safeLineUp}`;
    const targetFolder = path.join('uploads', folderName);
    try{
        //sino existe la creo sino, nada
        await fs.mkdir(targetFolder, { recursive: true });
        return targetFolder;
    }catch(err){   
        console.log("Error al crear la carpeta: ", err);
        return res.status(500).json({ message: "Error al crear la carpeta de imágenes" });
    }

};

export async function saveImages(files, targetFolder) {

    //GUARDADO DE IMÁGENES en array para el campo de path en la base de datos
    const imagePaths = []; // 1. Inicializa un array vacío
        
    for (const file of files) {
        // 2. Guarda cada archivo en disco en la carpeta dinámica y obtiene la ruta
        const savedPath = await saveToDisk(file, targetFolder); 
        // 3. Agrega la ruta final y correcta al array
        imagePaths.push(savedPath); 
    }
    // Ahora 'imagePaths' contiene el array limpio de rutas guardadas en el disco.
    return imagePaths;
};

/*
    valida que el producto exista haya stock y devuelve los productos para su uso posterior
*/
export async function checkCartProducts(cartProducts) {

    try{
        const dbProducts = await Product.findAll({
            where: {
                id: cartProducts.map(item => item.productId)
            }
        });
        if(dbProducts.length !== cartProducts.length){
            throw new Error("Some products in the cart do not exist in the database.");
        };

for(const cartItem of cartProducts){
            
            // Usamos find para obtener el objeto de la base de datos correspondiente
            const dbProduct = dbProducts.find(p => p.id === cartItem.productId);

            // Verificación de existencia (debería pasar si la verificación 2 es correcta)
            if (!dbProduct) {
                // Este caso es un fallback, pero no debería ocurrir si el chequeo de longitud fue exitoso
                throw new Error(`Error interno: No se encontró el producto ${cartItem.productId} de la DB.`);
            }

            // Comprobamos el stock
            if(dbProduct.stock < cartItem.quantity){
                // Usamos la información del producto de la DB (dbProduct)
                throw new Error(`El producto ${dbProduct.productType} ${dbProduct.lineUp} no cuenta con suficiente stock. La cantidad solicitada es ${cartItem.quantity}, pero solo hay ${dbProduct.stock} disponible.`);
            }
            
            // Si quieres que el objeto del carrito tenga el precio del DB para uso posterior:
            // cartItem.price = dbProduct.price; 
        }
        return dbProducts;
    }
    catch(error){
        console.log("Error checking cart products:", error.message);
        throw error;
    }

};