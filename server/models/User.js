const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
    },
    mobile: {
        type: String,
        required: [true, 'Please add a mobile number'],
        match: [/^[0-9]{10}$/, 'Please add a valid 10-digit mobile number']
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['student', 'mentor', 'admin'],
        default: 'student'
    },
    assignedTestSeries: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TestSeries'
    }],
    profilePic: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpiry: {
        type: Date
    }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match password method
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
