const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    courseType: {
        type: String,
        required: true,
        enum: ['CA Foundation', 'CA Inter', 'CA Final']
    },
    imageUrl: {
        type: String,
        required: true
    },
    title: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
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

module.exports = mongoose.model('Banner', bannerSchema);
