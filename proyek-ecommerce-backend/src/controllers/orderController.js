const { Order, OrderItem, Variant } = require('../models'); // 1. Tambahkan Variant

const orderController = {
    // --- CREATE ORDER (User Checkout) ---
    createOrder: async (req, res) => {
        try {
            const userId = req.user.id; 
            const { items, totalAmount, shippingAddress, contactName, contactPhone } = req.body;

            if (!items || items.length === 0) {
                return res.status(400).json({ status: 'fail', message: 'Keranjang kosong' });
            }

            // 1. Buat Pesanan Utama
            const newOrder = await Order.create({
                userId,
                totalAmount,
                status: 'pending',
                shippingAddress,
                contactName,
                contactPhone
            });

            // 2. Simpan Detail Item
            const orderItemsData = items.map(item => ({
                orderId: newOrder.id,
                productId: item.product.id,
                productTitle: item.product.title,
                variantSize: item.variant.size,
                quantity: item.quantity,
                price: item.variant.price
            }));

            await OrderItem.bulkCreate(orderItemsData);

            // --- 3. LOGIKA BARU: KURANGI STOK ---
            // Loop setiap item untuk mengurangi stok di database
            for (const item of items) {
                // Pastikan kita punya ID varian (karena harga & stok ada di tabel Variant)
                if (item.variant && item.variant.id) {
                    const variantInDb = await Variant.findByPk(item.variant.id);
                    
                    if (variantInDb) {
                        // Kurangi stok sesuai jumlah pembelian
                        // Pengecekan sederhana agar stok tidak minus
                        if (variantInDb.stock >= item.quantity) {
                             await variantInDb.decrement('stock', { by: item.quantity });
                        } else {
                             // Opsional: Stok habis, set ke 0
                             await variantInDb.update({ stock: 0 });
                        }
                    }
                }
            }
            // ------------------------------------

            res.status(201).json({
                status: 'success',
                message: 'Pesanan berhasil dibuat dan stok diperbarui',
                data: {
                    orderId: newOrder.id
                }
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ status: 'error', message: 'Gagal memproses pesanan' });
        }
    },

    // --- GET MY ORDERS ---
    getMyOrders: async (req, res) => {
        try {
            const userId = req.user.id;
            const orders = await Order.findAll({
                where: { userId },
                include: [ { model: OrderItem } ],
                order: [['createdAt', 'DESC']]
            });

            res.json({ status: 'success', data: { orders } });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: 'error', message: 'Gagal mengambil riwayat pesanan' });
        }
    },
    
    // --- GET ALL ORDERS ---
    getAllOrders: async (req, res) => {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({ status: 'fail', message: 'Akses ditolak' });
            }
            const orders = await Order.findAll({
                include: [ { model: OrderItem } ],
                order: [['createdAt', 'DESC']]
            });
            res.json({ status: 'success', data: { orders } });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: 'error', message: 'Gagal mengambil data pesanan' });
        }
    },

    // --- UPDATE ORDER STATUS (Admin Only) ---
    updateOrderStatus: async (req, res) => {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({ status: 'fail', message: 'Akses ditolak' });
            }

            const { id } = req.params;
            const { status } = req.body; // status baru: 'shipped', 'completed', dll

            const order = await Order.findByPk(id);
            if (!order) {
                return res.status(404).json({ status: 'fail', message: 'Pesanan tidak ditemukan' });
            }

            order.status = status;
            await order.save();

            res.json({
                status: 'success',
                message: 'Status pesanan berhasil diperbarui'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: 'error', message: 'Gagal memperbarui pesanan' });
        }
    }
};

module.exports = orderController;