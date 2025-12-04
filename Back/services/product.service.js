import { Product } from '../models/product.js';
import path from 'path';
import fs from 'fs/promises';


// Función auxiliar modificada para recibir la carpeta de destino 
const saveToDisk = async (file, targetFolder) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = `img-${uniqueSuffix}${ext}`;
    
    // Ruta completa: uploads/papel-higienico-pro-max/img-123.jpg
    const filePath = path.join(targetFolder, filename); 

    // Escribir el Buffer de la memoria al disco
    await fs.writeFile(filePath, file.buffer);
    
    return filePath;
};

export async function checkProductExistence(productData) {
    const existingProduct = await Product.findOne({ 
        where: {
            brand: productData.brand, 
            lineUp: productData.lineUp 
        }
    });
    
    if (existingProduct) {
        // ❌ ANTES: return res.status(409)... (res no existe aquí)
        // ✅ AHORA: Lanzamos un error simple
        throw new Error("PRODUCT_EXISTS");
    }
}

export async function checkImages(files) {
        if( !files || files.length === 0 ) {
        // ✅ Lanzamos error si no hay imágenes
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
