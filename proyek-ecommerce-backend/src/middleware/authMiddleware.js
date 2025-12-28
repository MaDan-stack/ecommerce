const jwt = require('jsonwebtoken');

// 1. Middleware Verifikasi Token (Login Check)
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            status: 'fail',
            message: 'Akses ditolak. Token tidak ditemukan.'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
        req.user = decoded; // Simpan data user (id, role) ke request
        next();
    } catch (error) {
        return res.status(403).json({
            status: 'fail',
            message: 'Token tidak valid atau kadaluarsa.'
        });
    }
};

// 2. Middleware Khusus Admin (Role Check)
// --- INI YANG SEBELUMNYA HILANG ---
const adminOnly = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ 
            status: 'fail', 
            message: 'Akses ditolak. Khusus Admin.' 
        });
    }
    next();
};

// 3. Export sebagai Objek
module.exports = { verifyToken, adminOnly };