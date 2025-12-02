import { Router } from "express";
import { register, login, logout} from "../controllers/user.js";
import { validateSchema } from '../middlewares/validator.js'; // El middleware
import { registerUserSchema, loginUserSchema } from '../schemas/user.js'; // El esquema
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.post("/register", validateSchema(registerUserSchema), register);

router.post('/login', validateSchema(loginUserSchema), login);

router.delete('/logout', authenticate, logout, (req, res) => {
    res.json({ message: "Logout successful" });
});

// Ruta PROTEGIDA: Perfil
router.get('/me', authenticate, (req, res) => {
    // req.user viene del middleware authenticate
    res.json({ 
        message: "¡Estás en una ruta protegida!", 
        user: req.user
    });
});

export {router};