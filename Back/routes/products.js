import { Router } from "express"
const router = Router();
import { createProductSchema } from "../schemas/product.js";
import { validateSchema } from "../middlewares/validator.js";


router.post("/products", validateSchema(createProductSchema), (req, res) => {
    res.json({ message: "Crear un nuevo producto" });
});

export {router};