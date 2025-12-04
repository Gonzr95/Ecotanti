import Product from './product.js';
import Ticket from './ticket.js';

Product.belongsToMany(Ticket, { through: 'product_ticket', foreignKey: 'id' });
Ticket.belongsToMany(Product, { through: 'product_ticket', foreignKey: 'id' });

export { Product, Ticket };

