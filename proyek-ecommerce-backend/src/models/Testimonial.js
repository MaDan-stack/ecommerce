const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Testimonial = db.define('testimonials', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    img: {
        type: DataTypes.STRING,
        allowNull: true // Kita bisa set default avatar di frontend atau backend
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    freezeTableName: true
});

module.exports = Testimonial;