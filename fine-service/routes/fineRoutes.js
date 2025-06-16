const express = require('express');
const Fine = require('../models/fineModel');
const verifyToken = require('../../auth-service/middlewares/verifyToken');
const authorizeRoles = require('../../auth-service/middlewares/authorizeRoles');
const Transaction = require('../../transaction-service/models/transaction');
const router = express.Router();

// Fungsi bantu untuk konversi UTC ke Waktu Lokal (misalnya WIB)
function toLocalDate(dateUtc) {
  const offset = 7 * 60 * 60 * 1000;
  return new Date(dateUtc.getTime() + offset);
}

// ADMIN: Hitung semua denda pengguna
router.get('/fine/calculate/', verifyToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const transactions = await Transaction.find();

    if (transactions.length === 0) {
      return res.status(404).send({ message: 'Data tidak ditemukan' });
    }

    const currentDate = toLocalDate(new Date());
    const fines = [];

    for (let i = 0; i < transactions.length; i++) {
      const returnDate = toLocalDate(new Date(transactions[i].returnDate));
    const daysLate = Math.max(0, Math.floor((currentDate - returnDate) / (1000 * 60 * 60 * 24)));
      const finePerDay = 2000;
      const totalFine = daysLate * finePerDay;

      if (totalFine > 0) {
        const updatedFine = await Fine.findOneAndUpdate(
          { username: transactions[i].username },
          {
            $set: {
              username: transactions[i].username,
              daysLate,
              finePerDay,
              totalFine,
              status: 'unpaid'
            }
          },
          { new: true, upsert: true }
        );

        fines.push(updatedFine);
      }
    }

    res.status(200).send(fines);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Terjadi kesalahan saat menghitung denda', error });
  }
});

// USER: Hitung denda sendiri
router.get('/fine/calculate/:username', verifyToken, authorizeRoles('admin', 'user'), async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ username: req.params.username });

    if (!transaction) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }

    const currentDate = toLocalDate(new Date());
    const returnDate = toLocalDate(new Date(transaction.returnDate));
    const daysLate = Math.max(0, Math.floor((currentDate - returnDate) / (1000 * 60 * 60 * 24)));
    const finePerDay = 2000;
    const totalFine = daysLate * finePerDay;
    const status = totalFine > 0 ? 'unpaid' : 'no fine';

    const updatedFine = await Fine.findOneAndUpdate(
      { username: transaction.username, transactionId: transaction.transactionId },
      {
        $set: {
          username: transaction.username,
          daysLate,
          finePerDay,
          totalFine,
          status
        }
      },
      { new: true, upsert: true }
    );

    res.status(200).json(updatedFine);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan saat menghitung denda', error });
  }
});

// ADMIN: Bayar denda
router.post('/fine/payment', verifyToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { username, totalFine } = req.body;

    const fine = await Fine.findOne({ username, status: 'unpaid' });
    if (!fine) {
      return res.status(404).send({ message: 'Denda tidak ditemukan' });
    }

    if (totalFine !== fine.totalFine) {
      return res.status(400).send({ message: 'Biaya denda tidak sesuai' });
    }

    // Hapus data denda setelah dibayar
    await Fine.deleteOne({ username: fine.username });

    res.status(200).send({ message: 'Pembayaran denda berhasil dan data denda dihapus' });
  } catch (error) {
    console.error("Error saat pembayaran:", error);
    res.status(500).send(error);
  }
});

module.exports = router;