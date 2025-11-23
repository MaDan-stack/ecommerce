const { Product, Variant } = require('../models');
const { Op } = require('sequelize');

const productController = {
    // --- 1. GET ALL PRODUCTS (Public) ---
    getAllProducts: async (req, res) => {
        try {
            const { title, category } = req.query;
            let whereClause = {};

            if (title) {
                whereClause.title = { [Op.iLike]: `%${title}%` };
            }
            if (category) {
                whereClause.category = category;
            }

            const products = await Product.findAll({
                where: whereClause,
                include: [{ model: Variant }],
                order: [['createdAt', 'DESC']]
            });

            res.json({ status: 'success', data: { products } });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: 'error', message: error.message });
        }
    },

    // --- 2. GET PRODUCT BY ID (Public) ---
    getProductById: async (req, res) => {
        try {
            const { id } = req.params;
            const product = await Product.findByPk(id, {
                include: [{ model: Variant }] 
            });

            if (!product) {
                return res.status(404).json({ status: 'fail', message: 'Produk tidak ditemukan' });
            }

            res.json({ status: 'success', data: { product } });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    },

    // --- 3. ADD PRODUCT (Admin Only) ---
    addProduct: async (req, res) => {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({ status: 'fail', message: 'Akses ditolak.' });
            }

            const { title, category, description, img, variants } = req.body;

            if (!title || !category || !description || !img) {
                return res.status(400).json({ status: 'fail', message: 'Data produk tidak lengkap.' });
            }

            // 1. Simpan Produk Utama
            const newProduct = await Product.create({
                title, category, description, img
            });

            // 2. Simpan Varian
            if (variants && variants.length > 0) {
                const variantsData = variants.map(v => ({
                    productId: newProduct.id, // Benar: menggunakan ID produk baru
                    size: v.size,
                    price: v.price,
                    stock: v.stock,
                    length: v.length || 0,
                    width: v.width || 0,
                    sleeveLength: v.sleeveLength || 0
                }));
                
                await Variant.bulkCreate(variantsData);
            }

            res.status(201).json({
                status: 'success',
                message: 'Produk berhasil ditambahkan',
                data: { productId: newProduct.id }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: 'error', message: error.message });
        }
    },

    // --- 4. EDIT PRODUCT (Admin Only) ---
    editProduct: async (req, res) => {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({ status: 'fail', message: 'Akses ditolak.' });
            }

            const { id } = req.params; // ID diambil dari URL
            const { title, category, description, img, variants } = req.body;

            const product = await Product.findByPk(id);
            if (!product) {
                return res.status(404).json({ status: 'fail', message: 'Produk tidak ditemukan' });
            }

            // 1. Update Info Produk Utama
            await product.update({ title, category, description, img });

            // 2. Update Varian
            if (variants && variants.length > 0) {
                // Hapus varian lama terlebih dahulu
                await Variant.destroy({ where: { productId: id } }); 
                
                const variantsData = variants.map(v => ({
                    productId: id, // PERBAIKAN DI SINI: Gunakan 'id' dari params, BUKAN newProduct.id
                    size: v.size,
                    price: v.price,
                    stock: v.stock,
                    length: v.length || 0,
                    width: v.width || 0,
                    sleeveLength: v.sleeveLength || 0
                }));
                
                await Variant.bulkCreate(variantsData); // Masukkan varian baru
            }

            res.json({
                status: 'success',
                message: 'Produk berhasil diperbarui'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: 'error', message: error.message });
        }
    },

    // --- 5. DELETE PRODUCT (Admin Only) ---
    deleteProduct: async (req, res) => {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({ status: 'fail', message: 'Akses ditolak.' });
            }

            const { id } = req.params;
            
            const deleted = await Product.destroy({ where: { id } });

            if (!deleted) {
                return res.status(404).json({ status: 'fail', message: 'Produk tidak ditemukan' });
            }

            res.json({
                status: 'success',
                message: 'Produk berhasil dihapus'
            });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
};

module.exports = productController;