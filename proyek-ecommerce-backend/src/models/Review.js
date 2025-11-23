const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Review = db.define('reviews', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    // Foreign Keys (UserId, ProductId, OrderId) akan ditambahkan via relasi
}, {
    freezeTableName: true
});

module.exports = Review;