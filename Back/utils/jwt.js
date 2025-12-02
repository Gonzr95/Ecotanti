import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config(); // Cargar variables desde .env

const SECRET = process.env.JWT_SECRET || 'secreto_temporal_para_desarrollo'; // Fallback por seguridad

export function generateToken(payload) {
    // El token expira en 2 horas (puedes cambiarlo a '7d', '15m', etc.)
    return jwt.sign(payload, SECRET, { expiresIn: '10m' });
}

export function verifyToken(token) {
    try {
        return jwt.verify(token, SECRET);
    } catch (error) {
        return null; // Si falla o expira, retorna null
    }
}