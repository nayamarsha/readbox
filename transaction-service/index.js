const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

app.use(cors());
app.use(express.json());

const transactionRoutes = require('./routes/trRoutes');
app.use('/transaction', transactionRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});