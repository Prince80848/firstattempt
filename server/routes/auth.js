const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const { protect } = require('../middleware/auth');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/profiles/');
    },
    filename: function (req, file, cb) {
        cb(null, `user_${req.user._id}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG and GIF allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter
});

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { name, email, mobile, password } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            mobile,
            password
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                isAdmin: user.isAdmin,
                profilePic: user.profilePic,
                role: user.role,
                assignedTestSeries: user.assignedTestSeries,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                isAdmin: user.isAdmin,
                profilePic: user.profilePic,
                role: user.role,
                assignedTestSeries: user.assignedTestSeries,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            isAdmin: user.isAdmin,
            profilePic: user.profilePic,
            role: user.role,
            assignedTestSeries: user.assignedTestSeries
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', protect, upload.single('profilePic'), async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.mobile = req.body.mobile || user.mobile;

            // Handle profile picture upload
            if (req.file) {
                user.profilePic = `http://localhost:5000/uploads/profiles/${req.file.filename}`;
            }

            // Check if email is being changed and if it's already taken
            if (req.body.email && req.body.email !== user.email) {
                const emailExists = await User.findOne({ email: req.body.email });
                if (emailExists) {
                    return res.status(400).json({ message: 'Email already in use' });
                }
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                mobile: updatedUser.mobile,
                isAdmin: updatedUser.isAdmin,
                profilePic: updatedUser.profilePic,
                role: updatedUser.role,
                assignedTestSeries: updatedUser.assignedTestSeries
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Forgot password - send reset token
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'No account found with this email address' });
        }

        // Generate reset token (simple 6-digit code)
        const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
        const resetTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

        // Save token to user
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiry = resetTokenExpiry;
        await user.save();

        // Send OTP via email
        const { sendPasswordResetEmail } = require('../utils/emailService');
        const emailResult = await sendPasswordResetEmail(email, resetToken, user.name);

        if (emailResult.success) {
            res.json({
                message: 'Password reset OTP has been sent to your email address.',
                emailSent: true
            });
        } else {
            // If email fails, still return the token for demo purposes
            console.log(`Password reset code for ${email}: ${resetToken}`);
            res.json({
                message: 'Email service unavailable. OTP displayed below (demo mode).',
                resetToken: resetToken,
                emailSent: false
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Reset password with token
// @route   POST /api/auth/reset-password
// @access  Public
router.post('/reset-password', async (req, res) => {
    try {
        const { email, resetToken, newPassword } = req.body;

        const user = await User.findOne({
            email,
            resetPasswordToken: resetToken,
            resetPasswordExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset code' });
        }

        // Update password
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiry = undefined;
        await user.save();

        res.json({ message: 'Password reset successful! You can now login with your new password.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
