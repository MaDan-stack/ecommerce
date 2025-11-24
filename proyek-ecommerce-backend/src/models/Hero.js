const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Hero = db.define('hero_slides', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    img: {
        type: DataTypes.STRING, // URL Cloudinary
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    freezeTableName: true
});

module.exports = Hero;