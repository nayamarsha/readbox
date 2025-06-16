const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fineRoutes = require('./routes/fineRoutes');
require('dotenv').config();

const app = express();
const port = process.env.PORT ;

console.log('PORT:', process.env.PORT);
console.log('JWT_SECRET:', process.env.JWT_SECRET);
// ...existing code...
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