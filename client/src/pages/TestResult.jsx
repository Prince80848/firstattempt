import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const TestResult = () => {
    const { attemptId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [result, setResult] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('result');
    const [showAnswers, setShowAnswers] = useState(false);

    const API_URL = 'http://localhost:5000/api';

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchResult();
    }, [user, attemptId]);

    const fetchResult = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const response = await axios.get(`${API_URL}/attempts/${attemptId}/result`, config);
            setResult(response.data);

            // Fetch leaderboard
            const lbRes = await axios.get(`${API_URL}/attempts/test/${response.data.attempt.testId}/leaderboard`, config);
            setLeaderboard(lbRes.data);
        } catch (error) {
            console.error('Error:', error);
            if (error.response?.status === 403) {
                alert(error.response.data.message);
                navigate('/profile');
            }
        }
        setLoading(false);
    };

    const getUserRank = () => {
        const index = leaderboard.findIndex(l => l.name === user.name);
        return index !== -1 ? index + 1 : null;
    };

    if (loading) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center">
                <div className="spinner-border"></div>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center">
                <div className="text-center">
                    <i className="fa fa-exclamation-circle fa-3x text-muted mb-3"></i>
                    <h5>Result not available</h5>
                    <Link to="/profile" className="btn btn-dark mt-3">Go Back</Link>
                </div>
            </div>
        );
    }

    const { attempt, test, questions } = result;
    const percentage = Math.round((attempt.score / test.totalMarks) * 100);
    const isPassed = attempt.score >= test.passingMarks;
    const userRank = getUserRank();

    return (
        <div className="min-vh-100" style={{ background: '#f5f7fa' }}>
            <div className="container py-4" style={{ maxWidth: '900px' }}>
                {/* Header */}
                <div className="d-flex align-items-center gap-3 mb-4">
                    <Link to="/profile" className="btn btn-outline-secondary btn-sm">
                        <i className="fa fa-arrow-left"></i>
                    </Link>
                    <div>
                        <h4 className="mb-0">{test.title}</h4>
                        <p className="text-muted small mb-0">Test Result</p>
                    </div>
                </div>

                {/* Score Card */}
                <div className={`rounded-4 shadow-sm p-4 mb-4 text-white ${isPassed ? 'bg-success' : 'bg-danger'}`}>
                    <div className="row align-items-center">
                        <div className="col-md-4 text-center mb-3 mb-md-0">
                            <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-white bg-opacity-25" style={{ width: '120px', height: '120px' }}>
                                <div>
                                    <h2 className="mb-0">{percentage}%</h2>
                                    <small>Score</small>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-8">
                            <div className="row g-3">
                                <div className="col-6 col-md-3">
                                    <div className="bg-white bg-opacity-10 rounded-3 p-3 text-center">
                                        <h4 className="mb-0">{attempt.score}</h4>
                                        <small>Marks</small>
                                    </div>
                                </div>
                                <div className="col-6 col-md-3">
                                    <div className="bg-white bg-opacity-10 rounded-3 p-3 text-center">
                                        <h4 className="mb-0">{attempt.correctCount}</h4>
                                        <small>Correct</small>
                                    </div>
                                </div>
                                <div className="col-6 col-md-3">
                                    <div className="bg-white bg-opacity-10 rounded-3 p-3 text-center">
                                        <h4 className="mb-0">{attempt.wrongCount}</h4>
                                        <small>Wrong</small>
                                    </div>
                                </div>
                                <div className="col-6 col-md-3">
                                    <div className="bg-white bg-opacity-10 rounded-3 p-3 text-center">
                                        <h4 className="mb-0">{attempt.unansweredCount}</h4>
                                        <small>Skipped</small>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3 d-flex flex-wrap gap-3">
                                <span><i className="fa fa-star me-1"></i>Total: {test.totalMarks}</span>
                                <span><i className="fa fa-check me-1"></i>Passing: {test.passingMarks}</span>
                                {userRank && <span><i className="fa fa-trophy me-1"></i>Rank: #{userRank}</span>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-3 shadow-sm">
                    <div className="p-3 border-bottom">
                        <div className="d-flex gap-2">
                            <button
                                className={`btn btn-sm ${activeTab === 'result' ? 'btn-dark' : 'btn-outline-dark'}`}
                                onClick={() => setActiveTab('result')}
                            >
                                <i className="fa fa-chart-bar me-1"></i>Summary
                            </button>
                            <button
                                className={`btn btn-sm ${activeTab === 'leaderboard' ? 'btn-dark' : 'btn-outline-dark'}`}
                                onClick={() => setActiveTab('leaderboard')}
                            >
                                <i className="fa fa-trophy me-1"></i>Leaderboard
                            </button>
                            <button
                                className={`btn btn-sm ${activeTab === 'answers' ? 'btn-dark' : 'btn-outline-dark'}`}
                                onClick={() => setActiveTab('answers')}
                            >
                                <i className="fa fa-list me-1"></i>Answers
                            </button>
                        </div>
                    </div>

                    <div className="p-4">
                        {activeTab === 'result' && (
                            <div>
                                <h6 className="mb-3">Performance Summary</h6>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <div className="bg-light rounded-3 p-3">
                                            <div className="d-flex justify-content-between mb-2">
                                                <span>Accuracy</span>
                                                <span className="fw-bold">
                                                    {attempt.correctCount + attempt.wrongCount > 0
                                                        ? Math.round((attempt.correctCount / (attempt.correctCount + attempt.wrongCount)) * 100)
                                                        : 0}%
                                                </span>
                                            </div>
                                            <div className="progress" style={{ height: '8px' }}>
                                                <div
                                                    className="progress-bar bg-success"
                                                    style={{
                                                        width: `${attempt.correctCount + attempt.wrongCount > 0
                                                            ? (attempt.correctCount / (attempt.correctCount + attempt.wrongCount)) * 100
                                                            : 0}%`
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="bg-light rounded-3 p-3">
                                            <div className="d-flex justify-content-between mb-2">
                                                <span>Attempt Rate</span>
                                                <span className="fw-bold">
                                                    {Math.round(((attempt.correctCount + attempt.wrongCount) / questions.length) * 100)}%
                                                </span>
                                            </div>
                                            <div className="progress" style={{ height: '8px' }}>
                                                <div
                                                    className="progress-bar bg-primary"
                                                    style={{
                                                        width: `${((attempt.correctCount + attempt.wrongCount) / questions.length) * 100}%`
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 p-4 bg-light rounded-3 text-center">
                                    <h5 className={isPassed ? 'text-success' : 'text-danger'}>
                                        {isPassed ? '🎉 Congratulations! You Passed!' : '😔 Better Luck Next Time!'}
                                    </h5>
                                    <p className="text-muted mb-0">
                                        You scored {attempt.score} out of {test.totalMarks} marks
                                    </p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'leaderboard' && (
                            <div>
                                <h6 className="mb-3">Leaderboard - Top 100</h6>
                                {leaderboard.length === 0 ? (
                                    <p className="text-muted text-center py-4">No data available</p>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Rank</th>
                                                    <th>Name</th>
                                                    <th>Score</th>
                                                    <th>Correct</th>
                                                    <th>Time</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {leaderboard.map((entry, index) => (
                                                    <tr
                                                        key={index}
                                                        className={entry.name === user.name ? 'table-primary' : ''}
                                                    >
                                                        <td>
                                                            {entry.rank <= 3 ? (
                                                                <span className={`badge ${entry.rank === 1 ? 'bg-warning' : entry.rank === 2 ? 'bg-secondary' : 'bg-danger'}`}>
                                                                    #{entry.rank}
                                                                </span>
                                                            ) : (
                                                                `#${entry.rank}`
                                                            )}
                                                        </td>
                                                        <td>
                                                            {entry.name}
                                                            {entry.name === user.name && <span className="badge bg-primary ms-2">You</span>}
                                                        </td>
                                                        <td className="fw-bold">{entry.score}</td>
                                                        <td>{entry.correctCount}</td>
                                                        <td>{entry.timeTaken || '-'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'answers' && (
                            <div>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h6 className="mb-0">Answer Review</h6>
                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => setShowAnswers(!showAnswers)}
                                    >
                                        {showAnswers ? 'Hide Answers' : 'Show Answers'}
                                    </button>
                                </div>

                                {questions.map((q, index) => {
                                    const userAnswer = attempt.answers.find(
                                        a => a.questionId === q._id
                                    );
                                    const selectedOption = userAnswer?.selectedOption ?? -1;
                                    const isCorrect = selectedOption === q.correctOption;
                                    const isUnanswered = selectedOption === -1;

                                    return (
                                        <div key={q._id} className="border rounded-3 p-3 mb-3">
                                            <div className="d-flex align-items-start gap-2 mb-2">
                                                <span className={`badge ${isUnanswered ? 'bg-secondary' : isCorrect ? 'bg-success' : 'bg-danger'}`}>
                                                    {index + 1}
                                                </span>
                                                <div className="flex-grow-1">
                                                    <p className="mb-2 fw-medium">{q.questionText}</p>

                                                    <div className="row g-2 mb-2">
                                                        {q.options.map((opt, i) => (
                                                            <div key={i} className="col-md-6">
                                                                <div className={`p-2 rounded border small ${showAnswers && i === q.correctOption
                                                                    ? 'border-success bg-success bg-opacity-10'
                                                                    : selectedOption === i && !isCorrect
                                                                        ? 'border-danger bg-danger bg-opacity-10'
                                                                        : ''
                                                                    }`}>
                                                                    <span className="fw-bold me-1">{String.fromCharCode(65 + i)}.</span>
                                                                    {opt}
                                                                    {selectedOption === i && <span className="ms-1">✓ (Your answer)</span>}
                                                                    {showAnswers && i === q.correctOption && <span className="ms-1 text-success">✓ Correct</span>}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {showAnswers && q.explanation && (
                                                        <div className="bg-light rounded p-2 small">
                                                            <strong>Explanation:</strong> {q.explanation}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestResult;
