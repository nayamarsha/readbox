// models/account.js
const mongoose = require('mongoose');
const Counter = require('./counter');

const AccountSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true
  },

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

// Auto-generate id seperti ACC0001
AccountSchema.pre('validate', async function (next) {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'accountId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.id = 'ACC' + counter.seq.toString().padStart(4, '0');
  }
  next();
});

module.exports = mongoose.model('users', AccountSchema);
