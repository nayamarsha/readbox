const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({

    username: {
        type: String,
        unique: true,
        required: true
    },
    
    email: {
        type: String,
        unique: true,
        required: true
    },

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('users', AccountSchema);
