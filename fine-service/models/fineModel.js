const mongoose = require('mongoose');

const FineSchema = new mongoose.Schema({
    transactionId: {
        type: String,
        unique: true,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    daysLate: {
        type: Number,
        required: true,
    },
    finePerDay: {
        type: Number,
        required: true,
        default: 0
    },
    totalFine: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['paid', 'unpaid'],
        default: 'unpaid'
    }
});

const Fine = mongoose.model('fine', FineSchema);

module.exports = Fine;