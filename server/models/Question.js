const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    testId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test',
        required: true
    },
    questionText: {
        type: String,
        required: [true, 'Please add question text']
    },
    options: {
        type: [String],
        required: true,
        validate: {
            validator: function (v) {
                return v.length === 4;
            },
            message: 'Question must have exactly 4 options'
        }
    },
    correctOption: {
        type: Number,
        required: true,
        min: 0,
        max: 3
    },
    marks: {
        type: Number,
        default: 1
    },
    explanation: {
        type: String,
        default: ''
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Question', questionSchema);
