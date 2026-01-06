import { Ticket, Product, Product_Ticket } from "../models/relations.js";
import { sequelize } from "../db/sequelize.js";
import { checkCartProducts } from "../services/product.service.js";

import PDFDOcument from "pdfkit";

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

export async function generateTicketPDF(req, res) {
    try {
        const { id } = req.params;

        // Buscar el ticket por ID
// 1. Buscamos el Ticket
        const ticket = await Ticket.findByPk(id, {
            include: [
                {
                    model: Product,
                    attributes: ['id', 'brand', 'lineUp', 'price'], 
                    // IMPORTANTE: Aquí referenciamos el modelo intermedio tal cual lo importaste
                    through: {
                        model: Product_Ticket,
                        attributes: ['quantity', 'price'] 
                    }
                }
            ]
        });

        if( !ticket ) {
            return res.status(404).json({ message: "Ticket no encontrado" });
        }

        // Crear el documento PDF
        const doc = new PDFDOcument();
        const fileName = `ticket_${ticket.id}.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        doc.pipe(res);


        // Encabezado
        doc.fontSize(20).text('Comprobante de Compra', { align: 'center' });
        doc.moveDown();

        // Datos del Ticket (Datos de la tabla Ticket)
        doc.fontSize(12).font('Helvetica-Bold').text(`Ticket N°: ${ticket.id}`);
        doc.font('Helvetica').text(`Fecha: ${new Date(ticket.createdAt).toLocaleDateString()}`);
        doc.moveDown();

        // Datos del Cliente
        doc.text(`Cliente: ${ticket.customerName} ${ticket.customerLastName}`); // Usando tus nombres de columna
        doc.moveDown();

        // Línea separadora
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown();

        // Encabezados de la tabla de productos
        const tableTop = doc.y;
        doc.font('Helvetica-Bold');
        doc.text('Producto', 50, tableTop);
        doc.text('Cant.', 300, tableTop);
        doc.text('Precio Unit.', 370, tableTop);
        doc.text('Subtotal', 470, tableTop);
        doc.font('Helvetica');
        doc.moveDown();

        // Iterar sobre los productos encontrados
        let positionY = doc.y;

        ticket.Products.forEach(product => {
            // NOTA IMPORTANTE:
            // En Sequelize, los datos de la tabla intermedia (ProductTicket)
            // se guardan usualmente en una propiedad llamada igual que la tabla,
            // o simplemente 'ProductTicket'. 
            
            const quantity = product.Product_Ticket.quantity; 
            const price = product.Product_Ticket.price; 
            const subtotal = quantity * price;
            const productName = `${product.brand} ${product.lineUp}`;

            // Imprimir fila
            doc.text(productName, 50, positionY, { width: 240 });
            doc.text(quantity.toString(), 300, positionY);
            doc.text(`$${price}`, 370, positionY);
            doc.text(`$${subtotal}`, 470, positionY);
            
            positionY += 20; // Bajar 20px para la siguiente fila
        });

        // Línea separadora final
        doc.moveDown();
        doc.moveTo(50, positionY).lineTo(550, positionY).stroke();
        
        // Total (Este dato viene directo de la tabla Ticket)
        positionY += 15;
        doc.fontSize(14).font('Helvetica-Bold');
        doc.text(`TOTAL A ABONAR: $${ticket.total}`, 300, positionY, { align: 'right' }); // Alineado a la derecha pero partiendo de 300

        // 5. Finalizar
        doc.end();


    } catch (error) {
        console.error("Error generando PDF del ticket:", error);
        return res.status(500).json({ message: "Error generando el PDF del ticket" });
    }
}