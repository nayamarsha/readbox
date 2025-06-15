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
        role: 1
    });
        res.json(accounts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET satu akun by id (admin atau user sendiri)
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Admin boleh lihat semua, user hanya dirinya sendiri
        if (req.user.role !== 'admin' && req.user.id !== id) {
            return res.status(403).json({ message: 'Akses ditolak' });
        }

        const account = await Account.findById(id);
        if (!account) {
            return res.status(404).json({ message: 'Akun tidak ditemukan' });
        }

        res.json(account);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT update akun (admin atau user sendiri)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user.role !== 'admin' && req.user.id !== id) {
            return res.status(403).json({ message: 'Akses ditolak' });
        }

        const updated = await Account.findByIdAndUpdate(id, req.body, { new: true });

        if (!updated) {
            return res.status(404).json({ message: 'Akun tidak ditemukan' });
        }

        res.json({ message: 'Akun berhasil diperbarui', updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE akun (admin only)
router.delete('/:id', authorizeRoles('admin'), async (req, res) => {
    try {
        const deleted = await Account.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Akun tidak ditemukan' });
        }
        res.json({ message: 'Akun berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
