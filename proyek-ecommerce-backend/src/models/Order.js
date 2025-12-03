const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Order = db.define('orders', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // UserId ditambahkan otomatis via relasi
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        // Update Status: Tambahkan 'awaiting_verification'
        type: DataTypes.ENUM('pending', 'awaiting_verification', 'paid', 'shipped', 'completed', 'cancelled'),
        defaultValue: 'pending'
    },
    // --- KOLOM BARU: BUKTI BAYAR ---
    paymentProof: {
        type: DataTypes.STRING,
        allowNull: true
    },
    // -------------------------------
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
    // --- PENTING: JANGAN HAPUS INDEX INI ---
    indexes: [
        {
            name: 'order_status_index',
            fields: ['status'] // Percepat Dashboard
        },
        {
            name: 'order_userid_index',
            fields: ['userId'] // Percepat Riwayat Pesanan
        }
    ]
});

module.exports = Order;