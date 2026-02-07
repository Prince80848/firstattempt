const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const TestSeriesEnrollment = require('../models/TestSeriesEnrollment');
const TestSeries = require('../models/TestSeries');
const { protect, admin } = require('../middleware/auth');

// Create uploads directory if not exists
const uploadsDir = path.join(__dirname, '../uploads/payments');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration for payment screenshots
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'payment-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Only images (jpeg, jpg, png, webp) are allowed'));
        }
    }
});

// @desc    Create new enrollment with payment proof
// @route   POST /api/test-series-enrollments
// @access  Public
router.post('/', upload.single('paymentProof'), async (req, res) => {
    try {
        const {
            testSeriesId,
            studentName,
            studentEmail,
            studentMobile,
            utrNumber,
            userId
        } = req.body;

        // Validate test series exists
        const testSeries = await TestSeries.findById(testSeriesId);
        if (!testSeries) {
            return res.status(404).json({ message: 'Test series not found' });
        }

        // Check if already enrolled with same email for this test series
        const existingEnrollment = await TestSeriesEnrollment.findOne({
            testSeriesId,
            studentEmail: studentEmail.toLowerCase(),
            status: { $in: ['pending', 'approved'] }
        });

        if (existingEnrollment) {
            return res.status(400).json({
                message: 'You have already enrolled for this test series. Check your email or contact support.'
            });
        }

        // Create enrollment
        const enrollment = await TestSeriesEnrollment.create({
            userId: userId || null,
            studentName,
            studentEmail: studentEmail.toLowerCase(),
            studentMobile,
            testSeriesId,
            testSeriesTitle: testSeries.title,
            testSeriesCategory: testSeries.category,
            amount: testSeries.price,
            utrNumber: utrNumber || '',
            paymentProof: req.file ? `/uploads/payments/${req.file.filename}` : '',
            paymentDate: new Date(),
            status: 'pending'
        });

        res.status(201).json({
            success: true,
            message: 'Enrollment submitted successfully! Our team will verify your payment within 24 hours.',
            enrollment: {
                id: enrollment._id,
                testSeriesTitle: enrollment.testSeriesTitle,
                amount: enrollment.amount,
                status: enrollment.status
            }
        });
    } catch (error) {
        console.error('Enrollment error:', error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all enrollments (admin)
// @route   GET /api/test-series-enrollments
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const { status } = req.query;
        const filter = status ? { status } : {};

        const enrollments = await TestSeriesEnrollment.find(filter)
            .populate('userId', 'name email')
            .populate('testSeriesId', 'title category price')
            .sort({ createdAt: -1 });

        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get enrollment stats (admin)
// @route   GET /api/test-series-enrollments/stats
// @access  Private/Admin
router.get('/stats', protect, admin, async (req, res) => {
    try {
        const stats = await TestSeriesEnrollment.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$amount' }
                }
            }
        ]);

        const formattedStats = {
            pending: 0,
            approved: 0,
            rejected: 0,
            totalRevenue: 0
        };

        stats.forEach(s => {
            formattedStats[s._id] = s.count;
            if (s._id === 'approved') {
                formattedStats.totalRevenue = s.totalAmount;
            }
        });

        res.json(formattedStats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get user's enrollments
// @route   GET /api/test-series-enrollments/my
// @access  Private
router.get('/my', protect, async (req, res) => {
    try {
        const enrollments = await TestSeriesEnrollment.find({
            $or: [
                { userId: req.user._id },
                { studentEmail: req.user.email }
            ]
        })
            .populate('testSeriesId', 'title category price duration features totalTests')
            .sort({ createdAt: -1 });

        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Approve enrollment
// @route   PUT /api/test-series-enrollments/:id/approve
// @access  Private/Admin
router.put('/:id/approve', protect, admin, async (req, res) => {
    try {
        const enrollment = await TestSeriesEnrollment.findById(req.params.id);

        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment not found' });
        }

        // Get test series for duration
        const testSeries = await TestSeries.findById(enrollment.testSeriesId);

        // Parse duration (e.g., "3 months" -> 3 months)
        let accessDays = 90; // default 3 months
        if (testSeries && testSeries.duration) {
            const match = testSeries.duration.match(/(\d+)/);
            if (match) {
                const num = parseInt(match[1]);
                if (testSeries.duration.includes('month')) {
                    accessDays = num * 30;
                } else if (testSeries.duration.includes('year')) {
                    accessDays = num * 365;
                } else if (testSeries.duration.includes('day')) {
                    accessDays = num;
                }
            }
        }

        const now = new Date();
        enrollment.status = 'approved';
        enrollment.approvedBy = req.user._id;
        enrollment.approvedAt = now;
        enrollment.accessStartDate = now;
        enrollment.accessEndDate = new Date(now.getTime() + accessDays * 24 * 60 * 60 * 1000);
        enrollment.updatedAt = now;
        enrollment.adminNotes = req.body.notes || '';

        await enrollment.save();

        res.json({
            success: true,
            message: 'Enrollment approved successfully!',
            enrollment
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Reject enrollment
// @route   PUT /api/test-series-enrollments/:id/reject
// @access  Private/Admin
router.put('/:id/reject', protect, admin, async (req, res) => {
    try {
        const enrollment = await TestSeriesEnrollment.findById(req.params.id);

        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment not found' });
        }

        enrollment.status = 'rejected';
        enrollment.adminNotes = req.body.notes || 'Payment verification failed';
        enrollment.updatedAt = new Date();

        await enrollment.save();

        res.json({
            success: true,
            message: 'Enrollment rejected',
            enrollment
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete enrollment
// @route   DELETE /api/test-series-enrollments/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const enrollment = await TestSeriesEnrollment.findById(req.params.id);

        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment not found' });
        }

        // Delete payment proof file if exists
        if (enrollment.paymentProof) {
            const filePath = path.join(__dirname, '..', enrollment.paymentProof);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await TestSeriesEnrollment.deleteOne({ _id: req.params.id });

        res.json({ message: 'Enrollment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
