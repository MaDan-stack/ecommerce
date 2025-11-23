const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Order = db.define('orders', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // UserId akan ditambahkan otomatis lewat relasi
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'paid', 'shipped', 'completed', 'cancelled'),
        defaultValue: 'pending'
    },
    shippingAddress: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    contactName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contactPhone: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    freezeTableName: true
});

module.exports = Order;