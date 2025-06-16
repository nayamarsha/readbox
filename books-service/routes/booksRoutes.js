const express = require('express');
const router = express.Router();
const Book = require('../models/books');
const authorizeRoles  = require('../../auth-service/middlewares/authorizeRoles');
const verifyToken = require ('../../auth-service/middlewares/verifyToken');

//buat akses service harus login
router.use(verifyToken);

//get buku untuk user dan admin
router.get('/', async (req, res) => {
    try {
        const books = await Book.find().select('bookId title author year genre isAvailable -_id');
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//user dan admin get buku berdasarkan id
router.get('/:bookId', async (req, res) => {
    try {
        const book = await Book.findOne({ bookId: req.params.bookId }).select('bookId title author year genre isAvailable -_id');
        if (!book) {
            return res.status(404).json({ message: 'Buku tidak ditemukan' });
        }
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//post buku untuk admin
router.post('/', authorizeRoles('admin'), async (req, res) => {
    try {
        const book = new Book(req.body);
        await book.save();
        res.status(201).json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//update buku untuk admin
router.put('/:bookId', authorizeRoles('admin'), async (req, res) => {
    try {
        const updateBook = await Book.findOneAndUpdate({ bookId: req.params.bookId }, req.body, { new: true });
        if (!updateBook) {
            return res.status(404).json({ message: 'Buku tidak ditemukan' });
        }
        res.json({ message: 'Buku berhasil diperbarui', updateBook});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//delete buku untuk admin
router.delete('/:bookId', authorizeRoles('admin'), async (req, res) => {
    try {
        const deleteBook = await Book.findOneAndDelete({ bookId: req.params.bookId });
        if (!deleteBook) {
            return res.status(404).json({ message: 'Buku tidak ditemukan' });
        }
        res.json({ message: 'Buku berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
