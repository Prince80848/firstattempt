import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [users, setUsers] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [banners, setBanners] = useState([]);
    const [testSeries, setTestSeries] = useState([]);
    const [testSeriesEnrollments, setTestSeriesEnrollments] = useState([]);
    const [tsEnrollStats, setTsEnrollStats] = useState({ pending: 0, approved: 0, rejected: 0, totalRevenue: 0 });
    const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, completed: 0 });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });
    const fileInputRefs = useRef({});

    // Tests (Exams) Management
    const [tests, setTests] = useState([]);
    const [showTestForm, setShowTestForm] = useState(false);
    const [editingTest, setEditingTest] = useState(null);
    const [testForm, setTestForm] = useState({
        title: '', testSeriesId: '', duration: 60, totalMarks: 100, passingMarks: 40,
        negativeMarking: 0, instructions: '', resultReleaseDate: '', isActive: true
    });

    // Mentors Management
    const [mentors, setMentors] = useState([]);

    // Test Series Form
    const [showTestSeriesForm, setShowTestSeriesForm] = useState(false);
    const [editingTestSeries, setEditingTestSeries] = useState(null);
    const [testSeriesForm, setTestSeriesForm] = useState({
        title: '', description: '', price: '', duration: '', category: 'CA Foundation', level: 'Beginner', totalTests: 10, features: ''
    });

    const API_URL = 'http://localhost:5000/api';

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };

            const [usersRes, enrollmentsRes, bannersRes, statsRes, testSeriesRes, tsEnrollRes, tsEnrollStatsRes, testsRes] = await Promise.all([
                axios.get(`${API_URL}/admin/users`, config),
                axios.get(`${API_URL}/enrollments`, config),
                axios.get(`${API_URL}/banners/admin`, config),
                axios.get(`${API_URL}/enrollments/stats`, config),
                axios.get(`${API_URL}/test-series`, config),
                axios.get(`${API_URL}/test-series-enrollments`, config).catch(() => ({ data: [] })),
                axios.get(`${API_URL}/test-series-enrollments/stats`, config).catch(() => ({ data: { pending: 0, approved: 0, rejected: 0, totalRevenue: 0 } })),
                axios.get(`${API_URL}/tests`, config).catch(() => ({ data: [] }))
            ]);

            setUsers(usersRes.data);
            setEnrollments(enrollmentsRes.data);
            setBanners(bannersRes.data);
            setStats(statsRes.data);
            setTestSeries(testSeriesRes.data);
            setTestSeriesEnrollments(tsEnrollRes.data);
            setTsEnrollStats(tsEnrollStatsRes.data);
            setTests(testsRes.data);
            // Filter mentors from users
            setMentors(usersRes.data.filter(u => u.role === 'mentor'));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setLoading(false);
    };

    // Banner Management
    const handleBannerUpload = async (courseType, file) => {
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        formData.append('courseType', courseType);
        formData.append('isActive', 'true');

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'multipart/form-data'
                }
            };
            await axios.post(`${API_URL}/banners`, formData, config);
            setMessage({ type: 'success', text: `${courseType} banner updated successfully! Refresh the home page to see changes.` });
            fetchData();
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update banner' });
        }
    };

    // Enrollment Management
    const updateEnrollmentStatus = async (id, status) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`${API_URL}/enrollments/${id}`, { status }, config);
            setMessage({ type: 'success', text: 'Enrollment status updated!' });
            fetchData();
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update enrollment' });
        }
    };

    const completeEnrollment = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`${API_URL}/enrollments/${id}/complete`, {}, config);
            setMessage({ type: 'success', text: 'Batch marked as completed!' });
            fetchData();
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to complete batch' });
        }
    };

    const deleteEnrollment = async (id) => {
        if (!window.confirm('Are you sure you want to delete this enrollment?')) return;

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`${API_URL}/enrollments/${id}`, config);
            setMessage({ type: 'success', text: 'Enrollment deleted!' });
            fetchData();
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to delete enrollment' });
        }
    };

    const deleteCompletedEnrollments = async () => {
        if (!window.confirm('Delete all completed/inactive enrollments?')) return;

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await axios.delete(`${API_URL}/enrollments/cleanup/completed`, config);
            setMessage({ type: 'success', text: res.data.message });
            fetchData();
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to cleanup enrollments' });
        }
    };

    const deleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`${API_URL}/admin/users/${id}`, config);
            setMessage({ type: 'success', text: 'User deleted!' });
            fetchData();
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to delete user' });
        }
    };

    // Test Series Management
    const handleTestSeriesSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            if (editingTestSeries) {
                await axios.put(`${API_URL}/test-series/${editingTestSeries._id}`, testSeriesForm, config);
                setMessage({ type: 'success', text: 'Test series updated!' });
            } else {
                await axios.post(`${API_URL}/test-series`, testSeriesForm, config);
                setMessage({ type: 'success', text: 'Test series created!' });
            }
            setShowTestSeriesForm(false);
            setEditingTestSeries(null);
            setTestSeriesForm({ title: '', description: '', price: '', duration: '', category: 'CA Foundation', level: 'Beginner', totalTests: 10, features: '' });
            fetchData();
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save test series' });
        }
    };

    const editTestSeries = (ts) => {
        setEditingTestSeries(ts);
        setTestSeriesForm({
            title: ts.title || '',
            description: ts.description || '',
            price: ts.price || '',
            duration: ts.duration || '',
            category: ts.category || 'CA Foundation',
            level: ts.level || 'Beginner',
            totalTests: ts.totalTests || 10,
            features: ts.features ? ts.features.join(', ') : ''
        });
        setShowTestSeriesForm(true);
    };

    const deleteTestSeries = async (id) => {
        if (!window.confirm('Are you sure you want to delete this test series?')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`${API_URL}/test-series/${id}`, config);
            setMessage({ type: 'success', text: 'Test series deleted!' });
            fetchData();
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to delete test series' });
        }
    };

    // Test Series Enrollment Management
    const approveEnrollment = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`${API_URL}/test-series-enrollments/${id}/approve`, {}, config);
            setMessage({ type: 'success', text: 'Enrollment approved!' });
            fetchData();
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to approve enrollment' });
        }
    };

    const rejectEnrollment = async (id) => {
        const notes = prompt('Enter rejection reason (optional):');
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`${API_URL}/test-series-enrollments/${id}/reject`, { notes }, config);
            setMessage({ type: 'success', text: 'Enrollment rejected' });
            fetchData();
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to reject enrollment' });
        }
    };

    const deleteEnrollmentRequest = async (id) => {
        if (!window.confirm('Are you sure you want to delete this enrollment?')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`${API_URL}/test-series-enrollments/${id}`, config);
            setMessage({ type: 'success', text: 'Enrollment deleted!' });
            fetchData();
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to delete enrollment' });
        }
    };

    const getDefaultBanner = (courseType) => {
        const existing = banners.find(b => b.courseType === courseType);
        if (existing) return existing.imageUrl;

        switch (courseType) {
            case 'CA Foundation': return '/images/arambh-foundation.png';
            case 'CA Inter': return '/images/arambh-inter.png';
            case 'CA Final': return '/images/arambh-final.jpg';
            default: return '/images/placeholder.jpg';
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
            <div className="container-fluid py-4">
                {/* Header */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="card border-0 shadow-sm" style={{ borderRadius: '15px', background: 'linear-gradient(135deg, #151370, #312e81)' }}>
                            <div className="card-body p-4 text-white">
                                <h2 className="mb-1">Admin Dashboard</h2>
                                <p className="mb-0 opacity-75">Welcome back, {user.name}!</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Message Alert */}
                {message.text && (
                    <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`}>
                        {message.text}
                        <button type="button" className="btn-close" onClick={() => setMessage({ type: '', text: '' })}></button>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="row g-4 mb-4">
                    <div className="col-lg-3 col-md-6">
                        <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className="text-muted small text-uppercase">Total Users</h6>
                                        <h2 className="mb-0 text-primary">{users.length}</h2>
                                    </div>
                                    <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                                        <i className="fa fa-users text-primary fa-lg"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className="text-muted small text-uppercase">Total Enrollments</h6>
                                        <h2 className="mb-0 text-success">{stats.total}</h2>
                                    </div>
                                    <div className="bg-success bg-opacity-10 p-3 rounded-circle">
                                        <i className="fa fa-user-graduate text-success fa-lg"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className="text-muted small text-uppercase">Pending</h6>
                                        <h2 className="mb-0 text-warning">{stats.pending}</h2>
                                    </div>
                                    <div className="bg-warning bg-opacity-10 p-3 rounded-circle">
                                        <i className="fa fa-clock text-warning fa-lg"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className="text-muted small text-uppercase">Test Series</h6>
                                        <h2 className="mb-0 text-info">{testSeries.length}</h2>
                                    </div>
                                    <div className="bg-info bg-opacity-10 p-3 rounded-circle">
                                        <i className="fa fa-file-alt text-info fa-lg"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <ul className="nav nav-pills mb-4 bg-white p-2 shadow-sm flex-wrap" style={{ borderRadius: '10px' }}>
                    <li className="nav-item">
                        <button className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
                            <i className="fa fa-chart-bar me-2"></i>Overview
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className={`nav-link ${activeTab === 'enrollments' ? 'active' : ''}`} onClick={() => setActiveTab('enrollments')}>
                            <i className="fa fa-user-graduate me-2"></i>Enrollments
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className={`nav-link ${activeTab === 'banners' ? 'active' : ''}`} onClick={() => setActiveTab('banners')}>
                            <i className="fa fa-image me-2"></i>Banners
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className={`nav-link ${activeTab === 'testseries' ? 'active' : ''}`} onClick={() => setActiveTab('testseries')}>
                            <i className="fa fa-file-alt me-2"></i>Test Series
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className={`nav-link ${activeTab === 'tsenrollments' ? 'active' : ''}`} onClick={() => setActiveTab('tsenrollments')}>
                            <i className="fa fa-receipt me-2"></i>TS Enrollments
                            {tsEnrollStats.pending > 0 && (
                                <span className="badge bg-danger ms-2">{tsEnrollStats.pending}</span>
                            )}
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className={`nav-link ${activeTab === 'tests' ? 'active' : ''}`} onClick={() => setActiveTab('tests')}>
                            <i className="fa fa-clipboard-list me-2"></i>Tests
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className={`nav-link ${activeTab === 'mentors' ? 'active' : ''}`} onClick={() => setActiveTab('mentors')}>
                            <i className="fa fa-chalkboard-teacher me-2"></i>Mentors
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className={`nav-link ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
                            <i className="fa fa-users me-2"></i>Users
                        </button>
                    </li>
                </ul>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="row g-4">
                        <div className="col-lg-8">
                            <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center" style={{ borderRadius: '15px 15px 0 0' }}>
                                    <h5 className="mb-0"><i className="fa fa-list me-2 text-primary"></i>Recent Enrollments</h5>
                                </div>
                                <div className="card-body p-0">
                                    <div className="table-responsive">
                                        <table className="table table-hover mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Course</th>
                                                    <th>Mobile</th>
                                                    <th>Status</th>
                                                    <th>Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {enrollments.length === 0 ? (
                                                    <tr><td colSpan="5" className="text-center py-4 text-muted">No enrollments yet</td></tr>
                                                ) : (
                                                    enrollments.slice(0, 5).map((enrollment) => (
                                                        <tr key={enrollment._id}>
                                                            <td><strong>{enrollment.name}</strong><br /><small className="text-muted">{enrollment.email}</small></td>
                                                            <td><span className="badge bg-primary">{enrollment.course}</span></td>
                                                            <td>{enrollment.mobile}</td>
                                                            <td>
                                                                <span className={`badge ${enrollment.status === 'pending' ? 'bg-warning' : enrollment.status === 'confirmed' ? 'bg-success' : 'bg-secondary'}`}>
                                                                    {enrollment.status}
                                                                </span>
                                                            </td>
                                                            <td>{new Date(enrollment.enrolledAt).toLocaleDateString()}</td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                                <div className="card-header bg-white py-3" style={{ borderRadius: '15px 15px 0 0' }}>
                                    <h5 className="mb-0"><i className="fa fa-chart-pie me-2 text-success"></i>Course Distribution</h5>
                                </div>
                                <div className="card-body">
                                    {stats.courseWise?.length > 0 ? stats.courseWise.map((course, index) => (
                                        <div key={index} className="d-flex justify-content-between align-items-center mb-3">
                                            <span>{course._id}</span>
                                            <span className="badge bg-primary">{course.count}</span>
                                        </div>
                                    )) : <p className="text-muted text-center">No data yet</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Enrollments Tab */}
                {activeTab === 'enrollments' && (
                    <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center" style={{ borderRadius: '15px 15px 0 0' }}>
                            <h5 className="mb-0"><i className="fa fa-user-graduate me-2 text-primary"></i>All Enrollments</h5>
                            <button className="btn btn-sm btn-outline-danger" onClick={deleteCompletedEnrollments}>
                                <i className="fa fa-trash me-1"></i>Delete Completed
                            </button>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Mobile</th>
                                            <th>Course</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {enrollments.length === 0 ? (
                                            <tr><td colSpan="7" className="text-center py-4 text-muted">No enrollments yet</td></tr>
                                        ) : (
                                            enrollments.map((enrollment) => (
                                                <tr key={enrollment._id}>
                                                    <td><strong>{enrollment.name}</strong></td>
                                                    <td>{enrollment.email}</td>
                                                    <td><a href={`tel:${enrollment.mobile}`}>{enrollment.mobile}</a></td>
                                                    <td><span className="badge bg-primary">{enrollment.course}</span></td>
                                                    <td>
                                                        <select
                                                            className="form-select form-select-sm"
                                                            value={enrollment.status}
                                                            onChange={(e) => updateEnrollmentStatus(enrollment._id, e.target.value)}
                                                            style={{ width: '120px' }}
                                                        >
                                                            <option value="pending">Pending</option>
                                                            <option value="confirmed">Confirmed</option>
                                                            <option value="completed">Completed</option>
                                                            <option value="cancelled">Cancelled</option>
                                                        </select>
                                                    </td>
                                                    <td>{new Date(enrollment.enrolledAt).toLocaleDateString()}</td>
                                                    <td>
                                                        <div className="btn-group btn-group-sm">
                                                            <button className="btn btn-success" title="Complete Batch" onClick={() => completeEnrollment(enrollment._id)}>
                                                                <i className="fa fa-check"></i>
                                                            </button>
                                                            <button className="btn btn-danger" title="Delete" onClick={() => deleteEnrollment(enrollment._id)}>
                                                                <i className="fa fa-trash"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Banners Tab */}
                {activeTab === 'banners' && (
                    <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                        <div className="card-header bg-white py-3" style={{ borderRadius: '15px 15px 0 0' }}>
                            <h5 className="mb-0"><i className="fa fa-image me-2 text-primary"></i>Manage Carousel Banners</h5>
                            <small className="text-muted">Update images for home page carousel and course pages</small>
                        </div>
                        <div className="card-body">
                            <div className="row g-4">
                                {['CA Foundation', 'CA Inter', 'CA Final'].map((course) => (
                                    <div key={course} className="col-lg-4">
                                        <div className="card border" style={{ borderRadius: '15px' }}>
                                            <div className="position-relative">
                                                <img
                                                    src={getDefaultBanner(course)}
                                                    alt={course}
                                                    className="card-img-top"
                                                    style={{ height: '200px', objectFit: 'cover', borderRadius: '15px 15px 0 0' }}
                                                />
                                                <div className="position-absolute top-0 end-0 m-2">
                                                    <span className="badge bg-primary">{course}</span>
                                                </div>
                                            </div>
                                            <div className="card-body text-center">
                                                <h5 className="card-title">{course}</h5>
                                                <input
                                                    type="file"
                                                    className="d-none"
                                                    ref={el => fileInputRefs.current[course] = el}
                                                    accept="image/*"
                                                    onChange={(e) => handleBannerUpload(course, e.target.files[0])}
                                                />
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => fileInputRefs.current[course]?.click()}
                                                >
                                                    <i className="fa fa-upload me-2"></i>Update Image
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="alert alert-info mt-4">
                                <i className="fa fa-info-circle me-2"></i>
                                <strong>Note:</strong> Updated images will appear on the home page carousel and the respective course pages. Refresh the home page to see changes.
                            </div>
                        </div>
                    </div>
                )}

                {/* Test Series Tab */}
                {activeTab === 'testseries' && (
                    <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center" style={{ borderRadius: '15px 15px 0 0' }}>
                            <h5 className="mb-0"><i className="fa fa-file-alt me-2 text-primary"></i>Test Series Management</h5>
                            <button className="btn btn-primary btn-sm" onClick={() => { setShowTestSeriesForm(true); setEditingTestSeries(null); setTestSeriesForm({ title: '', description: '', price: '', duration: '', category: 'CA Foundation', level: 'Beginner', totalTests: 10, features: '' }); }}>
                                <i className="fa fa-plus me-1"></i>Add New
                            </button>
                        </div>
                        <div className="card-body">
                            {/* Test Series Form Modal */}
                            {showTestSeriesForm && (
                                <div className="card border mb-4" style={{ borderRadius: '15px' }}>
                                    <div className="card-body">
                                        <h6 className="mb-3">{editingTestSeries ? 'Edit' : 'Add'} Test Series</h6>
                                        <form onSubmit={handleTestSeriesSubmit}>
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <label className="form-label">Title *</label>
                                                    <input type="text" className="form-control" placeholder="e.g. Complete Foundation Pack" value={testSeriesForm.title} onChange={(e) => setTestSeriesForm({ ...testSeriesForm, title: e.target.value })} required />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">Category *</label>
                                                    <select className="form-select" value={testSeriesForm.category} onChange={(e) => setTestSeriesForm({ ...testSeriesForm, category: e.target.value })}>
                                                        <option value="CA Foundation">CA Foundation</option>
                                                        <option value="CA Inter">CA Inter</option>
                                                        <option value="CA Final">CA Final</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="form-label">Price (â‚¹) *</label>
                                                    <input type="number" className="form-control" value={testSeriesForm.price} onChange={(e) => setTestSeriesForm({ ...testSeriesForm, price: e.target.value })} required />
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="form-label">Duration *</label>
                                                    <input type="text" className="form-control" placeholder="e.g., 3 months" value={testSeriesForm.duration} onChange={(e) => setTestSeriesForm({ ...testSeriesForm, duration: e.target.value })} required />
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="form-label">Level</label>
                                                    <select className="form-select" value={testSeriesForm.level} onChange={(e) => setTestSeriesForm({ ...testSeriesForm, level: e.target.value })}>
                                                        <option value="Beginner">Beginner</option>
                                                        <option value="Intermediate">Intermediate</option>
                                                        <option value="Advanced">Advanced</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">Total Tests</label>
                                                    <input type="number" className="form-control" value={testSeriesForm.totalTests} onChange={(e) => setTestSeriesForm({ ...testSeriesForm, totalTests: e.target.value })} />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">Features (comma separated)</label>
                                                    <input type="text" className="form-control" placeholder="Feature 1, Feature 2, Feature 3" value={testSeriesForm.features} onChange={(e) => setTestSeriesForm({ ...testSeriesForm, features: e.target.value })} />
                                                </div>
                                                <div className="col-12">
                                                    <label className="form-label">Description *</label>
                                                    <textarea className="form-control" rows="2" value={testSeriesForm.description} onChange={(e) => setTestSeriesForm({ ...testSeriesForm, description: e.target.value })} required></textarea>
                                                </div>
                                                <div className="col-12">
                                                    <button type="submit" className="btn btn-primary me-2">
                                                        <i className="fa fa-save me-1"></i>{editingTestSeries ? 'Update' : 'Create'}
                                                    </button>
                                                    <button type="button" className="btn btn-secondary" onClick={() => setShowTestSeriesForm(false)}>Cancel</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {/* Test Series List */}
                            <div className="row g-4">
                                {testSeries.length === 0 ? (
                                    <div className="col-12 text-center py-4 text-muted">
                                        <i className="fa fa-file-alt fa-3x mb-3"></i>
                                        <p>No test series found. Create one to get started.</p>
                                    </div>
                                ) : (
                                    testSeries.map((ts) => (
                                        <div key={ts._id} className="col-lg-4 col-md-6">
                                            <div className="card h-100 border" style={{ borderRadius: '15px' }}>
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                                        <span className="badge bg-primary me-2">{ts.category}</span>
                                                        <span className={`badge ${ts.level === 'Beginner' ? 'bg-success' : ts.level === 'Intermediate' ? 'bg-warning text-dark' : 'bg-danger'}`}>
                                                            {ts.level}
                                                        </span>
                                                    </div>
                                                    <h5 className="card-title">{ts.title}</h5>
                                                    <h5 className="text-primary">â‚¹{ts.price}</h5>
                                                    <p className="card-text text-muted small">{ts.description}</p>
                                                    <p className="mb-2"><i className="fa fa-clock me-1 text-muted"></i>{ts.duration}</p>
                                                    <p className="mb-3"><i className="fa fa-file-alt me-1 text-muted"></i>{ts.totalTests || 0} Tests</p>
                                                    <div className="d-flex gap-2">
                                                        <button className="btn btn-sm btn-outline-primary" onClick={() => editTestSeries(ts)}>
                                                            <i className="fa fa-edit me-1"></i>Edit
                                                        </button>
                                                        <button className="btn btn-sm btn-outline-danger" onClick={() => deleteTestSeries(ts._id)}>
                                                            <i className="fa fa-trash me-1"></i>Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                        <div className="card-header bg-white py-3" style={{ borderRadius: '15px 15px 0 0' }}>
                            <h5 className="mb-0"><i className="fa fa-users me-2 text-primary"></i>All Users</h5>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Mobile</th>
                                            <th>Role</th>
                                            <th>Joined</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((u) => (
                                            <tr key={u._id}>
                                                <td><strong>{u.name}</strong></td>
                                                <td>{u.email}</td>
                                                <td><a href={`tel:${u.mobile}`}>{u.mobile}</a></td>
                                                <td>
                                                    <span className={`badge ${u.isAdmin ? 'bg-warning text-dark' : 'bg-primary'}`}>
                                                        {u.isAdmin ? 'Admin' : 'User'}
                                                    </span>
                                                </td>
                                                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                                <td>
                                                    {!u.isAdmin && (
                                                        <button className="btn btn-sm btn-danger" onClick={() => deleteUser(u._id)}>
                                                            <i className="fa fa-trash"></i>
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Test Series Enrollments Tab */}
                {activeTab === 'tsenrollments' && (
                    <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                        <div className="card-header bg-white py-3" style={{ borderRadius: '15px 15px 0 0' }}>
                            <h5 className="mb-0"><i className="fa fa-receipt me-2 text-primary"></i>Test Series Enrollments</h5>
                        </div>
                        <div className="card-body">
                            {/* Stats Cards */}
                            <div className="row g-3 mb-4">
                                <div className="col-md-3">
                                    <div className="bg-warning bg-opacity-10 p-3 rounded-3 text-center">
                                        <h4 className="text-warning mb-0">{tsEnrollStats.pending}</h4>
                                        <small className="text-muted">Pending</small>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="bg-success bg-opacity-10 p-3 rounded-3 text-center">
                                        <h4 className="text-success mb-0">{tsEnrollStats.approved}</h4>
                                        <small className="text-muted">Approved</small>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="bg-danger bg-opacity-10 p-3 rounded-3 text-center">
                                        <h4 className="text-danger mb-0">{tsEnrollStats.rejected}</h4>
                                        <small className="text-muted">Rejected</small>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="bg-primary bg-opacity-10 p-3 rounded-3 text-center">
                                        <h4 className="text-primary mb-0">â‚¹{tsEnrollStats.totalRevenue}</h4>
                                        <small className="text-muted">Revenue</small>
                                    </div>
                                </div>
                            </div>

                            {/* Enrollment Cards */}
                            {testSeriesEnrollments.length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    <i className="fa fa-inbox fa-3x mb-3"></i>
                                    <p>No test series enrollments yet</p>
                                </div>
                            ) : (
                                <div className="row g-3">
                                    {testSeriesEnrollments.map((enroll) => (
                                        <div key={enroll._id} className="col-lg-6">
                                            <div className={`card h-100 border-${enroll.status === 'pending' ? 'warning' : enroll.status === 'approved' ? 'success' : 'danger'}`} style={{ borderRadius: '12px', borderWidth: '2px' }}>
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                                        <div>
                                                            <span className={`badge ${enroll.status === 'pending' ? 'bg-warning text-dark' : enroll.status === 'approved' ? 'bg-success' : 'bg-danger'}`}>
                                                                {enroll.status.toUpperCase()}
                                                            </span>
                                                            <span className="badge bg-primary ms-2">{enroll.testSeriesCategory}</span>
                                                        </div>
                                                        <h5 className="text-primary mb-0">â‚¹{enroll.amount}</h5>
                                                    </div>

                                                    <h6 className="mb-2">{enroll.testSeriesTitle}</h6>

                                                    <div className="mb-3 p-2 bg-light rounded">
                                                        <p className="mb-1"><i className="fa fa-user me-2 text-muted"></i><strong>{enroll.studentName}</strong></p>
                                                        <p className="mb-1 small"><i className="fa fa-envelope me-2 text-muted"></i>{enroll.studentEmail}</p>
                                                        <p className="mb-0 small"><i className="fa fa-phone me-2 text-muted"></i>{enroll.studentMobile}</p>
                                                    </div>

                                                    {enroll.utrNumber && (
                                                        <p className="small mb-2"><strong>UTR:</strong> {enroll.utrNumber}</p>
                                                    )}

                                                    {enroll.paymentProof && (
                                                        <div className="mb-3">
                                                            <p className="small mb-1"><strong>Payment Proof:</strong></p>
                                                            <a href={`http://localhost:5000${enroll.paymentProof}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm">
                                                                <i className="fa fa-image me-1"></i>View Screenshot
                                                            </a>
                                                        </div>
                                                    )}

                                                    <p className="text-muted small mb-2">
                                                        <i className="fa fa-calendar me-1"></i>
                                                        Submitted: {new Date(enroll.createdAt).toLocaleString()}
                                                    </p>

                                                    {enroll.status === 'approved' && enroll.accessEndDate && (
                                                        <p className="text-success small mb-2">
                                                            <i className="fa fa-check-circle me-1"></i>
                                                            Access until: {new Date(enroll.accessEndDate).toLocaleDateString()}
                                                        </p>
                                                    )}

                                                    <div className="d-flex gap-2 mt-3">
                                                        {enroll.status === 'pending' && (
                                                            <>
                                                                <button className="btn btn-success btn-sm" onClick={() => approveEnrollment(enroll._id)}>
                                                                    <i className="fa fa-check me-1"></i>Approve
                                                                </button>
                                                                <button className="btn btn-danger btn-sm" onClick={() => rejectEnrollment(enroll._id)}>
                                                                    <i className="fa fa-times me-1"></i>Reject
                                                                </button>
                                                            </>
                                                        )}
                                                        <button className="btn btn-outline-danger btn-sm" onClick={() => deleteEnrollmentRequest(enroll._id)}>
                                                            <i className="fa fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Tests (Exams) Tab */}
                {activeTab === 'tests' && (
                    <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center" style={{ borderRadius: '15px 15px 0 0' }}>
                            <h5 className="mb-0"><i className="fa fa-clipboard-list me-2 text-primary"></i>Manage Tests</h5>
                            <button className="btn btn-primary btn-sm" onClick={() => { setShowTestForm(true); setEditingTest(null); }}>
                                <i className="fa fa-plus me-1"></i>Add Test
                            </button>
                        </div>
                        <div className="card-body">
                            {showTestForm && (
                                <div className="bg-light rounded-3 p-4 mb-4">
                                    <h6 className="mb-3">{editingTest ? 'Edit Test' : 'Create New Test'}</h6>
                                    <form onSubmit={async (e) => {
                                        e.preventDefault();
                                        try {
                                            const config = { headers: { Authorization: `Bearer ${user.token}` } };
                                            const data = { ...testForm };
                                            if (editingTest) {
                                                await axios.put(`${API_URL}/tests/${editingTest._id}`, data, config);
                                                setMessage({ type: 'success', text: 'Test updated!' });
                                            } else {
                                                await axios.post(`${API_URL}/tests`, data, config);
                                                setMessage({ type: 'success', text: 'Test created!' });
                                            }
                                            setShowTestForm(false);
                                            setEditingTest(null);
                                            setTestForm({ title: '', testSeriesId: '', duration: 60, totalMarks: 100, passingMarks: 40, negativeMarking: 0, instructions: '', resultReleaseDate: '', isActive: true });
                                            fetchData();
                                        } catch (error) {
                                            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to save test' });
                                        }
                                    }}>
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <label className="form-label small">Test Title *</label>
                                                <input type="text" className="form-control" value={testForm.title} onChange={(e) => setTestForm({ ...testForm, title: e.target.value })} required />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label small">Test Series *</label>
                                                <select className="form-select" value={testForm.testSeriesId} onChange={(e) => setTestForm({ ...testForm, testSeriesId: e.target.value })} required>
                                                    <option value="">Select Test Series</option>
                                                    {testSeries.map(ts => (<option key={ts._id} value={ts._id}>{ts.title}</option>))}
                                                </select>
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label small">Duration (min)</label>
                                                <input type="number" className="form-control" value={testForm.duration} onChange={(e) => setTestForm({ ...testForm, duration: parseInt(e.target.value) })} />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label small">Total Marks</label>
                                                <input type="number" className="form-control" value={testForm.totalMarks} onChange={(e) => setTestForm({ ...testForm, totalMarks: parseInt(e.target.value) })} />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label small">Passing Marks</label>
                                                <input type="number" className="form-control" value={testForm.passingMarks} onChange={(e) => setTestForm({ ...testForm, passingMarks: parseInt(e.target.value) })} />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label small">Negative Marking</label>
                                                <input type="number" step="0.25" className="form-control" value={testForm.negativeMarking} onChange={(e) => setTestForm({ ...testForm, negativeMarking: parseFloat(e.target.value) })} />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label small">Result Release Date</label>
                                                <input type="datetime-local" className="form-control" value={testForm.resultReleaseDate} onChange={(e) => setTestForm({ ...testForm, resultReleaseDate: e.target.value })} />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label small">Status</label>
                                                <select className="form-select" value={testForm.isActive} onChange={(e) => setTestForm({ ...testForm, isActive: e.target.value === 'true' })}>
                                                    <option value="true">Active</option>
                                                    <option value="false">Inactive</option>
                                                </select>
                                            </div>
                                            <div className="col-12">
                                                <label className="form-label small">Instructions</label>
                                                <textarea className="form-control" rows="3" value={testForm.instructions} onChange={(e) => setTestForm({ ...testForm, instructions: e.target.value })} placeholder="Enter exam instructions..."></textarea>
                                            </div>
                                        </div>
                                        <div className="d-flex gap-2 mt-3">
                                            <button type="submit" className="btn btn-dark">{editingTest ? 'Update' : 'Create'} Test</button>
                                            <button type="button" className="btn btn-outline-secondary" onClick={() => { setShowTestForm(false); setEditingTest(null); }}>Cancel</button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {tests.length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    <i className="fa fa-clipboard-list fa-3x mb-3"></i>
                                    <p>No tests created yet</p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Title</th>
                                                <th>Series</th>
                                                <th>Duration</th>
                                                <th>Marks</th>
                                                <th>Status</th>

                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tests.map(test => (
                                                <tr key={test._id}>
                                                    <td className="fw-medium">{test.title}</td>
                                                    <td>{testSeries.find(ts => ts._id === test.testSeriesId)?.title || '-'}</td>
                                                    <td>{test.duration} min</td>
                                                    <td>{test.totalMarks}</td>
                                                    <td><span className={`badge ${test.isActive ? 'bg-success' : 'bg-secondary'}`}>{test.isActive ? 'Active' : 'Inactive'}</span></td>

                                                    <td>
                                                        <button className="btn btn-sm btn-outline-primary me-1" onClick={() => {
                                                            setEditingTest(test);
                                                            setTestForm({
                                                                title: test.title,
                                                                testSeriesId: test.testSeriesId,
                                                                duration: test.duration,
                                                                totalMarks: test.totalMarks,
                                                                passingMarks: test.passingMarks,
                                                                negativeMarking: test.negativeMarking,
                                                                instructions: test.instructions || '',
                                                                resultReleaseDate: test.resultReleaseDate ? new Date(test.resultReleaseDate).toISOString().slice(0, 16) : '',
                                                                isActive: test.isActive
                                                            });
                                                            setShowTestForm(true);
                                                        }}><i className="fa fa-edit"></i></button>
                                                        <button className="btn btn-sm btn-outline-danger" onClick={async () => {
                                                            if (!window.confirm('Delete this test and all its questions?')) return;
                                                            try {
                                                                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                                                                await axios.delete(`${API_URL}/tests/${test._id}`, config);
                                                                setMessage({ type: 'success', text: 'Test deleted!' });
                                                                fetchData();
                                                            } catch (error) {
                                                                setMessage({ type: 'error', text: 'Failed to delete test' });
                                                            }
                                                        }}><i className="fa fa-trash"></i></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Mentors Tab */}
                {activeTab === 'mentors' && (
                    <div className="row g-4">
                        <div className="col-lg-6">
                            <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                                <div className="card-header bg-white py-3" style={{ borderRadius: '15px 15px 0 0' }}>
                                    <h5 className="mb-0"><i className="fa fa-chalkboard-teacher me-2 text-primary"></i>Current Mentors ({mentors.length})</h5>
                                </div>
                                <div className="card-body">
                                    {mentors.length === 0 ? (
                                        <div className="text-center py-4 text-muted">
                                            <i className="fa fa-user-tie fa-2x mb-2"></i>
                                            <p className="mb-0">No mentors assigned yet</p>
                                        </div>
                                    ) : (
                                        <div className="list-group list-group-flush">
                                            {mentors.map(mentor => (
                                                <div key={mentor._id} className="list-group-item d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <p className="mb-0 fw-medium">{mentor.name}</p>
                                                        <small className="text-muted">{mentor.email}</small>
                                                        <div className="mt-1">
                                                            {mentor.assignedTestSeries?.length > 0 ? (
                                                                mentor.assignedTestSeries.map((tsId, i) => {
                                                                    const ts = testSeries.find(t => t._id === tsId);
                                                                    return ts ? <span key={i} className="badge bg-info me-1">{ts.title}</span> : null;
                                                                })
                                                            ) : (
                                                                <small className="text-muted">No series assigned</small>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <button className="btn btn-sm btn-outline-danger" onClick={async () => {
                                                        if (!window.confirm('Remove mentor role from this user?')) return;
                                                        try {
                                                            const config = { headers: { Authorization: `Bearer ${user.token}` } };
                                                            await axios.put(`${API_URL}/admin/users/${mentor._id}`, { role: 'student', assignedTestSeries: [] }, config);
                                                            setMessage({ type: 'success', text: 'Mentor role removed!' });
                                                            fetchData();
                                                        } catch (error) {
                                                            setMessage({ type: 'error', text: 'Failed to update user' });
                                                        }
                                                    }}><i className="fa fa-user-minus"></i></button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                                <div className="card-header bg-white py-3" style={{ borderRadius: '15px 15px 0 0' }}>
                                    <h5 className="mb-0"><i className="fa fa-user-plus me-2 text-success"></i>Assign Mentor Role</h5>
                                </div>
                                <div className="card-body">
                                    <p className="text-muted small mb-3">Select a user to assign as mentor and choose which test series they can manage.</p>
                                    <form onSubmit={async (e) => {
                                        e.preventDefault();
                                        const formEl = e.target;
                                        const userId = formEl.userId.value;
                                        const selectedSeries = Array.from(formEl.querySelectorAll('input[name="series"]:checked')).map(cb => cb.value);
                                        if (!userId) { alert('Please select a user'); return; }
                                        try {
                                            const config = { headers: { Authorization: `Bearer ${user.token}` } };
                                            await axios.put(`${API_URL}/admin/users/${userId}`, { role: 'mentor', assignedTestSeries: selectedSeries }, config);
                                            setMessage({ type: 'success', text: 'Mentor assigned successfully!' });
                                            fetchData();
                                            formEl.reset();
                                        } catch (error) {
                                            setMessage({ type: 'error', text: 'Failed to assign mentor' });
                                        }
                                    }}>
                                        <div className="mb-3">
                                            <label className="form-label small">Select User</label>
                                            <select name="userId" className="form-select">
                                                <option value="">Choose a user...</option>
                                                {users.filter(u => u.role !== 'mentor' && !u.isAdmin).map(u => (
                                                    <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label small">Assign Test Series</label>
                                            <div className="border rounded p-2" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                                {testSeries.map(ts => (
                                                    <div key={ts._id} className="form-check">
                                                        <input className="form-check-input" type="checkbox" name="series" value={ts._id} id={`ts-${ts._id}`} />
                                                        <label className="form-check-label small" htmlFor={`ts-${ts._id}`}>{ts.title}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <button type="submit" className="btn btn-success"><i className="fa fa-check me-1"></i>Assign as Mentor</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;

