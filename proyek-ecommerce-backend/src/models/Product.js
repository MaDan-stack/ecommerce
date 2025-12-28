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
        // PERUBAHAN: Menggunakan JSON untuk menyimpan Array URL gambar
        type: DataTypes.JSON, 
        allowNull: false,
        defaultValue: [],
        get() {
            // Helper: Memastikan output selalu Array, meskipun di database tersimpan sebagai string
            const rawValue = this.getDataValue('img');
            if (typeof rawValue === 'string') {
                try {
                    return JSON.parse(rawValue);
                } catch (e) {
                    return [rawValue];
                }
            }
            return rawValue;
        }
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
    indexes: [
        {
            name: 'product_category_index',
            fields: ['category']
        },
        {
            name: 'product_title_index',
            fields: ['title']
        }
    ]
});

module.exports = Product;