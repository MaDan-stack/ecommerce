require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('node:path'); 
const db = require('./src/config/database');
const compression = require('compression');
const helmet = require('helmet');

// Import semua model
const { User, Authentication, Product, Variant, Order, OrderItem } = require('./src/models'); 

// Import Routes
const authRoutes = require('./src/routes/auth');
const productRoutes = require('./src/routes/products');
const orderRoutes = require('./src/routes/orders');
const uploadRoutes = require('./src/routes/upload');
const dashboardRoutes = require('./src/routes/dashboard');
const testimonialRoutes = require('./src/routes/testimonials');
const reviewRoutes = require('./src/routes/reviews');
const heroRoutes = require('./src/routes/hero');
const paymentRoutes = require('./src/routes/payments');

const app = express();
const PORT = process.env.PORT || 5000;

// --- KEAMANAN 1: CORS (Cross-Origin Resource Sharing) ---
// Hanya izinkan request dari Frontend yang terdaftar di CLIENT_URL
const corsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:5173', 
    credentials: true, // Izinkan cookie/header otentikasi
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
// --------------------------------------------------------

// --- KEAMANAN 2: Helmet (Header Security) ---
// Melindungi dari beberapa serangan web umum
if (process.env.NODE_ENV === 'production') {
    app.use(helmet()); 
}
// ---------------------------------------------

app.use(compression()); // Kompresi response agar lebih cepat
app.use(express.json());

// Middleware file statis (Hapus jika sudah 100% pindah ke Cloudinary, tapi simpan dulu untuk jaga-jaga)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.send('Server LokalStyle Berjalan Aman! 🔒');
});

// Daftarkan Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/payments', paymentRoutes);

const startServer = async () => {
    try {
        await db.authenticate();
        console.log('✅ Database Connected...');
        
        // Tips: Ubah alter: false jika di production agar tidak mengubah struktur tabel sembarangan
        const syncOptions = { alter: process.env.NODE_ENV !== 'production' };
        await db.sync(syncOptions); 
        
        console.log(`✅ Database Synced (Mode: ${process.env.NODE_ENV || 'Development'})`);

        app.listen(PORT, () => {
            console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
            console.log(`🛡️  Akses API dibatasi hanya untuk: ${corsOptions.origin}`);
        });
    } catch (error) {
        console.error('❌ Gagal terhubung ke database:', error);
    }
};

startServer();