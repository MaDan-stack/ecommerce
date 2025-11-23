const { Review, Order, OrderItem, Product, User } = require('../models');

const reviewController = {
    // POST: Tambah Review
    addReview: async (req, res) => {
        try {
            const userId = req.user.id;
            const { productId, orderId, rating, comment } = req.body;

            // 1. Validasi: Cek apakah order ini benar milik user dan statusnya 'completed'
            const validOrder = await Order.findOne({
                where: {
                    id: orderId,
                    userId: userId,
                    status: 'completed' // HANYA BOLEH REVIEW JIKA SELESAI
                },
                include: [{
                    model: OrderItem,
                    where: { productId: productId } // Pastikan produk ini ada di dalam order
                }]
            });

            if (!validOrder) {
                return res.status(403).json({ 
                    status: 'fail', 
                    message: 'Anda tidak bisa mengulas produk ini (Belum dibeli atau pesanan belum selesai).' 
                });
            }

            // 2. Validasi: Cek Duplikasi (Satu produk per order cuma boleh 1 review)
            const existingReview = await Review.findOne({
                where: { userId, productId, orderId }
            });

            if (existingReview) {
                return res.status(400).json({ 
                    status: 'fail', 
                    message: 'Anda sudah memberikan ulasan untuk produk ini di pesanan tersebut.' 
                });
            }

            // 3. Simpan Review
            await Review.create({
                userId,
                productId,
                orderId,
                rating,
                comment
            });

            // 4. Update Rating Rata-rata Produk (Opsional tapi Bagus)
            // Kita hitung ulang rata-rata rating produk ini
            const allReviews = await Review.findAll({ where: { productId } });
            const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
            const newAvgRating = totalRating / allReviews.length;

            await Product.update(
                { 
                    rating: newAvgRating,
                    reviewCount: allReviews.length 
                },
                { where: { id: productId } }
            );

            res.status(201).json({
                status: 'success',
                message: 'Ulasan berhasil dikirim!'
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ status: 'error', message: error.message });
        }
    },

    // GET: Ambil Review per Produk
    getProductReviews: async (req, res) => {
        try {
            const { productId } = req.params;
            const reviews = await Review.findAll({
                where: { productId },
                include: [{
                    model: User,
                    attributes: ['name'] // Tampilkan nama reviewer
                }],
                order: [['createdAt', 'DESC']]
            });

            res.json({ status: 'success', data: reviews });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
};

module.exports = reviewController;