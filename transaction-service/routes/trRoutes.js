const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction');
const Books = require('../../books-service/models/books');
const authorizeRoles = require('../../auth-service/middlewares/authorizeRoles');
const verifyToken = require('../../auth-service/middlewares/verifyToken');

// Middleware untuk mengecek ketersediaan buku
async function isBookAvailable(title) {
    const book = await Books.findOne({ title });
    return book && book.isAvailable;
}

// Login untuk mengakses routes (jwt)
router.use(verifyToken);

// GET semua transaksi (admin & user)
router.get('/get', async (req, res) => {
    try {
        const transactions = await Transaction.find();
        // Filter out _id and __v from each transaction
        const filteredTransactions = transactions.map(t => {
            const { _id, __v, ...filtered } = t.toObject();
            return filtered;
        });
        res.json(filteredTransactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET transaksi spesifik berdasarkan transactionId (admin & user)
router.get('/:transactionId', async (req, res) => {
    try {
        const transaction = await Transaction.findOne({ transactionId: req.params.transactionId });
        if (!transaction) {
            return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
        }
        const { _id, __v, ...filtered } = transaction.toObject();
        res.json(filtered);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST transaksi (admin & user)
router.post('/post', async (req, res) => {
    try {
        // Cek apakah buku tersedia untuk dipinjam
        if (req.body.type === 'pinjam') {
            const available = await isBookAvailable(req.body.title);
            if (!available) {
                return res.status(400).json({ message: 'Buku tidak tersedia.' });
            }
        }

        const transaction = new Transaction(req.body);
        await transaction.save();

        // Update status ketersediaan buku
        if (req.body.type === 'pinjam') {
            await Books.findOneAndUpdate(
                { title: req.body.title },
                { isAvailable: false }
            );
        }

        if (req.body.type === 'pengembalian') {
            await Books.findOneAndUpdate(
                { title: req.body.title },
                { isAvailable: true }
            );
        }

        const { _id, __v, ...filtered } = transaction.toObject();
        res.status(201).json(filtered);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE transaksi (admin only)
router.delete('/:transactionId', authorizeRoles('admin'), async (req, res) => {
    try {
        const deletedTransaction = await Transaction.findOneAndDelete({ transactionId: req.params.transactionId });
        if (!deletedTransaction) {
            return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
        }
        res.json({ message: 'Transaksi berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
