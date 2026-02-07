import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const TakeTest = () => {
    const { testId } = useParams();
    const location = useLocation();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [test, setTest] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [attempt, setAttempt] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showPalette, setShowPalette] = useState(false);

    const API_URL = 'http://localhost:5000/api';

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        initializeTest();
    }, [user, testId]);

    const initializeTest = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };

            // Get test details
            const testRes = await axios.get(`${API_URL}/tests/${testId}`);
            setTest(testRes.data);

            // Get questions
            const questionsRes = await axios.get(`${API_URL}/questions/test/${testId}`, config);
            setQuestions(questionsRes.data);

            // Check for existing attempt or start new one
            let attemptData;
            if (location.state?.attemptId) {
                const attemptRes = await axios.get(`${API_URL}/attempts/${location.state.attemptId}/check`, config).catch(() => null);
                if (attemptRes?.data) {
                    attemptData = attemptRes.data;
                }
            }

            if (!attemptData) {
                // Get or create attempt
                const checkRes = await axios.get(`${API_URL}/attempts/test/${testId}/check`, config);
                if (checkRes.data.hasAttempted && checkRes.data.status === 'completed') {
                    navigate(`/exam/result/${checkRes.data.attemptId}`);
                    return;
                }

                const startRes = await axios.post(`${API_URL}/attempts/start`, { testId }, config);
                attemptData = startRes.data;
            } else {
                attemptData = (await axios.post(`${API_URL}/attempts/start`, { testId }, config)).data;
            }

            setAttempt(attemptData);

            // Initialize answers from attempt
            const initialAnswers = {};
            attemptData.answers?.forEach(a => {
                if (a.selectedOption !== -1) {
                    initialAnswers[a.questionId] = a.selectedOption;
                }
            });
            setAnswers(initialAnswers);

            // Calculate remaining time
            const endTime = new Date(attemptData.endTime).getTime();
            const now = Date.now();
            const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
            setTimeRemaining(remaining);

        } catch (error) {
            console.error('Error:', error);
            alert(error.response?.data?.message || 'Error loading test');
        }
        setLoading(false);
    };

    // Timer countdown
    useEffect(() => {
        if (timeRemaining <= 0 || !attempt) return;

        const timer = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [attempt, timeRemaining]);

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        if (hrs > 0) {
            return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswer = async (questionId, optionIndex) => {
        setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));

        // Auto-save answer
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`${API_URL}/attempts/${attempt._id}/answer`, {
                questionId,
                selectedOption: optionIndex
            }, config);
        } catch (error) {
            console.error('Error saving answer:', error);
        }
    };

    const handleSubmit = async (autoSubmit = false) => {
        if (!autoSubmit && !window.confirm('Are you sure you want to submit the test?')) {
            return;
        }

        setSubmitting(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const response = await axios.post(`${API_URL}/attempts/${attempt._id}/submit`, {}, config);

            if (response.data.resultReleaseDate) {
                // Result will be released later
                navigate('/profile', {
                    state: {
                        message: `Test submitted! Result will be available on ${new Date(response.data.resultReleaseDate).toLocaleDateString()}`
                    }
                });
            } else {
                // Show result immediately
                navigate(`/exam/result/${attempt._id}`);
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Error submitting test');
            setSubmitting(false);
        }
    };

    const getQuestionStatus = (index) => {
        const q = questions[index];
        if (answers[q._id] !== undefined) return 'answered';
        return 'not-answered';
    };

    if (loading) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
                <div className="text-center">
                    <div className="spinner-border mb-3"></div>
                    <p>Loading test...</p>
                </div>
            </div>
        );
    }

    if (!test || questions.length === 0 || !attempt) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center">
                <p>Test not available</p>
            </div>
        );
    }

    const currentQ = questions[currentQuestion];
    const answeredCount = Object.keys(answers).length;

    return (
        <div className="min-vh-100 bg-light d-flex flex-column">
            {/* Header */}
            <div className="bg-white border-bottom py-2 px-3 d-flex align-items-center justify-content-between sticky-top">
                <div className="d-flex align-items-center gap-2">
                    <span className="fw-bold">{test.title}</span>
                    <span className="badge bg-secondary d-none d-md-inline">
                        {answeredCount}/{questions.length} answered
                    </span>
                </div>

                <div className="d-flex align-items-center gap-2">
                    <div className={`badge ${timeRemaining < 300 ? 'bg-danger' : 'bg-dark'} px-3 py-2`} style={{ fontSize: '1rem' }}>
                        <i className="fa fa-clock me-1"></i>
                        {formatTime(timeRemaining)}
                    </div>
                    <button
                        className="btn btn-sm btn-outline-dark d-md-none"
                        onClick={() => setShowPalette(!showPalette)}
                    >
                        <i className="fa fa-th"></i>
                    </button>
                </div>
            </div>

            <div className="flex-grow-1 d-flex">
                {/* Question Area */}
                <div className="flex-grow-1 p-3 p-md-4" style={{ maxWidth: '100%' }}>
                    <div className="bg-white rounded-3 shadow-sm p-4 h-100 d-flex flex-column">
                        {/* Question Header */}
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <span className="badge bg-primary px-3 py-2">
                                Question {currentQuestion + 1} of {questions.length}
                            </span>
                            <span className="text-muted small">
                                {currentQ.marks} mark{currentQ.marks > 1 ? 's' : ''}
                            </span>
                        </div>

                        {/* Question Text */}
                        <div className="mb-4">
                            <h5 className="mb-0" style={{ lineHeight: 1.6 }}>{currentQ.questionText}</h5>
                        </div>

                        {/* Options */}
                        <div className="flex-grow-1">
                            {currentQ.options.map((option, index) => (
                                <div
                                    key={index}
                                    className={`p-3 mb-2 rounded-3 border cursor-pointer ${answers[currentQ._id] === index
                                            ? 'border-primary bg-primary bg-opacity-10'
                                            : 'border-light bg-light'
                                        }`}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleAnswer(currentQ._id, index)}
                                >
                                    <div className="d-flex align-items-center">
                                        <div
                                            className={`rounded-circle border d-flex align-items-center justify-content-center me-3 ${answers[currentQ._id] === index
                                                    ? 'bg-primary border-primary text-white'
                                                    : 'bg-white'
                                                }`}
                                            style={{ width: '28px', height: '28px', minWidth: '28px' }}
                                        >
                                            <span className="small fw-bold">{String.fromCharCode(65 + index)}</span>
                                        </div>
                                        <span>{option}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Navigation */}
                        <div className="d-flex justify-content-between mt-4 pt-3 border-top">
                            <button
                                className="btn btn-outline-secondary"
                                onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                                disabled={currentQuestion === 0}
                            >
                                <i className="fa fa-arrow-left me-1"></i>Previous
                            </button>

                            {currentQuestion === questions.length - 1 ? (
                                <button
                                    className="btn btn-success"
                                    onClick={() => handleSubmit()}
                                    disabled={submitting}
                                >
                                    {submitting ? 'Submitting...' : 'Submit Test'}
                                </button>
                            ) : (
                                <button
                                    className="btn btn-dark"
                                    onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
                                >
                                    Next<i className="fa fa-arrow-right ms-1"></i>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Question Palette - Desktop */}
                <div className="d-none d-md-block p-3" style={{ width: '250px' }}>
                    <div className="bg-white rounded-3 shadow-sm p-3 sticky-top" style={{ top: '70px' }}>
                        <h6 className="mb-3">Question Palette</h6>

                        <div className="d-flex flex-wrap gap-2 mb-4">
                            {questions.map((q, index) => (
                                <button
                                    key={q._id}
                                    className={`btn btn-sm ${currentQuestion === index
                                            ? 'btn-dark'
                                            : answers[q._id] !== undefined
                                                ? 'btn-success'
                                                : 'btn-outline-secondary'
                                        }`}
                                    style={{ width: '36px', height: '36px' }}
                                    onClick={() => setCurrentQuestion(index)}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>

                        <div className="border-top pt-3">
                            <div className="d-flex align-items-center gap-2 mb-2 small">
                                <span className="badge bg-success">&nbsp;</span>
                                <span>Answered ({answeredCount})</span>
                            </div>
                            <div className="d-flex align-items-center gap-2 small">
                                <span className="badge bg-outline-secondary border">&nbsp;</span>
                                <span>Not Answered ({questions.length - answeredCount})</span>
                            </div>
                        </div>

                        <button
                            className="btn btn-success w-100 mt-4"
                            onClick={() => handleSubmit()}
                            disabled={submitting}
                        >
                            {submitting ? 'Submitting...' : 'Submit Test'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Palette Modal */}
            {showPalette && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-md-none" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
                    <div className="position-absolute bottom-0 start-0 w-100 bg-white rounded-top-4 p-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="mb-0">Question Palette</h6>
                            <button className="btn-close" onClick={() => setShowPalette(false)}></button>
                        </div>
                        <div className="d-flex flex-wrap gap-2">
                            {questions.map((q, index) => (
                                <button
                                    key={q._id}
                                    className={`btn btn-sm ${answers[q._id] !== undefined ? 'btn-success' : 'btn-outline-secondary'
                                        }`}
                                    style={{ width: '40px', height: '40px' }}
                                    onClick={() => { setCurrentQuestion(index); setShowPalette(false); }}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TakeTest;
