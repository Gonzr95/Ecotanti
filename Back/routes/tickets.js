import { Router } from "express";
const router = Router();
import { Product, Ticket } from "../models/ticket.js";
import { validateSchema } from "../middlewares/validator.js";


// 1.desarrollar logica para el schema del body ticket
// debe traer array de productos con su cantidad y el precio ya que este en la tabla de productos se puede actualizar
// debe traer nombre de cliente
// 


router.post("/tickets", async (req, res) => {


};