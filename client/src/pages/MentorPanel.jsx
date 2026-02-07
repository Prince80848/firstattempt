import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const MentorPanel = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('tests');
    const [testSeries, setTestSeries] = useState([]);
    const [tests, setTests] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [selectedSeries, setSelectedSeries] = useState(null);
    const [selectedTest, setSelectedTest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Question form
    const [questionForm, setQuestionForm] = useState({
        questionText: '',
        options: ['', '', '', ''],
        correctOption: 0,
        marks: 1,
        explanation: ''
    });
    const [editingQuestion, setEditingQuestion] = useState(null);

    const API_URL = 'http://localhost:5000/api';

    useEffect(() => {
        // Allow mentors and admins
        if (!user || (user.role !== 'mentor' && !user.isAdmin)) {
            navigate('/');
            return;
        }
        fetchAssignedTestSeries();
    }, [user, navigate]);

    const fetchAssignedTestSeries = async () => {
        try {
            const response = await axios.get(`${API_URL}/test-series`);
            // Admin gets all test series, mentor only gets assigned ones
            const available = user.isAdmin
                ? response.data
                : response.data.filter(ts => user.assignedTestSeries?.includes(ts._id));
            setTestSeries(available);
            if (available.length > 0) {
                setSelectedSeries(available[0]._id);
                fetchTests(available[0]._id);
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setLoading(false);
    };

    const fetchTests = async (seriesId) => {
        try {
            const response = await axios.get(`${API_URL}/tests/series/${seriesId}`);
            setTests(response.data);
            if (response.data.length > 0) {
                setSelectedTest(response.data[0]._id);
                fetchQuestions(response.data[0]._id);
            } else {
                setQuestions([]);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchQuestions = async (testId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const response = await axios.get(`${API_URL}/questions/test/${testId}`, config);
            setQuestions(response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSeriesChange = (seriesId) => {
        setSelectedSeries(seriesId);
        fetchTests(seriesId);
    };

    const handleTestChange = (testId) => {
        setSelectedTest(testId);
        fetchQuestions(testId);
    };

    const handleQuestionSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const data = { ...questionForm, testId: selectedTest };

            if (editingQuestion) {
                await axios.put(`${API_URL}/questions/${editingQuestion}`, data, config);
                setMessage({ type: 'success', text: 'Question updated!' });
            } else {
                await axios.post(`${API_URL}/questions`, data, config);
                setMessage({ type: 'success', text: 'Question added!' });
            }

            resetForm();
            fetchQuestions(selectedTest);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Error saving question' });
        }
    };

    const handleEditQuestion = (question) => {
        setQuestionForm({
            questionText: question.questionText,
            options: question.options,
            correctOption: question.correctOption,
            marks: question.marks,
            explanation: question.explanation || ''
        });
        setEditingQuestion(question._id);
        setActiveTab('add');
    };

    const handleDeleteQuestion = async (id) => {
        if (!window.confirm('Delete this question?')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`${API_URL}/questions/${id}`, config);
            setMessage({ type: 'success', text: 'Question deleted!' });
            fetchQuestions(selectedTest);
        } catch (error) {
            setMessage({ type: 'error', text: 'Error deleting question' });
        }
    };

    const resetForm = () => {
        setQuestionForm({
            questionText: '',
            options: ['', '', '', ''],
            correctOption: 0,
            marks: 1,
            explanation: ''
        });
        setEditingQuestion(null);
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...questionForm.options];
        newOptions[index] = value;
        setQuestionForm({ ...questionForm, options: newOptions });
    };

    if (!user || (user.role !== 'mentor' && !user.isAdmin)) {
        return null;
    }

    return (
        <div className="min-vh-100" style={{ background: '#f5f7fa' }}>
            <div className="container py-4">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h4 className="mb-1"><i className="fa fa-chalkboard-teacher me-2"></i>Mentor Panel</h4>
                        <p className="text-muted mb-0 small">Welcome, {user.name}</p>
                    </div>
                    <Link to="/profile" className="btn btn-outline-secondary btn-sm">
                        <i className="fa fa-arrow-left me-1"></i>Back
                    </Link>
                </div>

                {/* Message */}
                {message.text && (
                    <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'} alert-dismissible`}>
                        {message.text}
                        <button className="btn-close" onClick={() => setMessage({ type: '', text: '' })}></button>
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border"></div>
                    </div>
                ) : testSeries.length === 0 ? (
                    <div className="text-center py-5 bg-white rounded-3">
                        <i className="fa fa-folder-open fa-3x text-muted mb-3"></i>
                        <p className="text-muted">No test series assigned to you.</p>
                        <p className="small text-muted">Contact admin to get test series assigned.</p>
                    </div>
                ) : (
                    <div className="row g-4">
                        {/* Sidebar */}
                        <div className="col-md-4 col-lg-3">
                            <div className="bg-white rounded-3 shadow-sm p-3">
                                <label className="form-label small text-muted">Select Test Series</label>
                                <select
                                    className="form-select mb-3"
                                    value={selectedSeries || ''}
                                    onChange={(e) => handleSeriesChange(e.target.value)}
                                >
                                    {testSeries.map(ts => (
                                        <option key={ts._id} value={ts._id}>{ts.title}</option>
                                    ))}
                                </select>

                                <label className="form-label small text-muted">Select Test</label>
                                {tests.length === 0 ? (
                                    <p className="text-muted small">No tests in this series</p>
                                ) : (
                                    <select
                                        className="form-select"
                                        value={selectedTest || ''}
                                        onChange={(e) => handleTestChange(e.target.value)}
                                    >
                                        {tests.map(t => (
                                            <option key={t._id} value={t._id}>{t.title}</option>
                                        ))}
                                    </select>
                                )}

                                {/* Nav */}
                                <hr className="my-3" />
                                <div className="d-grid gap-2">
                                    <button
                                        className={`btn ${activeTab === 'tests' ? 'btn-dark' : 'btn-outline-dark'} btn-sm text-start`}
                                        onClick={() => setActiveTab('tests')}
                                    >
                                        <i className="fa fa-list me-2"></i>View Questions
                                    </button>
                                    <button
                                        className={`btn ${activeTab === 'add' ? 'btn-dark' : 'btn-outline-dark'} btn-sm text-start`}
                                        onClick={() => { setActiveTab('add'); resetForm(); }}
                                        disabled={!selectedTest}
                                    >
                                        <i className="fa fa-plus me-2"></i>Add Question
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="col-md-8 col-lg-9">
                            {activeTab === 'tests' && (
                                <div className="bg-white rounded-3 shadow-sm p-4">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h6 className="mb-0">Questions ({questions.length})</h6>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => { setActiveTab('add'); resetForm(); }}
                                            disabled={!selectedTest}
                                        >
                                            <i className="fa fa-plus me-1"></i>Add
                                        </button>
                                    </div>

                                    {questions.length === 0 ? (
                                        <div className="text-center py-4 text-muted">
                                            <i className="fa fa-question-circle fa-2x mb-2"></i>
                                            <p className="mb-0">No questions added yet</p>
                                        </div>
                                    ) : (
                                        <div className="list-group">
                                            {questions.map((q, index) => (
                                                <div key={q._id} className="list-group-item">
                                                    <div className="d-flex justify-content-between">
                                                        <div className="flex-grow-1">
                                                            <div className="d-flex align-items-start gap-2">
                                                                <span className="badge bg-secondary">{index + 1}</span>
                                                                <div>
                                                                    <p className="mb-2 fw-medium">{q.questionText}</p>
                                                                    <div className="row g-2">
                                                                        {q.options.map((opt, i) => (
                                                                            <div key={i} className="col-6">
                                                                                <small className={i === q.correctOption ? 'text-success fw-bold' : 'text-muted'}>
                                                                                    {String.fromCharCode(65 + i)}. {opt}
                                                                                    {i === q.correctOption && ' ✓'}
                                                                                </small>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                    <small className="text-muted">Marks: {q.marks}</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="ms-2">
                                                            <button
                                                                className="btn btn-sm btn-outline-primary me-1"
                                                                onClick={() => handleEditQuestion(q)}
                                                            >
                                                                <i className="fa fa-edit"></i>
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => handleDeleteQuestion(q._id)}
                                                            >
                                                                <i className="fa fa-trash"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'add' && (
                                <div className="bg-white rounded-3 shadow-sm p-4">
                                    <h6 className="mb-3">
                                        {editingQuestion ? 'Edit Question' : 'Add New Question'}
                                    </h6>

                                    <form onSubmit={handleQuestionSubmit}>
                                        <div className="mb-3">
                                            <label className="form-label">Question Text *</label>
                                            <textarea
                                                className="form-control"
                                                rows="3"
                                                value={questionForm.questionText}
                                                onChange={(e) => setQuestionForm({ ...questionForm, questionText: e.target.value })}
                                                required
                                            ></textarea>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Options *</label>
                                            {questionForm.options.map((opt, i) => (
                                                <div key={i} className="input-group mb-2">
                                                    <span className="input-group-text">{String.fromCharCode(65 + i)}</span>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={opt}
                                                        onChange={(e) => handleOptionChange(i, e.target.value)}
                                                        placeholder={`Option ${String.fromCharCode(65 + i)}`}
                                                        required
                                                    />
                                                    <div className="input-group-text">
                                                        <input
                                                            type="radio"
                                                            name="correct"
                                                            checked={questionForm.correctOption === i}
                                                            onChange={() => setQuestionForm({ ...questionForm, correctOption: i })}
                                                        />
                                                        <span className="ms-1 small">Correct</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="row g-3 mb-3">
                                            <div className="col-md-6">
                                                <label className="form-label">Marks</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    min="1"
                                                    value={questionForm.marks}
                                                    onChange={(e) => setQuestionForm({ ...questionForm, marks: parseInt(e.target.value) })}
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Explanation (Optional)</label>
                                            <textarea
                                                className="form-control"
                                                rows="2"
                                                value={questionForm.explanation}
                                                onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                                                placeholder="Explain the correct answer..."
                                            ></textarea>
                                        </div>

                                        <div className="d-flex gap-2">
                                            <button type="submit" className="btn btn-dark">
                                                <i className="fa fa-save me-1"></i>
                                                {editingQuestion ? 'Update' : 'Add Question'}
                                            </button>
                                            {editingQuestion && (
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary"
                                                    onClick={resetForm}
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MentorPanel;
