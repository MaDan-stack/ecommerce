const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Product = db.define('products', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    img: {
        type: DataTypes.STRING, // URL Gambar
        allowNull: false
    },
    rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    reviewCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
    // Harga dan Stok nanti bisa di tabel Variants, tapi untuk simpel kita bisa taruh sini dulu atau skip
}, {
    freezeTableName: true,
    indexes: [
        { fields: ['category'] }, // Mempercepat filter kategori
        { fields: ['title'] }     // Mempercepat search
    ]
});

module.exports = Product;