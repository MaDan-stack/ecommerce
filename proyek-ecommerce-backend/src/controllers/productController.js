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

            const { title, category, description, variants } = req.body;

            // --- LOGIKA UPLOAD GAMBAR BARU ---
            let imagePaths = [];
            
            // 1. Jika ada file yang diupload lewat Multer/Cloudinary
            if (req.files && req.files.length > 0) {
                imagePaths = req.files.map(file => file.path); 
            } 
            // 2. Fallback: Jika dikirim sebagai text/json array (jarang terjadi di add, tapi untuk jaga-jaga)
            else if (req.body.img) {
                imagePaths = Array.isArray(req.body.img) ? req.body.img : [req.body.img];
            }

            // Validasi: Wajib ada gambar minimal 1
            if (!title || !category || !description || imagePaths.length === 0) {
                return res.status(400).json({ status: 'fail', message: 'Data produk tidak lengkap. Minimal upload 1 gambar.' });
            }

            // --- SIMPAN KE DATABASE ---
            const newProduct = await Product.create({
                title, 
                category, 
                description, 
                img: imagePaths // Sequelize akan menyimpan array string ini
            });

            // --- SIMPAN VARIAN ---
            let parsedVariants = variants;
            // Jika dikirim via FormData, variants akan berbentuk String JSON
            if (typeof variants === 'string') {
                try {
                    parsedVariants = JSON.parse(variants);
                } catch (e) {
                    parsedVariants = [];
                }
            }

            if (parsedVariants && parsedVariants.length > 0) {
                const variantsData = parsedVariants.map(v => ({
                    productId: newProduct.id,
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

            const { id } = req.params;
            const { title, category, description, variants, existingImages } = req.body;

            const product = await Product.findByPk(id);
            if (!product) {
                return res.status(404).json({ status: 'fail', message: 'Produk tidak ditemukan' });
            }

            // --- LOGIKA UPDATE GAMBAR (MERGE STRATEGY) ---
            let finalImages = [];

            // 1. Ambil "Sisa Gambar Lama" yang dikirim Frontend (yang tidak dihapus user)
            // Frontend mengirim JSON String: "['url1', 'url2']"
            if (existingImages) {
                try {
                    const parsedExisting = JSON.parse(existingImages);
                    if (Array.isArray(parsedExisting)) {
                        finalImages = parsedExisting;
                    }
                } catch (error) {
                    console.error("Gagal parse existingImages:", error);
                    // Jika gagal parse, kita anggap tidak ada gambar lama yang dipertahankan
                    finalImages = [];
                }
            } else {
                // Jika frontend tidak mengirim existingImages sama sekali, 
                // Opsional: bisa tetap pakai product.img lama, atau anggap dihapus semua.
                // Di sini kita asumsi jika kosong berarti user menghapus semua gambar lama.
                finalImages = [];
            }

            // 2. Ambil "Gambar Baru" yang baru di-upload
            let newUploadedImages = [];
            if (req.files && req.files.length > 0) {
                newUploadedImages = req.files.map(file => file.path);
            }

            // 3. GABUNGKAN: Gambar Lama + Gambar Baru
            // Contoh: ['url_lama.jpg'] + ['url_baru.jpg'] = ['url_lama.jpg', 'url_baru.jpg']
            const mergedImages = [...finalImages, ...newUploadedImages];

            // Validasi: Jangan sampai produk tidak punya gambar sama sekali
            if (mergedImages.length === 0) {
                // Opsional: Kembalikan error atau biarkan (tergantung kebijakan app Anda)
                // return res.status(400).json({ msg: "Produk harus memiliki minimal 1 gambar." });
            }

            // --- UPDATE PRODUK ---
            await product.update({ 
                title, 
                category, 
                description, 
                img: mergedImages // Simpan array hasil gabungan
            });

            // --- UPDATE VARIAN ---
            // Logika: Hapus semua varian lama -> Buat ulang varian baru (sesuai input form)
            let parsedVariants = variants;
            if (typeof variants === 'string') {
                try {
                    parsedVariants = JSON.parse(variants);
                } catch (e) {
                    // Abaikan atau log error
                }
            }

            if (parsedVariants && parsedVariants.length > 0) {
                await Variant.destroy({ where: { productId: id } }); // Hapus lama
                
                const variantsData = parsedVariants.map(v => ({
                    productId: id,
                    size: v.size,
                    price: v.price,
                    stock: v.stock,
                    length: v.length || 0,
                    width: v.width || 0,
                    sleeveLength: v.sleeveLength || 0
                }));
                
                await Variant.bulkCreate(variantsData); // Buat baru
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