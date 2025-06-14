   const mongoose = require('mongoose');

   const TestSchema = new mongoose.Schema({
       transactionId: {
           type: String,
           required: true
       },
       username: {
           type: String,
           required: true
       },
       pinjam: {
           type: Date,
           required: true
       },
       lama: {
           type: Number,
           required: true
       },
       kembali: {
           type: Date,
           required: true
       }
   });

   const Test = mongoose.model('test', TestSchema);

   module.exports = Test;
   