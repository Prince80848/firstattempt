const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
    },
    mobile: {
        type: String,
        required: [true, 'Please add a mobile number'],
        match: [/^[0-9]{10}$/, 'Please add a valid 10-digit mobile number']
    },
    course: {
        type: String,
        required: true,
        enum: ['CA Foundation', 'CA Inter', 'CA Final']
    },
    batchName: {
        type: String,
        default: ''
    },
    message: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    enrolledAt: {
        type: Date,
        default: Date.now
    },
    batchEndDate: {
        type: Date,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);
