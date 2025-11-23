const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Variant = db.define('variants', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    size: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    // --- KOLOM BARU ---
    length: { // Panjang Badan
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    width: { // Lebar Dada
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    sleeveLength: { // Panjang Lengan
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    }
}, {
    freezeTableName: true
});

module.exports = Variant;