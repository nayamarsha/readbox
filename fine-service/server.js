const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fineRoutes = require('./routes/fineRoutes');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3009;

app.use(bodyParser.json());

app.use(fineRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

