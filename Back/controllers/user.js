import * as userService from "../services/user.service.js";
import { UniqueConstraintError } from 'sequelize';

export async function register(req, res) {
    try {
        const result = await userService.register(req.body);
        return res.status(201).json(result);
        
    } catch (error) {
        if (error instanceof UniqueConstraintError) {
            return res.status(409).json({ message: "El email ya existe" });
        }
        // Manejo genérico
        console.error(error);
        return res.status(500).json({ message: "Internal error" });
    }
};

export async function login(req, res) {
    try {
        const result = await userService.loginUser(req.body);
        return res.status(200).json(result);

    } catch (error) {
        // Manejo de errores de negocio
        if (error.message === "USER_NOT_FOUND" || error.message === "WRONG_PASSWORD") {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        console.error(error);
        return res.status(500).json({ message: "Internal error" });
    }
}

export async function logout(req, res) {
    try {
        // Necesitamos el token puro. 
        // Como este endpoint estará protegido, sabemos que viene en el header.
        const authHeader = req.headers.Authorization;
        const token = authHeader.split(' ')[1];

        await userService.logoutUser(token);

        return res.status(200).json({ message: "Sesión cerrada exitosamente" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal error" });
    }
}