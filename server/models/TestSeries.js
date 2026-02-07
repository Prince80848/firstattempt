const mongoose = require('mongoose');

const testSeriesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['CA Foundation', 'CA Inter', 'CA Final']
    },
    level: {
        type: String,
        default: 'Beginner',
        enum: ['Beginner', 'Intermediate', 'Advanced']
    },
    totalTests: {
        type: Number,
        default: 10
    },
    features: {
        type: [String],
        default: []
    },
    isActive: {
        type: Boolean,
        default: true
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

module.exports = mongoose.model('TestSeries', testSeriesSchema);
