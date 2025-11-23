const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Authentication = db.define('authentications', {
    token: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false
});

module.exports = Authentication;