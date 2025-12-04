import { UniqueConstraintError } from "sequelize";
import { Product } from "../models/product.js"



export async function register(req, res) {
    try {
        const { productType, brand, lineUp, description, stock, price, isActive } = req.body;

        const newProduct = await Product.create({
            productType,
            brand,
            lineUp,
            description,
            stock,
            price,
            isActive
        });
        
        return res.status(201).newProduct.toJSON();


    }
    catch (error)
    {
        if( error instanceof UniqueConstraintError )
        {
            return res.status(409).json( { message: "Este producto ya existe" });
        }
        return res.status(500).json({ message: "Internal error" });
    }
};