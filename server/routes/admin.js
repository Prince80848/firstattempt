const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', protect, admin, async (req, res) => {
    try {
        const users = await User.find({}).select('name email mobile createdAt isAdmin role assignedTestSeries');
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update user (role, assignedTestSeries)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
router.put('/users/:id', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isAdmin) {
            return res.status(400).json({ message: 'Cannot modify admin user' });
        }

        // Update allowed fields
        if (req.body.role !== undefined) {
            user.role = req.body.role;
        }
        if (req.body.assignedTestSeries !== undefined) {
            user.assignedTestSeries = req.body.assignedTestSeries;
        }

        await user.save();
        res.json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
router.delete('/users/:id', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            if (user.isAdmin) {
                return res.status(400).json({ message: 'Cannot delete admin user' });
            }
            await User.deleteOne({ _id: req.params.id });
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Make user admin
// @route   PUT /api/admin/users/:id/admin
// @access  Private/Admin
router.put('/users/:id/admin', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.isAdmin = true;
            await user.save();
            res.json({ message: 'User is now an admin' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

