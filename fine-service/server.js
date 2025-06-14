const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fineRoutes = require('./routes/fineRoutes');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use(fineRoutes);

mongoose.connect('mongodb+srv://username_se2:password_username_se2@cluster0.qbaphou.mongodb.net/TugasAkhirSe2?retryWrites=true&w=majority')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
