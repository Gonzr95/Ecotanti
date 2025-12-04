import { Router } from "express"
const router = Router();
import { upload } from "../middlewares/upload.js";
import { createProductSchema } from "../schemas/product.js";
import { validateSchema } from "../middlewares/validator.js";
import { register } from "../controllers/product.js";


//Imagenes es el nombre del campo que viene del from data
router.post("/products", 
    upload.array("images", 5), 
    validateSchema(createProductSchema), 
    register);

export {router};