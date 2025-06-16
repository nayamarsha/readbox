const express = require('express');
const router = express.Router();
const Account = require('../models/account');
const authorizeRoles  = require('../../auth-service/middlewares/authorizeRoles');
const verifyToken = require ('../../auth-service/middlewares/verifyToken');

// Semua route butuh login
router.use(verifyToken);

// GET semua akun (admin only)
router.get('/', authorizeRoles('admin'), async (req, res) => {
    try {
        const accounts = await Account.find({}, {
        _id: 0,         
        id: 1,
        username: 1,
        email: 1,
        role: 1,
        createdAt: 1
    });
        res.json(accounts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET satu akun by username (hanya admin atau user itu sendiri)
router.get('/:username', verifyToken, async (req, res) => {
    try {
        const { username } = req.params;

        // Cek hak akses: jika bukan admin dan bukan user yang sama → tolak
        if (req.user.role !== 'admin' && req.user.username !== username) {
            return res.status(403).json({ message: 'Akses ditolak.' });
        }

        // Cari akun berdasarkan username dan tampilkan field tertentu saja
        const account = await Account.findOne(
            { username },
            {
                _id: 0,          
                id: 1,
                username: 1,
                email: 1,
                role: 1,
                createdAt: 1  
            }
        );

        // Jika tidak ditemukan
        if (!account) {
            return res.status(404).json({ message: 'Akun tidak ditemukan' });
        }

        // Kirim data akun
        res.json(account);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT update akun by username (admin atau user sendiri)
router.put('/:username', verifyToken, async (req, res) => {
    try {
        const { username } = req.params;

        // Cari akun target berdasarkan username
        const targetAccount = await Account.findOne({ username });
        if (!targetAccount) {
            return res.status(404).json({ message: 'Akun tidak ditemukan.' });
        }

        // Admin boleh update akun siapa saja
        if (req.user.role === 'admin') {
            const updated = await Account.findOneAndUpdate(
                { username },
                req.body,
                { new: true }
            );

            const { _id, password, __v, ...filtered } = updated.toObject();
            return res.json({ message: 'Akun berhasil diperbarui oleh admin.', updated: filtered });
        }

        // User biasa hanya boleh update akun miliknya sendiri dan tidak boleh update admin
        if (req.user.role === 'user') {
            if (req.user.username !== username || targetAccount.role === 'admin') {
                return res.status(403).json({ message: 'Akses ditolak. Anda hanya bisa mengubah akun Anda sendiri.' });
            }

            const updated = await Account.findOneAndUpdate(
                { username },
                req.body,
                { new: true }
            );

            const { _id, password, __v, ...filtered } = updated.toObject();
            return res.json({ message: 'Akun Anda berhasil diperbarui', updated: filtered });
        }

        res.status(403).json({ message: 'Role tidak diizinkan.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE akun (admin only)
router.delete('/:id', authorizeRoles('admin'), async (req, res) => {
    try {
        const deleted = await Account.findOneAndDelete({ id: parseInt(req.params.id) });
        if (!deleted) {
            return res.status(404).json({ message: 'Akun tidak ditemukan.' });
        }
        res.json({ message: 'Akun berhasil dihapus.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
