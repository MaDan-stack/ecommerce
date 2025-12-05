const { Sequelize } = require('sequelize');
require('dotenv').config();

let db;

// Skenario 1: PRODUCTION / CLOUD (Ada DATABASE_URL di .env)
// Jika Anda menaruh link Neon di .env, kode ini yang akan jalan
if (process.env.DATABASE_URL) {
    console.log("🔄 Mencoba koneksi ke Database Cloud (Neon)...");
    db = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false // Wajib untuk Neon/Render
            }
        },
        logging: false
    });
} 
// Skenario 2: DEVELOPMENT / LOKAL (Pakai DB_NAME, DB_USER, dll)
else {
    console.log("💻 Mencoba koneksi ke Database Lokal (Laptop)...");
    db = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASS,
        {
            host: process.env.DB_HOST,
            dialect: 'postgres',
            logging: false
        }
    );
}

module.exports = db;