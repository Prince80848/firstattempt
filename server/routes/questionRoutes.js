const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const Test = require('../models/Test');
const { protect, admin, mentorOrAdmin } = require('../middleware/auth');

// @route   POST /api/questions
// @desc    Add a question to a test
// @access  Admin/Mentor
router.post('/', protect, mentorOrAdmin, async (req, res) => {
    try {
        const { testId } = req.body;

        // If mentor, check if they have access to this test's series
        if (req.user.role === 'mentor') {
            const test = await Test.findById(testId);
            if (!test) {
                return res.status(404).json({ message: 'Test not found' });
            }
            if (!req.user.assignedTestSeries.includes(test.testSeriesId.toString())) {
                return res.status(403).json({ message: 'Not authorized for this test series' });
            }
        }

        const question = await Question.create({
            ...req.body,
            createdBy: req.user._id
        });
        res.status(201).json(question);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @route   POST /api/questions/bulk
// @desc    Add multiple questions at once
// @access  Admin/Mentor
router.post('/bulk', protect, mentorOrAdmin, async (req, res) => {
    try {
        const { testId, questions } = req.body;

        // Verify access for mentor
        if (req.user.role === 'mentor') {
            const test = await Test.findById(testId);
            if (!test || !req.user.assignedTestSeries.includes(test.testSeriesId.toString())) {
                return res.status(403).json({ message: 'Not authorized' });
            }
        }

        const questionsWithMeta = questions.map(q => ({
            ...q,
            testId,
            createdBy: req.user._id
        }));

        const created = await Question.insertMany(questionsWithMeta);
        res.status(201).json({ message: `${created.length} questions added`, questions: created });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @route   GET /api/questions/test/:testId
// @desc    Get all questions for a test
// @access  Admin/Mentor (with answers), Students during exam (without answers)
router.get('/test/:testId', protect, async (req, res) => {
    try {
        let questions = await Question.find({ testId: req.params.testId });

        // If not admin/mentor, hide correct answers (during exam)
        if (req.user.role === 'student') {
            questions = questions.map(q => ({
                _id: q._id,
                questionText: q.questionText,
                options: q.options,
                marks: q.marks
                // correctOption and explanation hidden
            }));
        }

        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/questions/test/:testId/with-answers
// @desc    Get questions with answers (for result review)
// @access  Student (only after result release) or Admin/Mentor
router.get('/test/:testId/with-answers', protect, async (req, res) => {
    try {
        const test = await Test.findById(req.params.testId);
        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        // Students can only see answers after result release
        if (req.user.role === 'student') {
            if (test.resultReleaseDate && new Date() < new Date(test.resultReleaseDate)) {
                return res.status(403).json({ message: 'Results not yet released' });
            }
        }

        const questions = await Question.find({ testId: req.params.testId });
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/questions/:id
// @desc    Update a question
// @access  Admin/Mentor
router.put('/:id', protect, mentorOrAdmin, async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Mentor authorization check
        if (req.user.role === 'mentor') {
            const test = await Test.findById(question.testId);
            if (!req.user.assignedTestSeries.includes(test.testSeriesId.toString())) {
                return res.status(403).json({ message: 'Not authorized' });
            }
        }

        const updated = await Question.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @route   DELETE /api/questions/:id
// @desc    Delete a question
// @access  Admin/Mentor
router.delete('/:id', protect, mentorOrAdmin, async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Mentor authorization check
        if (req.user.role === 'mentor') {
            const test = await Test.findById(question.testId);
            if (!req.user.assignedTestSeries.includes(test.testSeriesId.toString())) {
                return res.status(403).json({ message: 'Not authorized' });
            }
        }

        await question.deleteOne();
        res.json({ message: 'Question deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
