const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Banner = require('../models/Banner');
const { protect, admin } = require('../middleware/auth');

// Configure multer for banner uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/banners/');
    },
    filename: function (req, file, cb) {
        cb(null, `banner_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for banners
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'), false);
        }
    }
});

// @desc    Get all banners (public)
// @route   GET /api/banners
// @access  Public
router.get('/', async (req, res) => {
    try {
        const banners = await Banner.find({ isActive: true }).sort('order');
        res.json(banners);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all banners for admin
// @route   GET /api/banners/admin
// @access  Private/Admin
router.get('/admin', protect, admin, async (req, res) => {
    try {
        const banners = await Banner.find().sort('order');
        res.json(banners);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create or update banner
// @route   POST /api/banners
// @access  Private/Admin
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
    try {
        const { courseType, title, isActive, order } = req.body;

        let imageUrl = req.body.imageUrl;
        if (req.file) {
            imageUrl = `http://localhost:5000/uploads/banners/${req.file.filename}`;
        }

        // Check if banner for this course exists
        let banner = await Banner.findOne({ courseType });

        if (banner) {
            // Update existing
            banner.imageUrl = imageUrl || banner.imageUrl;
            banner.title = title || banner.title;
            banner.isActive = isActive !== undefined ? isActive : banner.isActive;
            banner.order = order !== undefined ? order : banner.order;
            banner.updatedAt = Date.now();
            await banner.save();
        } else {
            // Create new
            banner = await Banner.create({
                courseType,
                imageUrl,
                title,
                isActive: isActive !== undefined ? isActive : true,
                order: order || 0
            });
        }

        res.status(201).json(banner);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update banner by ID
// @route   PUT /api/banners/:id
// @access  Private/Admin
router.put('/:id', protect, admin, upload.single('image'), async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);

        if (!banner) {
            return res.status(404).json({ message: 'Banner not found' });
        }

        if (req.file) {
            banner.imageUrl = `http://localhost:5000/uploads/banners/${req.file.filename}`;
        }

        banner.title = req.body.title || banner.title;
        banner.isActive = req.body.isActive !== undefined ? req.body.isActive : banner.isActive;
        banner.order = req.body.order !== undefined ? req.body.order : banner.order;
        banner.updatedAt = Date.now();

        await banner.save();
        res.json(banner);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete banner
// @route   DELETE /api/banners/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) {
            return res.status(404).json({ message: 'Banner not found' });
        }
        await banner.deleteOne();
        res.json({ message: 'Banner removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
