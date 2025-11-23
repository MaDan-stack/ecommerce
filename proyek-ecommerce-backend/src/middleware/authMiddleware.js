const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // 1. Ambil token dari Header (Authorization: Bearer <token>)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            status: 'fail',
            message: 'Akses ditolak. Token tidak ditemukan.'
        });
    }

    try {
        // 2. Verifikasi token menggunakan kunci rahasia
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
        
        // 3. Simpan data user (id, role) ke dalam request agar bisa dipakai di controller
        req.user = decoded;
        
        next(); // Lanjut ke fungsi berikutnya (Controller)
    } catch (error) {
        console.error("Token verification error:", error.message);
        return res.status(403).json({
            status: 'fail',
            message: 'Token tidak valid atau kadaluarsa.'
        });
    }
};

module.exports = verifyToken;