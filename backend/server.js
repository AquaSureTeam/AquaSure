const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();
const connectDB = require('./config/db');


app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});