const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Authentication } = require('../models');

const authController = {
  // --- REGISTER (Mendaftar Akun Baru) ---
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // 1. Cek apakah email sudah terdaftar
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          status: 'fail',
          message: 'Gagal menambahkan user. Email sudah digunakan.',
        });
      }

      // 2. Hash Password (Enkripsi)
      const hashedPassword = await bcrypt.hash(password, 10);

      // 3. Tentukan Role (Simulasi: email admin jadi admin)
      const role = email === 'admin@lokalstyle.com' ? 'admin' : 'user';

      // 4. Simpan User ke Database
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role
      });

      // 5. Kirim Response Sukses
      return res.status(201).json({
        status: 'success',
        message: 'User berhasil ditambahkan',
        data: {
          userId: newUser.id,
        },
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan pada server',
      });
    }
  },

  // --- LOGIN (Masuk Aplikasi) ---
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // 1. Cek apakah User ada
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({
          status: 'fail',
          message: 'Kredensial yang Anda berikan salah (Email tidak ditemukan)',
        });
      }

      // 2. Verifikasi Password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          status: 'fail',
          message: 'Kredensial yang Anda berikan salah (Password salah)',
        });
      }

      // 3. Buat Token (Access & Refresh)
      const payload = { id: user.id, role: user.role };
      
      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, { expiresIn: '1h' });
      const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_KEY, { expiresIn: '7d' });

      // 4. Simpan Refresh Token ke Database
      await Authentication.create({ token: refreshToken });

      // 5. Kirim Token ke Frontend
      return res.status(201).json({
        status: 'success',
        message: 'Authentication berhasil ditambahkan',
        data: {
          accessToken,
          refreshToken,
        },
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan pada server',
      });
    }
  },

  // --- LOGOUT (Keluar) ---
  logout: async (req, res) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
            status: 'fail',
            message: 'Refresh token harus dikirim',
        });
      }

      await Authentication.destroy({ where: { token: refreshToken } });

      return res.status(200).json({
        status: 'success',
        message: 'Refresh token berhasil dihapus',
      });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
          status: 'error',
          message: 'Terjadi kesalahan pada server',
        });
    }
  },

  // --- GET ME (Cek Profil User yang Sedang Login) ---
  getMe: async (req, res) => {
    try {
      const { id } = req.user;

      const user = await User.findByPk(id, {
        attributes: ['id', 'name', 'email', 'role']
      });

      if (!user) {
        return res.status(404).json({
          status: 'fail',
          message: 'User tidak ditemukan',
        });
      }

      return res.json({
        status: 'success',
        data: user,
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan pada server',
      });
    }
  },

  // --- 1. FORGOT PASSWORD (Kirim Email) ---
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({ status: 'fail', message: 'Email tidak terdaftar' });
      }

      // Buat Token Reset (berlaku 15 menit)
      const resetToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_KEY, { expiresIn: '15m' });

      // Konfigurasi Nodemailer
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Reset Password - LokalStyle',
        html: `
          <h3>Permintaan Reset Password</h3>
          <p>Silakan klik link di bawah ini untuk mereset password Anda:</p>
          <a href="${resetLink}">${resetLink}</a>
          <p>Link ini akan kadaluarsa dalam 15 menit.</p>
        `,
      };

      await transporter.sendMail(mailOptions);

      res.json({ status: 'success', message: 'Link reset password telah dikirim ke email Anda' });

    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: 'Gagal mengirim email' });
    }
  },

  // --- 2. RESET PASSWORD (Simpan Password Baru) ---
  resetPassword: async (req, res) => {
    try {
      const { token } = req.params;
      const { newPassword } = req.body;

      let decoded;
      try {
        decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
      } catch (err) {
        return res.status(400).json({ status: 'fail', message: 'Link kadaluarsa atau tidak valid' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await User.update({ password: hashedPassword }, { where: { id: decoded.id } });

      res.json({ status: 'success', message: 'Password berhasil diubah. Silakan login kembali.' });

    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: 'Gagal mereset password' });
    }
  },

  // --- 3. UPDATE PROFILE (Ganti Nama & Password) ---
  updateProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      const { name, currentPassword, newPassword } = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ status: 'fail', message: 'User tidak ditemukan' });
      }

      // 1. Update Nama (Jika ada)
      if (name) {
        user.name = name;
      }

      // 2. Update Password (Jika user ingin ganti)
      if (newPassword) {
        if (!currentPassword) {
          return res.status(400).json({ status: 'fail', message: 'Harap masukkan password lama untuk konfirmasi.' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
          return res.status(400).json({ status: 'fail', message: 'Password lama salah.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
      }

      await user.save();

      res.json({
        status: 'success',
        message: 'Profil berhasil diperbarui',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: 'Gagal update profil' });
    }
  }

}; // <--- Tutup Objek authController di sini

module.exports = authController;