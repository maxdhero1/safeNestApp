// 1. ENVIRONMENT CONFIG (Must be at the absolute top)
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/configdb.js');

// Import Error Handlers
const AppError = require('./utils/AppError');
const errorMiddleware = require('./middlewares/errorMiddleware');

// Import System Routers
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
const port = process.env.PORT || 7777;

// 2. GLOBAL SYSTEM MIDDLEWARES
app.use(cors());
app.use(express.json()); // Parses incoming JSON payloads

// 3. MOUNT APPLICATION ENDPOINTS
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/properties', propertyRoutes);
app.use('/api/v1/payments', paymentRoutes);

// 4. UNHANDLED ROUTE PROTECTION GUARD
app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 5. GLOBAL ERROR HANDLING WARE
app.use(errorMiddleware);

// 6. SINGLE COMPACT STARTUP ENGINE
const startServer = async () => {
    try {
        // Connect to MongoDB Atlas
        await connectDB();
        console.log('Cloud Database Connected Successfully!');

        // Start Listening for HTTP Requests
        app.listen(port, () => {
            console.log(`=== SafeNest API running in ${process.env.NODE_ENV || 'development'} mode on port ${port} ===`);
        });
    } catch (error) {
        console.error(' Server Startup Aborted due to Database Failure:', error.message);
        process.exit(1);
    }
};

startServer();