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
        type: DataTypes.STRING, // URL Gambar (Cloudinary)
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
}, {
    freezeTableName: true,
    // --- OPTIMASI: MENAMBAHKAN INDEX ---
    indexes: [
        {
            name: 'product_category_index', // Nama index (bebas)
            fields: ['category']            // Mempercepat filter kategori
        },
        {
            name: 'product_title_index',
            fields: ['title']               // Mempercepat pencarian nama
        }
    ]
});

module.exports = Product;