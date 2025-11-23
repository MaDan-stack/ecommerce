require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('node:path'); // [Wajib] Import path
const db = require('./src/config/database');
// Import semua model agar tabel dibuat
const { User, Authentication, Product, Variant, Order, OrderItem } = require('./src/models'); 

// Import Routes
const authRoutes = require('./src/routes/auth');
const productRoutes = require('./src/routes/products');
const orderRoutes = require('./src/routes/orders');
const uploadRoutes = require('./src/routes/upload'); // [Wajib] Import route upload
const dashboardRoutes = require('./src/routes/dashboard');
const testimonialRoutes = require('./src/routes/testimonials');
const reviewRoutes = require('./src/routes/reviews');

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());
// [Wajib] Middleware untuk melayani file statis (gambar) dari folder 'uploads'
// Agar URL http://localhost:5000/uploads/gambar.jpg bisa dibuka
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.send('Server LokalStyle Berjalan! 🚀');
});

const compression = require('compression');
app.use(compression());

// Daftarkan Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes); // [Wajib] Pasang route upload
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/reviews', reviewRoutes);

const startServer = async () => {
    try {
        await db.authenticate();
        console.log('✅ Database Connected...');
        
        // Sinkronisasi tabel (alter: true aman untuk update struktur tanpa hapus data)
        await db.sync({ alter: true }); 
        console.log('✅ Database Synced');

        app.listen(PORT, () => {
            console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Gagal terhubung ke database:', error);
    }
};

startServer();