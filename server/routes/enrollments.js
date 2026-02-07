const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const { protect, admin } = require('../middleware/auth');

// @desc    Create new enrollment (public)
// @route   POST /api/enrollments
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { name, email, mobile, course, batchName, message } = req.body;

        // Check if already enrolled for this course
        const existingEnrollment = await Enrollment.findOne({
            email,
            course,
            status: { $in: ['pending', 'confirmed'] }
        });

        if (existingEnrollment) {
            return res.status(400).json({
                message: 'You are already enrolled for this course. We will contact you soon!'
            });
        }

        const enrollment = await Enrollment.create({
            name,
            email,
            mobile,
            course,
            batchName,
            message
        });

        res.status(201).json({
            success: true,
            message: 'Enrollment successful! We will contact you soon.',
            enrollment
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all enrollments (admin)
// @route   GET /api/enrollments
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const { status, course, isActive } = req.query;

        let query = {};
        if (status) query.status = status;
        if (course) query.course = course;
        if (isActive !== undefined) query.isActive = isActive === 'true';

        const enrollments = await Enrollment.find(query).sort('-enrolledAt');
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get enrollment stats
// @route   GET /api/enrollments/stats
// @access  Private/Admin
router.get('/stats', protect, admin, async (req, res) => {
    try {
        const totalEnrollments = await Enrollment.countDocuments({ isActive: true });
        const pendingEnrollments = await Enrollment.countDocuments({ status: 'pending', isActive: true });
        const confirmedEnrollments = await Enrollment.countDocuments({ status: 'confirmed', isActive: true });
        const completedEnrollments = await Enrollment.countDocuments({ status: 'completed' });

        const courseWise = await Enrollment.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: '$course', count: { $sum: 1 } } }
        ]);

        res.json({
            total: totalEnrollments,
            pending: pendingEnrollments,
            confirmed: confirmedEnrollments,
            completed: completedEnrollments,
            courseWise
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update enrollment status
// @route   PUT /api/enrollments/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const enrollment = await Enrollment.findById(req.params.id);

        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment not found' });
        }

        enrollment.status = req.body.status || enrollment.status;
        enrollment.batchName = req.body.batchName || enrollment.batchName;
        enrollment.batchEndDate = req.body.batchEndDate || enrollment.batchEndDate;
        enrollment.isActive = req.body.isActive !== undefined ? req.body.isActive : enrollment.isActive;

        await enrollment.save();
        res.json(enrollment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Complete batch (mark as completed and deactivate)
// @route   PUT /api/enrollments/:id/complete
// @access  Private/Admin
router.put('/:id/complete', protect, admin, async (req, res) => {
    try {
        const enrollment = await Enrollment.findById(req.params.id);

        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment not found' });
        }

        enrollment.status = 'completed';
        enrollment.isActive = false;
        enrollment.batchEndDate = new Date();

        await enrollment.save();
        res.json({ message: 'Batch marked as completed', enrollment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete enrollment
// @route   DELETE /api/enrollments/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const enrollment = await Enrollment.findById(req.params.id);

        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment not found' });
        }

        await enrollment.deleteOne();
        res.json({ message: 'Enrollment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete completed/inactive enrollments (cleanup)
// @route   DELETE /api/enrollments/cleanup
// @access  Private/Admin
router.delete('/cleanup/completed', protect, admin, async (req, res) => {
    try {
        const result = await Enrollment.deleteMany({
            $or: [
                { status: 'completed' },
                { isActive: false }
            ]
        });
        res.json({ message: `${result.deletedCount} completed enrollments deleted` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
