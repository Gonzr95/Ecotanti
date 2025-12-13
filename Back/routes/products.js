import { Router } from "express"
const router = Router();
import { upload } from "../middlewares/upload.js";
import { createProductSchema } from "../schemas/product.js";
import { validateSchema } from "../middlewares/validator.js";
import { register, getCategories, getAllProducts} from "../controllers/product.js";

// ------ RUTAS ESPECÍFICAS PRIMERO ------

//Imagenes es el nombre del campo que viene del from data
router.post("/products", 
    upload.array("images", 5), 
    validateSchema(createProductSchema), 
    register);

export {router};

router.get("/products", getAllProducts);
router.get("/products/categories", getCategories);
