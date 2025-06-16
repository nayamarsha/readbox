const express = require('express');
const router = express.Router();
const Account = require('../models/account');
const authorizeRoles  = require('../../auth-service/middlewares/authorizeRoles');
const verifyToken = require ('../../auth-service/middlewares/verifyToken');

router.use(verifyToken);

// GET semua akun (admin only)
router.get('/', authorizeRoles('admin'), async (req, res) => {
    try {
        const accounts = await Account.find({}, {
        _id: 0,         
        id: 1,
        accountId: 1,
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

// GET satu akun by username (admin atau user tsb)
router.get('/:username', verifyToken, async (req, res) => {
    try {
        const { username } = req.params;

        // cek hak akses
        if (req.user.role !== 'admin' && req.user.username !== username) {
            return res.status(403).json({ message: 'Akses ditolak.' });
        }

        // field yang ditampilkan
        const account = await Account.findOne(
            { username },
            {
                _id: 0,          
                accountId: 1,
                username: 1,
                email: 1,
                role: 1,
                createdAt: 1  
            }
        );

        if (!account) {
            return res.status(404).json({ message: 'Akun tidak ditemukan.' });
        }

        res.json(account);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT update akun by username (admin atau user tsb)
router.put('/:username', verifyToken, async (req, res) => {
    try {
        const { username } = req.params;

        const targetAccount = await Account.findOne({ username });
        if (!targetAccount) {
            return res.status(404).json({ message: 'Akun tidak ditemukan.' });
        }
        
        // cek hak akses
        if (req.user.role === 'admin') {
            const updated = await Account.findOneAndUpdate(
                { username },
                req.body,
                { new: true }
            );

            const { _id, password, __v, ...filtered } = updated.toObject();
            return res.json({ message: 'Akun berhasil diperbarui oleh admin.', updated: filtered });
        }

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
router.delete('/:accountId', authorizeRoles('admin'), async (req, res) => {
    try {
        const deleted = await Account.findOneAndDelete({ accountId:(req.params.accountId) });
        if (!deleted) {
            return res.status(404).json({ message: 'Akun tidak ditemukan.' });
        }
        res.json({ message: 'Akun berhasil dihapus.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



module.exports = router;
