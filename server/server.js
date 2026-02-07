const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/test-series', require('./routes/testSeries'));
app.use('/api/test-series-enrollments', require('./routes/testSeriesEnrollments'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/banners', require('./routes/banners'));
app.use('/api/enrollments', require('./routes/enrollments'));
app.use('/api/tests', require('./routes/testRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));
app.use('/api/attempts', require('./routes/attemptRoutes'));

// Home route
app.get('/', (req, res) => {
    res.json({ message: 'FirstAttempt API is running' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
