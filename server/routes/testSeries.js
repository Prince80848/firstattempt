const express = require('express');
const router = express.Router();
const TestSeries = require('../models/TestSeries');
const { protect, admin } = require('../middleware/auth');

// @desc    Get all test series
// @route   GET /api/test-series
// @access  Public
router.get('/', async (req, res) => {
    try {
        const testSeries = await TestSeries.find({ isActive: true }).sort({ createdAt: -1 });
        res.json(testSeries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all test series (including inactive) for admin
// @route   GET /api/test-series/all
// @access  Private/Admin
router.get('/all', protect, admin, async (req, res) => {
    try {
        const testSeries = await TestSeries.find().sort({ createdAt: -1 });
        res.json(testSeries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get single test series
// @route   GET /api/test-series/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const series = await TestSeries.findById(req.params.id);
        if (!series) {
            return res.status(404).json({ message: 'Test series not found' });
        }
        res.json(series);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create test series
// @route   POST /api/test-series
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    try {
        const { title, description, price, duration, category, level, totalTests, features } = req.body;

        // Parse features if it's a string
        let parsedFeatures = features;
        if (typeof features === 'string') {
            parsedFeatures = features.split(',').map(f => f.trim()).filter(f => f);
        }

        const testSeries = await TestSeries.create({
            title,
            description,
            price: Number(price),
            duration,
            category,
            level: level || 'Beginner',
            totalTests: Number(totalTests) || 10,
            features: parsedFeatures || []
        });

        res.status(201).json(testSeries);
    } catch (error) {
        console.error('Create test series error:', error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update test series
// @route   PUT /api/test-series/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const { title, description, price, duration, category, level, totalTests, features, isActive } = req.body;

        const testSeries = await TestSeries.findById(req.params.id);

        if (!testSeries) {
            return res.status(404).json({ message: 'Test series not found' });
        }

        // Parse features if it's a string
        let parsedFeatures = features;
        if (typeof features === 'string') {
            parsedFeatures = features.split(',').map(f => f.trim()).filter(f => f);
        }

        testSeries.title = title || testSeries.title;
        testSeries.description = description || testSeries.description;
        testSeries.price = price !== undefined ? Number(price) : testSeries.price;
        testSeries.duration = duration || testSeries.duration;
        testSeries.category = category || testSeries.category;
        testSeries.level = level || testSeries.level;
        testSeries.totalTests = totalTests !== undefined ? Number(totalTests) : testSeries.totalTests;
        testSeries.features = parsedFeatures !== undefined ? parsedFeatures : testSeries.features;
        testSeries.isActive = isActive !== undefined ? isActive : testSeries.isActive;
        testSeries.updatedAt = Date.now();

        await testSeries.save();

        res.json(testSeries);
    } catch (error) {
        console.error('Update test series error:', error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete test series
// @route   DELETE /api/test-series/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const testSeries = await TestSeries.findById(req.params.id);

        if (!testSeries) {
            return res.status(404).json({ message: 'Test series not found' });
        }

        await TestSeries.deleteOne({ _id: req.params.id });

        res.json({ message: 'Test series deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
