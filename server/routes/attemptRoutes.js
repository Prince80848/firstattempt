const express = require('express');
const router = express.Router();
const TestAttempt = require('../models/TestAttempt');
const Test = require('../models/Test');
const Question = require('../models/Question');
const TestSeriesEnrollment = require('../models/TestSeriesEnrollment');
const { protect, admin } = require('../middleware/auth');

// @route   POST /api/attempts/start
// @desc    Start a test attempt
// @access  Enrolled students only
router.post('/start', protect, async (req, res) => {
    try {
        const { testId } = req.body;
        const userId = req.user._id;

        // Get test details
        const test = await Test.findById(testId);
        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        // Check if user has approved enrollment for this test series
        const enrollment = await TestSeriesEnrollment.findOne({
            userId,
            testSeriesId: test.testSeriesId,
            status: 'approved'
        });

        if (!enrollment) {
            return res.status(403).json({ message: 'You are not enrolled in this test series' });
        }

        // Check if access has expired
        if (enrollment.accessEndDate && new Date() > new Date(enrollment.accessEndDate)) {
            return res.status(403).json({ message: 'Your access has expired' });
        }

        // Check if already attempted (one-time only)
        const existingAttempt = await TestAttempt.findOne({ userId, testId });
        if (existingAttempt) {
            if (existingAttempt.status === 'completed') {
                return res.status(400).json({ message: 'You have already attempted this test' });
            }
            // Return existing in-progress attempt
            return res.json(existingAttempt);
        }

        // Get all questions for this test
        const questions = await Question.find({ testId });

        // Create new attempt
        const attempt = await TestAttempt.create({
            userId,
            testId,
            answers: questions.map(q => ({
                questionId: q._id,
                selectedOption: -1 // -1 = unanswered
            })),
            startTime: new Date(),
            endTime: new Date(Date.now() + test.duration * 60 * 1000) // Calculate end time
        });

        res.status(201).json(attempt);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/attempts/:id/answer
// @desc    Save an answer (auto-save during exam)
// @access  Owner only
router.put('/:id/answer', protect, async (req, res) => {
    try {
        const { questionId, selectedOption } = req.body;
        const attempt = await TestAttempt.findById(req.params.id);

        if (!attempt) {
            return res.status(404).json({ message: 'Attempt not found' });
        }

        if (attempt.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (attempt.status === 'completed') {
            return res.status(400).json({ message: 'Test already submitted' });
        }

        // Check if time has expired
        if (new Date() > new Date(attempt.endTime)) {
            return res.status(400).json({ message: 'Time has expired' });
        }

        // Update the specific answer
        const answerIndex = attempt.answers.findIndex(
            a => a.questionId.toString() === questionId
        );

        if (answerIndex !== -1) {
            attempt.answers[answerIndex].selectedOption = selectedOption;
            await attempt.save();
        }

        res.json({ message: 'Answer saved' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/attempts/:id/submit
// @desc    Submit test and calculate score
// @access  Owner only
router.post('/:id/submit', protect, async (req, res) => {
    try {
        const attempt = await TestAttempt.findById(req.params.id);

        if (!attempt) {
            return res.status(404).json({ message: 'Attempt not found' });
        }

        if (attempt.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (attempt.status === 'completed') {
            return res.status(400).json({ message: 'Already submitted' });
        }

        // Get test and questions
        const test = await Test.findById(attempt.testId);
        const questions = await Question.find({ testId: attempt.testId });

        // Calculate score
        let correctCount = 0;
        let wrongCount = 0;
        let unansweredCount = 0;
        let score = 0;

        for (const answer of attempt.answers) {
            const question = questions.find(
                q => q._id.toString() === answer.questionId.toString()
            );

            if (!question) continue;

            if (answer.selectedOption === -1) {
                unansweredCount++;
            } else if (answer.selectedOption === question.correctOption) {
                correctCount++;
                score += question.marks;
            } else {
                wrongCount++;
                score -= test.negativeMarking || 0;
            }
        }

        // Ensure score doesn't go negative
        score = Math.max(0, score);

        // Update attempt
        attempt.score = score;
        attempt.correctCount = correctCount;
        attempt.wrongCount = wrongCount;
        attempt.unansweredCount = unansweredCount;
        attempt.status = 'completed';
        attempt.endTime = new Date();
        await attempt.save();

        // Check if result should be shown immediately
        if (!test.resultReleaseDate || new Date() >= new Date(test.resultReleaseDate)) {
            res.json({
                message: 'Test submitted successfully',
                score,
                correctCount,
                wrongCount,
                unansweredCount,
                totalMarks: test.totalMarks
            });
        } else {
            res.json({
                message: 'Test submitted successfully',
                resultReleaseDate: test.resultReleaseDate
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/attempts/my
// @desc    Get all attempts by current user
// @access  Protected
router.get('/my', protect, async (req, res) => {
    try {
        const attempts = await TestAttempt.find({ userId: req.user._id })
            .populate('testId', 'title testSeriesId duration totalMarks resultReleaseDate')
            .sort({ createdAt: -1 });
        res.json(attempts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/attempts/:id/result
// @desc    Get attempt result with answers
// @access  Owner only (after result release)
router.get('/:id/result', protect, async (req, res) => {
    try {
        const attempt = await TestAttempt.findById(req.params.id);

        if (!attempt) {
            return res.status(404).json({ message: 'Attempt not found' });
        }

        if (attempt.userId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (attempt.status !== 'completed') {
            return res.status(400).json({ message: 'Test not yet completed' });
        }

        const test = await Test.findById(attempt.testId);

        // Check result release date
        if (test.resultReleaseDate && new Date() < new Date(test.resultReleaseDate)) {
            return res.status(403).json({
                message: 'Results not yet released',
                resultReleaseDate: test.resultReleaseDate
            });
        }

        // Get questions with answers for review
        const questions = await Question.find({ testId: attempt.testId });

        res.json({
            attempt,
            test: {
                title: test.title,
                totalMarks: test.totalMarks,
                passingMarks: test.passingMarks,
                negativeMarking: test.negativeMarking
            },
            questions
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/attempts/test/:testId/leaderboard
// @desc    Get leaderboard for a test
// @access  Protected (after result release, or Admin anytime)
router.get('/test/:testId/leaderboard', protect, async (req, res) => {
    try {
        const test = await Test.findById(req.params.testId);
        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        // Check result release date (admins can bypass)
        if (!req.user.isAdmin && test.resultReleaseDate && new Date() < new Date(test.resultReleaseDate)) {
            return res.status(403).json({
                message: 'Results not yet released',
                resultReleaseDate: test.resultReleaseDate
            });
        }

        const leaderboard = await TestAttempt.find({
            testId: req.params.testId,
            status: 'completed'
        })
            .populate('userId', 'name')
            .sort({ score: -1, endTime: 1 }) // Higher score first, then faster completion
            .limit(100);

        const formattedLeaderboard = leaderboard.map((entry, index) => {
            let timeTaken = null;
            if (entry.endTime && entry.startTime) {
                const seconds = Math.round((new Date(entry.endTime) - new Date(entry.startTime)) / 1000);
                const mins = Math.floor(seconds / 60);
                const secs = seconds % 60;
                timeTaken = `${mins}:${secs.toString().padStart(2, '0')}`;
            }
            return {
                rank: index + 1,
                name: entry.userId?.name || 'Unknown',
                score: entry.score,
                correctCount: entry.correctCount,
                timeTaken
            };
        });

        res.json(formattedLeaderboard);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/attempts/test/:testId/check
// @desc    Check if user has already attempted this test
// @access  Protected
router.get('/test/:testId/check', protect, async (req, res) => {
    try {
        const attempt = await TestAttempt.findOne({
            userId: req.user._id,
            testId: req.params.testId
        });

        res.json({
            hasAttempted: !!attempt,
            status: attempt?.status || null,
            attemptId: attempt?._id || null
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/attempts/test/:testId/all
// @desc    Get all attempts for a test (Admin only)
// @access  Admin
router.get('/test/:testId/all', protect, admin, async (req, res) => {
    try {
        const attempts = await TestAttempt.find({ testId: req.params.testId })
            .populate('userId', 'name email')
            .sort({ score: -1 });
        res.json(attempts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
