import { DataTypes } from "sequelize";
import { sequelize } from "../db/sequelize.js";

export const Product_Ticket = sequelize.define('Product_Ticket', {
    ticketID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true, // Parte de la clave compuesta (opcional pero recomendado)
        references: {
            model: 'tickets', // Nombre de la tabla en la BD (asegúrate que coincida)
            key: 'id'
        }
    },

    productID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true, // Parte de la clave compuesta
        references: {
            model: 'products', // Nombre de la tabla en la BD
            key: 'id'
        }
    },

    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: 'Cantidad de este producto en el ticket',
    },
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        comment: 'Precio unitario del producto al momento de la venta',
    },
    subtotal: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        comment: 'Cálculo de quantity * price',
    }
}, {
    tableName: 'product_ticket', 
    timestamps: false,           
});

export default Product_Ticket;
// Importa DataTypes de 'sequelize' si no está disponible.
// Si esto está en el mismo archivo donde defines Ticket y Product, usa el DataTypes ya importado.
