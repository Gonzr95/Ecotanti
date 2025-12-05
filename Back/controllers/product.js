import { UniqueConstraintError } from "sequelize";
import { Product } from "../models/product.js";

import { checkProductExistence, 
         checkImages, 
         createFolder, 
         saveImages } 
from "../services/product.service.js";

// ************* funciones del controlador *************
/*
    recibir peticion extraer body y files , llamar a servicio y devolver respuesta
*/



// 1. Validar que el producto no exista SINO RETURN ERROR HECHO
// 2. Si no existe, verificar si hay imágenes SINO RETURN ERROR HECHO
// 3. Crear la carpeta dinamica sino existe. HECHO
// 4. Guardar las imagenes en disco HECHO
// 5. Crear el producto en base de datos hecho
export async function register(req, res) {
    try {
        const productData = req.body;
        await checkProductExistence(productData);

        // 2. SI LAS VALIDACIONES SON EXITOSAS, PROCEDEMOS A GUARDAR LAS IMÁGENES
        const files = req.files;
        await checkImages(files);

        const targetFolder = await createFolder(productData);
        const imagePaths = await saveImages(files, targetFolder);

        // 5. CREACIÓN EN BASE DE DATOS
        const newProduct = await Product.create({
            ...productData,
            images: imagePaths, // Array de rutas de imágenes para el frontend (lectura rápida)
            productFolder: targetFolder // Ruta base de la carpeta para tareas de mantenimiento
        });

        return res.status(201).json({ 
            message: "Producto creado exitosamente", 
            product: newProduct 
        });
    }
    catch (error)
    {
        console.log("Error en register:", error.message);

        // --- MANEJO DE ERRORES PERSONALIZADO ---

        // Error lanzado por checkProductExistence
        if (error.message === "PRODUCT_EXISTS") {
            return res.status(409).json({ message: "Este producto ya está registrado en el sistema." });
        }

        // Error lanzado por checkImages
        if (error.message === "NO_IMAGES") {
            return res.status(400).json({ message: "Se requiere al menos una imagen del producto." });
        }

        // Error lanzado por createFolder o saveImages
        if (error.message === "FILESYSTEM_ERROR") {
            return res.status(500).json({ message: "Error interno al procesar archivos." });
        }

        // Error nativo de Sequelize (por si se escapa algo)
        if (error instanceof UniqueConstraintError) {
            return res.status(409).json({ message: "Este producto ya existe (DB Constraint)." });
        }

        // Error genérico
        return res.status(500).json({ message: "Error interno del servidor", detail: error.message });
    }
};