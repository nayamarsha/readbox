const mongoose = require('mongoose');

const BooksSchema = new mongoose.Schema({
    bookId: {
        type: String,
        unique: true,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    }}, 
    {
        timestamps: true
    }
);

module.exports = mongoose.model('books', BooksSchema);
