const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { authorizeRoles } = require('../middleware/auth');
const authenticateJWT = require('../middleware/auth');

// Login untuk mengakses routes (jwt)
router.use(authenticateJWT);

// GET semua transaksi (admin & user)
router.get('/', async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET transaksi spesifik berdasarkan id (admin & user)
router.get('/:id', async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
        }
        res.json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST transaksi (admin & user)
router.post('/', async (req, res) => {
    try {
        const transaction = new Transaction(req.body);
        await transaction.save();
        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT update transaksi (admin only)
router.put('/:id', authorizeRoles('admin'), async (req, res) => {
    try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTransaction) {
            return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
        }
        res.json({ message: 'Transaksi berhasil diperbarui', updatedTransaction });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE transaksi (admin only)
router.delete('/:id', authorizeRoles('admin'), async (req, res) => {
    try {
        const deletedTransaction = await Transaction.findByIdAndDelete(req.params.id);
        if (!deletedTransaction) {
            return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
        }
        res.json({ message: 'Transaksi berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
