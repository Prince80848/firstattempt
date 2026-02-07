import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ExamPortal = () => {
    const { testSeriesId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [testSeries, setTestSeries] = useState(null);
    const [tests, setTests] = useState([]);
    const [attempts, setAttempts] = useState({});
    const [loading, setLoading] = useState(true);

    const API_URL = 'http://localhost:5000/api';

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchData();
    }, [user, testSeriesId]);

    const fetchData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };

            // Get test series details
            const seriesRes = await axios.get(`${API_URL}/test-series/${testSeriesId}`);
            setTestSeries(seriesRes.data);

            // Get tests for this series
            const testsRes = await axios.get(`${API_URL}/tests/series/${testSeriesId}`);
            // Filter to only show active tests to students
            const activeTests = testsRes.data.filter(test => test.isActive === true);
            setTests(activeTests);

            // Check attempt status for each test
            const attemptStatus = {};
            for (const test of activeTests) {
                try {
                    const checkRes = await axios.get(`${API_URL}/attempts/test/${test._id}/check`, config);
                    attemptStatus[test._id] = checkRes.data;
                } catch (e) {
                    attemptStatus[test._id] = { hasAttempted: false };
                }
            }
            setAttempts(attemptStatus);
        } catch (error) {
            console.error('Error:', error);
        }
        setLoading(false);
    };

    const getTestStatus = (test) => {
        const attempt = attempts[test._id];
        if (!attempt) return { status: 'loading', label: 'Loading...' };

        if (attempt.hasAttempted) {
            if (attempt.status === 'completed') {
                // Check if result is released
                if (!test.resultReleaseDate || new Date() >= new Date(test.resultReleaseDate)) {
                    return { status: 'completed', label: 'View Result', canViewResult: true };
                }
                return {
                    status: 'awaiting',
                    label: 'Result on ' + new Date(test.resultReleaseDate).toLocaleDateString()
                };
            }
            return { status: 'in-progress', label: 'Resume' };
        }
        return { status: 'not-started', label: 'Start Test' };
    };

    if (loading) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center">
                <div className="spinner-border"></div>
            </div>
        );
    }

    if (!testSeries) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center">
                <div className="text-center">
                    <i className="fa fa-exclamation-circle fa-3x text-muted mb-3"></i>
                    <h5>Test Series not found</h5>
                    <Link to="/profile" className="btn btn-dark mt-3">Go Back</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-vh-100" style={{ background: '#f5f7fa' }}>
            <div className="container py-4" style={{ maxWidth: '900px' }}>
                {/* Header */}
                <div className="d-flex align-items-center gap-3 mb-4">
                    <Link to="/profile" className="btn btn-outline-secondary btn-sm">
                        <i className="fa fa-arrow-left"></i>
                    </Link>
                    <div>
                        <h4 className="mb-0">{testSeries.title}</h4>
                        <p className="text-muted small mb-0">{testSeries.category}</p>
                    </div>
                </div>

                {/* Tests Grid */}
                {tests.length === 0 ? (
                    <div className="bg-white rounded-3 shadow-sm p-5 text-center">
                        <i className="fa fa-file-alt fa-3x text-muted mb-3"></i>
                        <p className="text-muted">No tests available yet</p>
                    </div>
                ) : (
                    <div className="row g-3">
                        {tests.map((test, index) => {
                            const testStatus = getTestStatus(test);
                            return (
                                <div key={test._id} className="col-md-6">
                                    <div className="bg-white rounded-3 shadow-sm p-4 h-100">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <span className="badge bg-dark">{index + 1}</span>
                                            {testStatus.status === 'completed' && (
                                                <span className="badge bg-success">Completed</span>
                                            )}
                                            {testStatus.status === 'awaiting' && (
                                                <span className="badge bg-warning text-dark">Awaiting Result</span>
                                            )}
                                        </div>

                                        <h6 className="mb-2">{test.title}</h6>

                                        <div className="d-flex flex-wrap gap-3 text-muted small mb-3">
                                            <span><i className="fa fa-clock me-1"></i>{test.duration} min</span>
                                            <span><i className="fa fa-star me-1"></i>{test.totalMarks} marks</span>
                                            {test.negativeMarking > 0 && (
                                                <span><i className="fa fa-minus-circle me-1"></i>-{test.negativeMarking}</span>
                                            )}
                                        </div>

                                        {testStatus.status === 'not-started' && (
                                            <Link
                                                to={`/exam/instructions/${test._id}`}
                                                className="btn btn-dark btn-sm w-100"
                                            >
                                                <i className="fa fa-play me-1"></i>Start Test
                                            </Link>
                                        )}

                                        {testStatus.status === 'in-progress' && (
                                            <Link
                                                to={`/exam/take/${test._id}`}
                                                className="btn btn-warning btn-sm w-100"
                                            >
                                                <i className="fa fa-redo me-1"></i>Resume Test
                                            </Link>
                                        )}

                                        {testStatus.status === 'completed' && testStatus.canViewResult && (
                                            <Link
                                                to={`/exam/result/${attempts[test._id]?.attemptId}`}
                                                className="btn btn-success btn-sm w-100"
                                            >
                                                <i className="fa fa-chart-bar me-1"></i>View Result
                                            </Link>
                                        )}

                                        {testStatus.status === 'awaiting' && (
                                            <button className="btn btn-secondary btn-sm w-100" disabled>
                                                <i className="fa fa-hourglass-half me-1"></i>{testStatus.label}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExamPortal;
