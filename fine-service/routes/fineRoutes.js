const express = require('express');
const Fine = require('../models/fineModel');
const Test = require('../models/testModel');
const router = express.Router();


router.get('/fine/calculate/:username', async (req, res) => {
    try {
        const testData = await Test.findOne({ username: req.params.username });

        if (!testData) {
            return res.status(404).send({ message: 'Data tidak ditemukan' });
        }

        const currentDate = new Date();
        const dueDate = new Date(testData.kembali);
        const daysLate = Math.max(0, Math.ceil((currentDate - dueDate) / (1000 * 60 * 60 * 24))); // Hitung hari terlambat
        const finePerDay = 2000; 
        const totalFine = daysLate * finePerDay; 

        const fine = new Fine({
            transactionId: testData.transactionId,
            username: testData.username,
            daysLate: daysLate,
            finePerDay: finePerDay,
            totalFine: totalFine,
            status: 'unpaid'
        });

        await fine.save();

        res.status(200).send(fine);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;