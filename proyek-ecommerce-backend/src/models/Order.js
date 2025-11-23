const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Order = db.define('orders', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // UserId ditambahkan otomatis via relasi, tapi kita bisa index manual nanti
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
    freezeTableName: true,
    // --- OPTIMASI: MENAMBAHKAN INDEX ---
    indexes: [
        {
            name: 'order_status_index',
            fields: ['status'] // Mempercepat query Dashboard (Total Revenue)
        },
        {
            name: 'order_userid_index',
            fields: ['userId'] // Mempercepat load "Riwayat Pesanan" user
        }
    ]
});

module.exports = Order;