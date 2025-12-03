const { DataTypes } = require('sequelize');
const db = require('../config/database');

const PaymentMethod = db.define('payment_methods', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    type: {
        type: DataTypes.ENUM('bank', 'qris'),
        allowNull: false
    },
    name: { // Nama Bank (BCA, Mandiri) atau Label QRIS
        type: DataTypes.STRING,
        allowNull: false
    },
    number: { // Nomor Rekening (Null jika QRIS)
        type: DataTypes.STRING,
        allowNull: true
    },
    holder: { // Atas Nama (Null jika QRIS)
        type: DataTypes.STRING,
        allowNull: true
    },
    image: { // URL Gambar (Wajib jika QRIS, Optional untuk Logo Bank)
        type: DataTypes.STRING,
        allowNull: true
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    freezeTableName: true
});

module.exports = PaymentMethod;