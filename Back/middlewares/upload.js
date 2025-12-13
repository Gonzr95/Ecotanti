import multer from "multer";
import path from "path";

// Configuración del almacenamiento (DiskStorage)
const storage = multer.memoryStorage({
  destination: function (req, file, cb) {
    // Define la carpeta donde se guardarán las fotos
    // Asegúrate de que esta carpeta 'uploads/' exista en tu raíz
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    // Generamos un nombre único para evitar duplicados
    // Ej: producto-168123123-imagen.jpg
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Filtro para validar que solo suban imágenes (Opcional pero recomendado)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('No es un archivo de imagen válido'), false);
  }
};

export const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 6 } // Límite de 6MB
});

