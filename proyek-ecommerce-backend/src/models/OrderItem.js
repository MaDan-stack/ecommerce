const { DataTypes } = require('sequelize');
const db = require('../config/database');

const OrderItem = db.define('order_items', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // OrderId dan ProductId akan ditambahkan otomatis lewat relasi
    productTitle: {
        type: DataTypes.STRING,
        allowNull: false
    },
    variantSize: {
        type: DataTypes.STRING,
        allowNull: true
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: { // Harga saat dibeli (penting jika harga produk berubah nanti)
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    freezeTableName: true
});

module.exports = OrderItem;