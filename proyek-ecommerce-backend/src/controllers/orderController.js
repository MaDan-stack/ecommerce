const { Order, OrderItem, Variant, sequelize } = require('../models');
const db = require('../config/database'); 

const orderController = {
    createOrder: async (req, res) => {
        // Mulai Transaksi Database
        const t = await db.transaction();

        try {
            const userId = req.user.id;
            const { items, totalAmount, shippingAddress, contactName, contactPhone } = req.body;

            if (!items || items.length === 0) {
                await t.rollback();
                return res.status(400).json({ status: 'fail', message: 'Keranjang kosong' });
            }

            // --- LANGKAH 1: Validasi & Kunci Stok (Pessimistic Locking) ---
            // Kita cek stok DULUAN sebelum membuat Order.
            for (const item of items) {
                const variant = await Variant.findByPk(item.variant.id, {
                    transaction: t,
                    lock: t.LOCK.UPDATE // PENTING: Ini mencegah user lain mengedit baris ini sampai transaksi selesai
                });

                if (!variant) {
                    throw new Error(`Varian untuk produk ${item.product.title} tidak ditemukan.`);
                }

                if (variant.stock < item.quantity) {
                    throw new Error(`Stok habis untuk ${item.product.title} ukuran ${variant.size}. Sisa: ${variant.stock}`);
                }

                // Kurangi stok langsung di sini (dalam memori transaksi)
                await variant.decrement('stock', { by: item.quantity, transaction: t });
            }

            // --- LANGKAH 2: Buat Order ---
            const newOrder = await Order.create({
                userId,
                totalAmount,
                status: 'pending', // Ubah ke 'paid' nanti jika Payment Gateway sudah ada
                shippingAddress,
                contactName,
                contactPhone
            }, { transaction: t });

            // --- LANGKAH 3: Buat Order Items ---
            const orderItemsData = items.map(item => ({
                orderId: newOrder.id,
                productId: item.product.id,
                productTitle: item.product.title,
                variantSize: item.variant.size,
                quantity: item.quantity,
                price: item.variant.price
            }));

            await OrderItem.bulkCreate(orderItemsData, { transaction: t });

            // --- FINAL: Commit Transaksi ---
            // Jika kode sampai sini tanpa error, simpan perubahan permanen ke DB
            await t.commit();

            res.status(201).json({
                status: 'success',
                message: 'Pesanan berhasil dibuat',
                data: {
                    orderId: newOrder.id
                }
            });

        } catch (error) {
            // Jika ada error apapun (Stok habis, DB mati), batalkan SEMUA perubahan
            await t.rollback();
            
            console.error("Transaction Error:", error.message);
            
            // Kirim pesan error yang spesifik ke user (misal: Stok habis)
            return res.status(400).json({ 
                status: 'fail', 
                message: error.message || 'Gagal memproses pesanan' 
            });
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

            // 1. Ambil query param (page & limit)
            const page = Number.parseInt(req.query.page) || 1;
            const limit = Number.parseInt(req.query.limit) || 10; // Default 10 per halaman
            const offset = (page - 1) * limit;

            // 2. Gunakan findAndCountAll (Ambil data + Hitung total)
            const { count, rows } = await Order.findAndCountAll({
                include: [ { model: OrderItem } ],
                order: [['createdAt', 'DESC']],
                limit: limit,
                offset: offset,
                distinct: true // agar count akurat saat ada include
            });

            // 3. Hitung total halaman
            const totalPages = Math.ceil(count / limit);

            res.json({ 
                status: 'success', 
                data: { 
                    orders: rows,
                    pagination: {
                        totalItems: count,
                        totalPages: totalPages,
                        currentPage: page,
                        itemsPerPage: limit
                    }
                } 
            });
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
            const { status, trackingNumber } = req.body; // Ambil trackingNumber

            const order = await Order.findByPk(id);
            if (!order) {
                return res.status(404).json({ status: 'fail', message: 'Pesanan tidak ditemukan' });
            }

            order.status = status;
            
            // Jika status dikirim, simpan resi
            if (status === 'shipped' && trackingNumber) {
                order.trackingNumber = trackingNumber;
            }

            await order.save();

            res.json({
                status: 'success',
                message: 'Status pesanan berhasil diperbarui'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: 'error', message: 'Gagal memperbarui pesanan' });
        }
    },
    
    uploadPaymentProof: async (req, res) => {
        try {
            const { id } = req.params; // ID Order
            
            // Cek apakah ada file
            if (!req.file) {
                return res.status(400).json({ status: 'fail', message: 'Harap upload gambar bukti pembayaran' });
            }

            const order = await Order.findByPk(id);
            
            // Validasi kepemilikan order (Keamanan)
            if (!order) {
                return res.status(404).json({ status: 'fail', message: 'Pesanan tidak ditemukan' });
            }
            if (order.userId !== req.user.id && req.user.role !== 'admin') {
                return res.status(403).json({ status: 'fail', message: 'Ini bukan pesanan Anda' });
            }

            // Update Order
            order.paymentProof = req.file.path; // URL dari Cloudinary
            order.status = 'awaiting_verification'; // Status berubah
            await order.save();

            res.json({
                status: 'success',
                message: 'Bukti pembayaran berhasil diupload. Mohon tunggu verifikasi admin.',
                data: { 
                    paymentProof: order.paymentProof,
                    status: order.status
                }
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ status: 'error', message: 'Gagal upload bukti pembayaran' });
        }
    },
};

module.exports = orderController;