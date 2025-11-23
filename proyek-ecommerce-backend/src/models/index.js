const User = require('./User');
const Authentication = require('./Authentication');
const Product = require('./Product');
const Variant = require('./Variant'); //
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// Relasi Product <-> Variant (PENTING)
Product.hasMany(Variant, { foreignKey: 'productId', onDelete: 'CASCADE' });
Variant.belongsTo(Product, { foreignKey: 'productId' });

// Relasi User <-> Order
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

// Relasi Order <-> OrderItem
Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

// Relasi Product <-> OrderItem
Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

module.exports = {
    User,
    Authentication,
    Product,
    Variant,
    Order,
    OrderItem
};