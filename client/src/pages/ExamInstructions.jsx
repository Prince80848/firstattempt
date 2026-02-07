import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ExamInstructions = () => {
    const { testId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [test, setTest] = useState(null);
    const [questionCount, setQuestionCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [starting, setStarting] = useState(false);
    const [agreed, setAgreed] = useState(false);

    const API_URL = 'http://localhost:5000/api';

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchTestDetails();
    }, [user, testId]);

    const fetchTestDetails = async () => {
        try {
            const testRes = await axios.get(`${API_URL}/tests/${testId}`);
            setTest(testRes.data);

            const countRes = await axios.get(`${API_URL}/tests/${testId}/questions-count`);
            setQuestionCount(countRes.data.count);
        } catch (error) {
            console.error('Error:', error);
        }
        setLoading(false);
    };

    const handleStartTest = async () => {
        if (!agreed) {
            alert('Please agree to the instructions first');
            return;
        }

        setStarting(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const response = await axios.post(`${API_URL}/attempts/start`, { testId }, config);
            navigate(`/exam/take/${testId}`, { state: { attemptId: response.data._id } });
        } catch (error) {
            alert(error.response?.data?.message || 'Error starting test');
            setStarting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center">
                <div className="spinner-border"></div>
            </div>
        );
    }

    if (!test) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center">
                <p>Test not found</p>
            </div>
        );
    }

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <div className="container py-4">
                <div className="row justify-content-center">
                    <div className="col-lg-8 col-xl-6">
                        <div className="bg-white rounded-4 shadow-lg p-4 p-md-5">
                            {/* Header */}
                            <div className="text-center mb-4">
                                <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-circle mb-3" style={{ width: '70px', height: '70px' }}>
                                    <i className="fa fa-file-alt fa-2x text-primary"></i>
                                </div>
                                <h4 className="mb-1">{test.title}</h4>
                                <p className="text-muted mb-0">Please read the instructions carefully</p>
                            </div>

                            {/* Test Info */}
                            <div className="row g-3 mb-4">
                                <div className="col-6 col-md-3">
                                    <div className="bg-light rounded-3 p-3 text-center">
                                        <i className="fa fa-clock text-primary mb-2"></i>
                                        <p className="mb-0 fw-bold">{test.duration}</p>
                                        <small className="text-muted">Minutes</small>
                                    </div>
                                </div>
                                <div className="col-6 col-md-3">
                                    <div className="bg-light rounded-3 p-3 text-center">
                                        <i className="fa fa-question-circle text-success mb-2"></i>
                                        <p className="mb-0 fw-bold">{questionCount}</p>
                                        <small className="text-muted">Questions</small>
                                    </div>
                                </div>
                                <div className="col-6 col-md-3">
                                    <div className="bg-light rounded-3 p-3 text-center">
                                        <i className="fa fa-star text-warning mb-2"></i>
                                        <p className="mb-0 fw-bold">{test.totalMarks}</p>
                                        <small className="text-muted">Total Marks</small>
                                    </div>
                                </div>
                                <div className="col-6 col-md-3">
                                    <div className="bg-light rounded-3 p-3 text-center">
                                        <i className="fa fa-minus-circle text-danger mb-2"></i>
                                        <p className="mb-0 fw-bold">{test.negativeMarking || 0}</p>
                                        <small className="text-muted">Negative</small>
                                    </div>
                                </div>
                            </div>

                            {/* Instructions */}
                            <div className="bg-light rounded-3 p-4 mb-4">
                                <h6 className="mb-3"><i className="fa fa-list-ol me-2 text-primary"></i>Instructions</h6>
                                <div style={{ whiteSpace: 'pre-line' }} className="text-secondary">
                                    {test.instructions}
                                </div>
                            </div>

                            {/* Agree Checkbox */}
                            <div className="form-check mb-4">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="agreeCheck"
                                    checked={agreed}
                                    onChange={(e) => setAgreed(e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor="agreeCheck">
                                    I have read and understood all instructions. I agree to follow the rules.
                                </label>
                            </div>

                            {/* Buttons */}
                            <div className="d-grid gap-2">
                                <button
                                    className="btn btn-dark btn-lg"
                                    onClick={handleStartTest}
                                    disabled={!agreed || starting}
                                >
                                    {starting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Starting...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fa fa-play me-2"></i>
                                            Start Test
                                        </>
                                    )}
                                </button>
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => navigate(-1)}
                                    disabled={starting}
                                >
                                    Go Back
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExamInstructions;
