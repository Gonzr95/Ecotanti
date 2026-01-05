import { Ticket } from "../models/ticket.js"
import { sequelize } from "../db/sequelize.js";
import { checkCartProducts } from "../services/product.service.js";
import Product from "../models/product.js";
import { Product_Ticket } from "../models/product_ticket.js";


/*
    3. Calculo de subtotal por si un producto lleva mas de una unidad
    4. Calculo del total del ticket
    5. Creacion de ticket
    6. Creacion de los registros en la tabla intermedia
    7. commit o rollback de la transaccion
    8. Descontar stock si la transaccion fue exitosa
    9 .Devolver respuesta
*/

export async function register(req, res){
    console.log("Iniciando proceso de creación de ticket...");
    const t = await sequelize.transaction();
    try{

        //cart propiedad que viene del body
        const { customerData, cart: cartData } = req.body;
        //checkCartProducts valida existencia de id del producto y stock y devuelve los productos solicitados
        console.log("Cart data recibida en ticket controller:", cartData);
        const dbProducts = await checkCartProducts(cartData);
        //console.log(dbProducts);
        if(!dbProducts){
            return res.status(400).json({ message: "Algunos productos no existen o no tienen stock suficiente." });
        }

        // preparar subtotales para que ya queden en ticket
        let total = 0;
        const ticketItemsData = [];

        for (const cartItem of cartData) {
            // Encontramos el producto real de la DB correspondiente al item del carrito
            const productDB = dbProducts.find(p => p.id === cartItem.id);
            const price = productDB.price;
            const quantity = cartItem.quantity;
            const subtotal = price * quantity;
            total += subtotal;

            ticketItemsData.push({
                productID: productDB.id,
                quantity: quantity,
                price: price,
                subtotal: subtotal
            });

            await productDB.decrement('stock', { by: quantity, transaction: t } );            
        }
        const newTicket = await Ticket.create({
            customerName: customerData.name,
            customerLastName: customerData.lastName,
            total: total
        }, { transaction: t }); 


        // --- 6. Creación de registros en tabla intermedia ---
        // Agregamos el ID del ticket recién creado a nuestros items preparados
        const rowsToInsert = ticketItemsData.map(item => ({
            ...item,
            ticketID: newTicket.id
        }));


        // Usamos bulkCreate para eficiencia (una sola consulta INSERT grande)
        await Product_Ticket.bulkCreate(rowsToInsert, { transaction: t });

        // --- 7. Commit de la transacción ---
        await t.commit();

        // --- 9. Devolver respuesta ---
        return res.status(201).json({
            message: "Ticket creado exitosamente",
            ticketId: newTicket.id,
            total: total
        });

    } catch (error) {
        // --- 7. (Alternativo) Rollback en caso de error ---
        await t.rollback();
        console.error("Error en transacción de compra:", error);

        return res.status(500).json({ 
            message: "Error procesando la compra", 
            error: error.message 
        });
    }
};