const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a test title']
    },
    testSeriesId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TestSeries',
        required: true
    },
    duration: {
        type: Number,
        required: true,
        default: 60 // minutes
    },
    totalMarks: {
        type: Number,
        required: true,
        default: 100
    },
    passingMarks: {
        type: Number,
        default: 40
    },
    negativeMarking: {
        type: Number,
        default: 0 // 0.25 means -0.25 for wrong answer
    },
    instructions: {
        type: String,
        default: `1. Read each question carefully before answering.
2. Each question has only one correct answer.
3. Once you move to the next question, you can go back and change your answer.
4. The test will auto-submit when time expires.
5. Do not refresh or close the browser during the test.
6. Any malpractice will result in disqualification.`
    },
    resultReleaseDate: {
        type: Date,
        default: null // null means immediate result
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Test', testSchema);
