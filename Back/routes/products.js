import { Router } from "express"
const router = Router();
import { createProductSchema } from "../schemas/product.js";
import { validateSchema } from "../middlewares/validator.js";
import { register } from "../controllers/product.js";


router.post("/products", validateSchema(createProductSchema), register);

export {router};