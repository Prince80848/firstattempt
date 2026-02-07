import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({ name: '', email: '', mobile: '' });
    const [profilePic, setProfilePic] = useState(null);
    const [previewPic, setPreviewPic] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [editMode, setEditMode] = useState(false);
    const [myEnrollments, setMyEnrollments] = useState([]);
    const [enrollmentsLoading, setEnrollmentsLoading] = useState(true);

    const API_URL = 'http://localhost:5000/api';

    useEffect(() => {
        if (user) {
            setFormData({ name: user.name || '', email: user.email || '', mobile: user.mobile || '' });
            setPreviewPic(user.profilePic || null);
            fetchMyEnrollments();
        }
    }, [user]);

    const fetchMyEnrollments = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const response = await axios.get(`${API_URL}/test-series-enrollments/my`, config);
            setMyEnrollments(response.data);
        } catch (error) {
            console.error('Error fetching enrollments:', error);
        }
        setEnrollmentsLoading(false);
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setMessage({ type: 'error', text: 'Image size should be less than 5MB' });
                return;
            }
            setProfilePic(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewPic(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('mobile', formData.mobile);
            if (profilePic) formDataToSend.append('profilePic', profilePic);

            const response = await axios.put(`${API_URL}/auth/profile`, formDataToSend, {
                headers: { Authorization: `Bearer ${user.token}`, 'Content-Type': 'multipart/form-data' }
            });

            const updatedUser = { ...user, ...response.data };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setMessage({ type: 'success', text: 'Profile updated!' });
            setProfilePic(null);
            setEditMode(false);
            setTimeout(() => window.location.reload(), 1000);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Update failed' });
        }
        setLoading(false);
    };

    if (!user) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center bg-white">
                <div className="text-center">
                    <i className="fa fa-user-circle fa-4x text-muted mb-3"></i>
                    <h5>Please login to continue</h5>
                    <Link to="/login" className="btn btn-dark mt-3 px-4">Login</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-vh-100 bg-white">
            <div className="container-fluid p-0">
                <div className="row g-0">
                    {/* Sidebar - Hidden on mobile */}
                    <div className="col-lg-3 col-md-4 d-none d-md-block" style={{ borderRight: '1px solid #e5e5e5', minHeight: '100vh', background: '#fafafa' }}>
                        <div className="p-4">
                            {/* Avatar & Name */}
                            <div className="text-center mb-4 pt-3">
                                <div className="position-relative d-inline-block">
                                    <div
                                        className="rounded-circle d-flex align-items-center justify-content-center"
                                        style={{
                                            width: '90px',
                                            height: '90px',
                                            background: previewPic ? `url(${previewPic}) center/cover` : 'linear-gradient(135deg, #667eea, #764ba2)',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        {!previewPic && (
                                            <span style={{ color: '#fff', fontSize: '32px', fontWeight: '500' }}>
                                                {user.name?.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    {/* Camera Icon */}
                                    <div
                                        className="position-absolute d-flex align-items-center justify-content-center"
                                        style={{
                                            bottom: '0',
                                            right: '0',
                                            width: '28px',
                                            height: '28px',
                                            background: '#151370',
                                            borderRadius: '50%',
                                            border: '2px solid #fff',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <i className="fa fa-camera text-white" style={{ fontSize: '11px' }}></i>
                                    </div>
                                </div>
                                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" hidden />
                                <h5 className="mb-1 mt-3">{user.name}</h5>
                                <p className="text-muted small mb-0">{user.email}</p>
                                {user.isAdmin && (
                                    <span className="badge bg-warning text-dark mt-2" style={{ fontSize: '10px' }}>
                                        <i className="fa fa-crown me-1"></i>Admin
                                    </span>
                                )}
                            </div>

                            {/* Menu */}
                            <nav className="mt-4">
                                <Link to="/test-series" className="d-flex align-items-center text-decoration-none text-dark p-2 rounded mb-1">
                                    <i className="fa fa-search me-3 text-muted"></i>
                                    <span>Browse Courses</span>
                                </Link>
                                <Link to="/ca-foundation" className="d-flex align-items-center text-decoration-none text-dark p-2 rounded mb-1">
                                    <i className="fa fa-book me-3 text-muted"></i>
                                    <span>CA Foundation</span>
                                </Link>
                                <Link to="/ca-inter" className="d-flex align-items-center text-decoration-none text-dark p-2 rounded mb-1">
                                    <i className="fa fa-book-reader me-3 text-muted"></i>
                                    <span>CA Intermediate</span>
                                </Link>
                                <Link to="/ca-final" className="d-flex align-items-center text-decoration-none text-dark p-2 rounded mb-1">
                                    <i className="fa fa-graduation-cap me-3 text-muted"></i>
                                    <span>CA Final</span>
                                </Link>
                                {user.isAdmin && (
                                    <Link to="/dashboard" className="d-flex align-items-center text-decoration-none text-dark p-2 rounded mb-1" style={{ background: '#f0f0f0' }}>
                                        <i className="fa fa-cog me-3"></i>
                                        <span>Admin Panel</span>
                                    </Link>
                                )}
                            </nav>

                            {/* Logout */}
                            <button
                                className="btn btn-outline-secondary w-100 mt-4"
                                onClick={() => { logout(); navigate('/'); }}
                            >
                                <i className="fa fa-sign-out-alt me-2"></i>Logout
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-lg-9 col-md-8 col-12 p-4 p-lg-5">
                        {/* Mobile Header - Only visible on mobile */}
                        <div className="d-md-none mb-4">
                            <div className="d-flex align-items-center gap-3 mb-3">
                                <div className="position-relative">
                                    <div
                                        className="rounded-circle d-flex align-items-center justify-content-center"
                                        style={{
                                            width: '60px',
                                            height: '60px',
                                            background: previewPic ? `url(${previewPic}) center/cover` : 'linear-gradient(135deg, #667eea, #764ba2)',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        {!previewPic && (
                                            <span style={{ color: '#fff', fontSize: '24px', fontWeight: '500' }}>
                                                {user.name?.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <div
                                        className="position-absolute d-flex align-items-center justify-content-center"
                                        style={{ bottom: '-2px', right: '-2px', width: '22px', height: '22px', background: '#151370', borderRadius: '50%', border: '2px solid #fff', cursor: 'pointer' }}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <i className="fa fa-camera text-white" style={{ fontSize: '9px' }}></i>
                                    </div>
                                </div>
                                <div className="flex-grow-1">
                                    <h5 className="mb-0">{user.name}</h5>
                                    <p className="text-muted small mb-0">{user.email}</p>
                                </div>
                                <button className="btn btn-outline-danger btn-sm" onClick={() => { logout(); navigate('/'); }}>
                                    <i className="fa fa-sign-out-alt"></i>
                                </button>
                            </div>
                        </div>

                        <h4 className="mb-4 d-none d-md-block">My Account</h4>

                        {/* Message */}
                        {message.text && (
                            <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'} alert-dismissible`}>
                                {message.text}
                                <button type="button" className="btn-close" onClick={() => setMessage({ type: '', text: '' })}></button>
                            </div>
                        )}

                        {/* Profile Settings */}
                        <div className="mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6 className="text-muted mb-0 text-uppercase" style={{ fontSize: '12px', letterSpacing: '1px' }}>Profile Settings</h6>
                                {!editMode ? (
                                    <button className="btn btn-sm btn-outline-primary" onClick={() => setEditMode(true)}>
                                        <i className="fa fa-edit me-1"></i>Edit
                                    </button>
                                ) : (
                                    <button className="btn btn-sm btn-outline-secondary" onClick={() => setEditMode(false)}>
                                        <i className="fa fa-times me-1"></i>Cancel
                                    </button>
                                )}
                            </div>

                            {editMode ? (
                                <div className="bg-light rounded-3 p-4">
                                    <form onSubmit={handleUpdateProfile}>
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <label className="form-label small">Full Name</label>
                                                <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label small">Mobile Number</label>
                                                <input type="tel" className="form-control" name="mobile" value={formData.mobile} onChange={handleChange} pattern="[0-9]{10}" required />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label small">Email Address</label>
                                                <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                                            </div>
                                        </div>
                                        <button type="submit" className="btn btn-dark mt-3 px-4" disabled={loading}>
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <div className="bg-light rounded-3 p-3">
                                            <label className="form-label small text-muted mb-1">Full Name</label>
                                            <p className="mb-0 fw-medium">{user.name}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="bg-light rounded-3 p-3">
                                            <label className="form-label small text-muted mb-1">Mobile Number</label>
                                            <p className="mb-0 fw-medium">{user.mobile || 'Not provided'}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="bg-light rounded-3 p-3">
                                            <label className="form-label small text-muted mb-1">Email Address</label>
                                            <p className="mb-0 fw-medium">{user.email}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* My Courses */}
                        <div>
                            <h6 className="text-muted mb-3 text-uppercase" style={{ fontSize: '12px', letterSpacing: '1px' }}>My Courses</h6>

                            {enrollmentsLoading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border spinner-border-sm"></div>
                                </div>
                            ) : myEnrollments.length === 0 ? (
                                <div className="text-center py-5 bg-light rounded-3">
                                    <i className="fa fa-folder-open fa-2x text-muted mb-3"></i>
                                    <p className="text-muted mb-3">No courses enrolled yet</p>
                                    <Link to="/test-series" className="btn btn-dark btn-sm px-4">Browse Courses</Link>
                                </div>
                            ) : (
                                <div className="row g-3">
                                    {myEnrollments.map(enroll => (
                                        <div key={enroll._id} className="col-md-6">
                                            <div className="bg-light rounded-3 p-3 h-100">
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <span className={`badge ${enroll.status === 'approved' ? 'bg-success' : enroll.status === 'pending' ? 'bg-warning text-dark' : 'bg-danger'}`} style={{ fontSize: '10px' }}>
                                                        {enroll.status === 'approved' ? 'Active' : enroll.status === 'pending' ? 'Pending' : 'Rejected'}
                                                    </span>
                                                    <span className="fw-bold">₹{enroll.amount}</span>
                                                </div>
                                                <h6 className="mb-1">{enroll.testSeriesTitle}</h6>
                                                <p className="text-muted small mb-2">{enroll.testSeriesCategory}</p>
                                                <div className="d-flex flex-wrap gap-2 text-muted" style={{ fontSize: '11px' }}>
                                                    {enroll.testSeriesId?.duration && (
                                                        <span><i className="fa fa-clock me-1"></i>{enroll.testSeriesId.duration}</span>
                                                    )}
                                                    {enroll.testSeriesId?.totalTests && (
                                                        <span><i className="fa fa-file me-1"></i>{enroll.testSeriesId.totalTests} Tests</span>
                                                    )}
                                                </div>
                                                {enroll.status === 'approved' && enroll.accessEndDate && (
                                                    <p className="text-success small mt-2 mb-0">
                                                        <i className="fa fa-check-circle me-1"></i>
                                                        Valid until {new Date(enroll.accessEndDate).toLocaleDateString()}
                                                    </p>
                                                )}
                                                {enroll.status === 'approved' && enroll.testSeriesId && (
                                                    <Link
                                                        to={`/exam/portal/${enroll.testSeriesId._id || enroll.testSeriesId}`}
                                                        className="btn btn-dark btn-sm w-100 mt-2"
                                                    >
                                                        <i className="fa fa-play me-1"></i>View Tests
                                                    </Link>
                                                )}
                                                {enroll.status === 'pending' && (
                                                    <p className="text-warning small mt-2 mb-0">
                                                        <i className="fa fa-hourglass-half me-1"></i>
                                                        Payment verification in progress
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Mobile Quick Links */}
                        <div className="d-md-none mt-4 pt-4 border-top">
                            <h6 className="text-muted mb-3 text-uppercase" style={{ fontSize: '12px', letterSpacing: '1px' }}>Quick Links</h6>
                            <div className="d-flex flex-wrap gap-2">
                                <Link to="/test-series" className="btn btn-outline-secondary btn-sm">Browse Courses</Link>
                                <Link to="/ca-foundation" className="btn btn-outline-secondary btn-sm">Foundation</Link>
                                <Link to="/ca-inter" className="btn btn-outline-secondary btn-sm">Inter</Link>
                                <Link to="/ca-final" className="btn btn-outline-secondary btn-sm">Final</Link>
                                {user.role === 'mentor' && <Link to="/mentor" className="btn btn-primary btn-sm">Mentor Panel</Link>}
                                {user.isAdmin && <Link to="/dashboard" className="btn btn-dark btn-sm">Admin</Link>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
