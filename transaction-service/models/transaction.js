const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    transactionId: {
        type: String,
        unique: true,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    borrowDate: {
        type: Date,
        required: true
    },
    returnDate: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        enum: ['borrow', 'return','renew'], 
        required: true
    }
}, 
{
    timestamps: true
});

module.exports = mongoose.model('Transaction', TransactionSchema);
