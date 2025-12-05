const User = require('./User');
const Authentication = require('./Authentication');
const Product = require('./Product');
const Variant = require('./Variant'); //
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Testimonial = require('./Testimonial');
const Review = require('./Review');
const Hero = require('./Hero');
const PaymentMethod = require('./PaymentMethod');
const Subscriber = require('./Subscriber');

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

// Relasi User <-> Testimonial
User.hasMany(Testimonial, { foreignKey: 'userId' });
Testimonial.belongsTo(User, { foreignKey: 'userId' });

// Relasi Review

// User menulis banyak Review
User.hasMany(Review, { foreignKey: 'userId' });
Review.belongsTo(User, { foreignKey: 'userId' });

// Produk memiliki banyak Review
Product.hasMany(Review, { foreignKey: 'productId' });
Review.belongsTo(Product, { foreignKey: 'productId' });

// Review terikat pada satu Order (Bukti Pembelian)
Order.hasMany(Review, { foreignKey: 'orderId' });
Review.belongsTo(Order, { foreignKey: 'orderId' });

module.exports = {
    User,
    Authentication,
    Product,
    Variant,
    Order,
    OrderItem,
    Testimonial,
    Review,
    Hero,
    PaymentMethod,
    Subscriber
};