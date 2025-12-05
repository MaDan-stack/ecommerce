const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Subscriber = db.define('subscribers', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Mencegah email yang sama daftar 2x
        validate: {
            isEmail: true
        }
    }
}, {
    freezeTableName: true
});

module.exports = Subscriber;