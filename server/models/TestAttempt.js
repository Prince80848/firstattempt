const mongoose = require('mongoose');

const testAttemptSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    testId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test',
        required: true
    },
    answers: [{
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question'
        },
        selectedOption: {
            type: Number,
            default: -1 // -1 means unanswered
        }
    }],
    score: {
        type: Number,
        default: 0
    },
    correctCount: {
        type: Number,
        default: 0
    },
    wrongCount: {
        type: Number,
        default: 0
    },
    unansweredCount: {
        type: Number,
        default: 0
    },
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: {
        type: Date
    },
    status: {
        type: String,
        enum: ['in-progress', 'completed'],
        default: 'in-progress'
    }
}, {
    timestamps: true
});

// Ensure one attempt per user per test
testAttemptSchema.index({ userId: 1, testId: 1 }, { unique: true });

module.exports = mongoose.model('TestAttempt', testAttemptSchema);
