import Product from './product.js';
import Ticket from './ticket.js';
import Product_Ticket from './product_ticket.js';

// Relación: Un Producto pertenece a muchos Tickets
// Other keys evita duplicados en las asociaciones
Product.belongsToMany(Ticket, { 
    through: Product_Ticket, 
    foreignKey: 'productID', // La llave en la tabla intermedia que apunta a Product
    otherKey: 'ticketID'     // La llave en la tabla intermedia que apunta a Ticket
});

// Relación: Un Ticket pertenece a muchos Productos
Ticket.belongsToMany(Product, { 
    through: Product_Ticket, 
    foreignKey: 'ticketID',  // La llave en la tabla intermedia que apunta a Ticket
    otherKey: 'productID'    // La llave en la tabla intermedia que apunta a Product
});


export { Product, Ticket, Product_Ticket};