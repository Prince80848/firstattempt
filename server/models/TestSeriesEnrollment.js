const mongoose = require('mongoose');

const testSeriesEnrollmentSchema = new mongoose.Schema({
    // User who enrolled (or guest details if not logged in)
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },

    // Required student details (collected even if logged in)
    studentName: {
        type: String,
        required: true,
        trim: true
    },
    studentEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    studentMobile: {
        type: String,
        required: true,
        trim: true
    },

    // Test Series details
    testSeriesId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TestSeries',
        required: true
    },
    testSeriesTitle: {
        type: String,
        required: true
    },
    testSeriesCategory: {
        type: String,
        required: true
    },

    // Payment details
    amount: {
        type: Number,
        required: true
    },
    utrNumber: {
        type: String,
        trim: true,
        default: ''
    },
    paymentProof: {
        type: String,  // File path to uploaded screenshot
        default: ''
    },
    paymentDate: {
        type: Date,
        default: null
    },

    // Status tracking
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'expired'],
        default: 'pending'
    },

    // Admin notes
    adminNotes: {
        type: String,
        default: ''
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    approvedAt: {
        type: Date,
        default: null
    },

    // Access validity
    accessStartDate: {
        type: Date,
        default: null
    },
    accessEndDate: {
        type: Date,
        default: null
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Index for quick lookups
testSeriesEnrollmentSchema.index({ studentEmail: 1 });
testSeriesEnrollmentSchema.index({ studentMobile: 1 });
testSeriesEnrollmentSchema.index({ status: 1 });
testSeriesEnrollmentSchema.index({ testSeriesId: 1 });

module.exports = mongoose.model('TestSeriesEnrollment', testSeriesEnrollmentSchema);
