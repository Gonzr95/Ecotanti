import { UniqueConstraintError } from "sequelize";
import { Product } from "../models/product.js"
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


export async function register(req, res) {
    try {
        const productData = req.body;
        // validar que el producto no exista 
        const existingProduct = await Product.findOne({ 
            where: {
                brand: productData.brand, 
                lineUp: productData.lineUp 
            }
        });

        if (existingProduct) {
            // Si falla la validación, la función termina y la memoria se libera
            return res.status(409).json({ message: "Este producto ya está registrado en el sistema." });
        }

        // 2. SI LAS VALIDACIONES SON EXITOSAS, PROCEDEMOS A GUARDAR LAS IMÁGENES
        const files = req.files;
        if( !files || files.length === 0 ) {
            return res.status(400).json( { message: "Se requiere al menos una imagen del producto" } );
        }


        const imagesPaths = files.map( file => file.path );
        for (const file of files) {
            // Guardamos la imagen y obtenemos la ruta final
            const savedPath = await saveToDisk(file); 
            imagesPaths.push(savedPath);
        }

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
            await fs.mkdir(targetFolder, { recursive: true });
        }catch(err){   
            console.log("Error al crear la carpeta: ", err);
            return res.status(500).json({ message: "Error al crear la carpeta de imágenes" });
        }

        // 4. GUARDADO DE IMÁGENES
        // Corregido: inicializamos array vacío, NO usamos map sobre file.path (porque es undefined en memoria)
        const imagePaths = [];
        
        for (const file of files) {
            // Pasamos el archivo Y la carpeta donde debe guardarse
            const savedPath = await saveToDisk(file, targetFolder); 
            imagePaths.push(savedPath);
        }

        // 5. CREACIÓN EN BASE DE DATOS
        const newProduct = await Product.create({
            ...productData,
            images: imagePaths, // Array de rutas de imágenes para el frontend (lectura rápida)
            productFolder: targetFolder // Ruta base de la carpeta para tareas de mantenimiento
    });

        return res.status(201).json({ message: "Producto creado exitosamente", product: newProduct });


    }
    catch (error)
    {
        console.log(error)
        if( error instanceof UniqueConstraintError )
        {
            return res.status(409).json( { message: "Este producto ya existe" });
        }
        return res.status(500).json({ message: "Internal error" });
    }
};