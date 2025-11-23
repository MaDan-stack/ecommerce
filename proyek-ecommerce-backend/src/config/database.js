const { Sequelize } = require('sequelize');
require('dotenv').config();

const db = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: false // Set true jika ingin melihat query SQL di terminal
    }
);

module.exports = db;