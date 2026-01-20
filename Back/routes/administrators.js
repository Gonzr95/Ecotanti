import { Router } from "express";
import { validateSchema } from '../middlewares/validator.js';
import { registerAdminSchema, loginAdminSchema } from '../schemas/administrator.js'; // El esquema
import { register, login, logout} from "../controllers/administrators.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.post("/administrators/register", validateSchema(registerAdminSchema), register);

router.post('/administrators/login', validateSchema(loginAdminSchema), login);

router.delete('/administrators/logout', authenticate, logout, (req, res) => {
    res.json({ message: "Logout successful" });
});

// Ruta PROTEGIDA: Perfil
router.get('/me', authenticate, (req, res) => {
    // req.admin viene del middleware authenticate
    res.json({ 
        message: "¡Estás en una ruta protegida!", 
        admin: req.admin
    });
});

export {router};