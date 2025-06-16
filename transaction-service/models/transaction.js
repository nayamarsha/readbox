const mongoose = require('mongoose');
const Counter = require('./counter');

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
        required: true
    }
}, 
{
    timestamps: true
});

// Auto generate untuk transactionID
TransactionSchema.pre('validate', async function(next) {
    if (this.isNew) {
        const counter = await Counter.findByIdAndUpdate(
            { _id: 'transactionId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        // Format: TRN00001
        this.transactionId = 'TRN' + counter.seq.toString().padStart(5, '0');
    }
    next();
});

module.exports = mongoose.model('transaction', TransactionSchema);
