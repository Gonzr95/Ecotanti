import Product from './product.js';
import Ticket from './ticket.js';
import Product_Ticket from './product_ticket.js';

Product.belongsToMany(Ticket, { 
    through: Product_Ticket, 
    foreignKey: 'ProductId' // Sequelize usa el nombre del modelo singular + Id por defecto
});

Ticket.belongsToMany(Product, { 
    through: Product_Ticket, 
    foreignKey: 'TicketId' // Sequelize usa el nombre del modelo singular + Id por defecto
});


export { Product, Ticket, ProductTicket};