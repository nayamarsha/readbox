const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction');
const Books = require('../../books-service/models/books');
const authorizeRoles  = require('../../auth-service/middlewares/authorizeRoles');
const verifyToken = require ('../../auth-service/middlewares/verifyToken');

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
        const { _id, __v, ...filtered } = updated.toObject();
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
        const { _id, __v, ...filtered } = updated.toObject();
        res.json(transaction);
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
    
        const { _id, __v, ...filtered } = updated.toObject();
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
        
        const { _id, __v, ...filtered } = updated.toObject();
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
