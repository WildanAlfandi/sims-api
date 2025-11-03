const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const informationRoutes = require('./routes/informationRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/', authRoutes);
app.use('/', profileRoutes);
app.use('/', transactionRoutes);
app.use('/', informationRoutes);

// Health check
app.get('/', (req, res) => {
    res.json({ 
        status: 0,
        message: 'SIMS API is running',
        data: null 
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        status: 102,
        message: 'Endpoint tidak ditemukan',
        data: null
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 500,
        message: err.message || 'Internal server error',
        data: null
    });
});

module.exports = app;