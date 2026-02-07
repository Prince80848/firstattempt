const express = require('express');
const router = express.Router();
const Test = require('../models/Test');
const Question = require('../models/Question');
const TestAttempt = require('../models/TestAttempt');
const { protect, admin, mentorOrAdmin } = require('../middleware/auth');

// @route   POST /api/tests
// @desc    Create a new test
// @access  Admin only
router.post('/', protect, admin, async (req, res) => {
    try {
        const test = await Test.create({
            ...req.body,
            createdBy: req.user._id
        });
        res.status(201).json(test);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @route   GET /api/tests
// @desc    Get all tests (admin only)
// @access  Admin only
router.get('/', protect, admin, async (req, res) => {
    try {
        const tests = await Test.find({}).sort({ createdAt: -1 });
        res.json(tests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/tests/series/:testSeriesId
// @desc    Get all tests for a test series
// @access  Public (but only shows active tests to non-admins)
router.get('/series/:testSeriesId', async (req, res) => {
    try {
        const query = { testSeriesId: req.params.testSeriesId };
        // Non-admins only see active tests
        if (!req.user?.isAdmin) {
            query.isActive = true;
        }
        const tests = await Test.find(query).sort({ createdAt: 1 });
        res.json(tests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/tests/:id
// @desc    Get single test
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const test = await Test.findById(req.params.id);
        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }
        res.json(test);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/tests/:id
// @desc    Update a test
// @access  Admin only
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const test = await Test.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }
        res.json(test);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @route   DELETE /api/tests/:id
// @desc    Delete a test and its questions
// @access  Admin only
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const test = await Test.findById(req.params.id);
        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }
        // Delete all questions for this test
        await Question.deleteMany({ testId: req.params.id });
        // Delete all attempts for this test
        await TestAttempt.deleteMany({ testId: req.params.id });
        // Delete the test
        await test.deleteOne();
        res.json({ message: 'Test and related data deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/tests/:id/questions-count
// @desc    Get question count for a test
// @access  Public
router.get('/:id/questions-count', async (req, res) => {
    try {
        const count = await Question.countDocuments({ testId: req.params.id });
        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
