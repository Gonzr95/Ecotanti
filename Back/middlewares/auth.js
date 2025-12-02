import { verifyToken } from '../utils/jwt.js';
import { BlacklistedToken } from '../models/blacklistedToken.js'; // Importamos el modelo

export const authenticate = async (req, res, next) => {
    // 1. Obtener el header Authorization
    // El formato estándar es: "Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "Token no proporcionado" });
    }

    // 2. Extraer el token (quitar la palabra "Bearer ")
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Formato de token inválido" });
    }


    // --- NUEVA CAPA DE SEGURIDAD ---
    // Verificamos si el token está en la lista negra
    const isBlacklisted = await BlacklistedToken.findOne({ where: { token } });
    
    if (isBlacklisted) {
        return res.status(401).json({ message: "Token invalidado. Inicie sesión nuevamente." });
    }


    // 3. Verificar el token
    const decoded = verifyToken(token);

    console.log("Decoded token:", decoded);
    if (!decoded) {
        return res.status(403).json({ message: "Token inválido o expirado" });
    }

    // 4. Adjuntar el usuario decodificado a la request
    // Esto nos permite saber QUIÉN es el usuario en el siguiente controlador
    req.user = decoded;

    next();
};