import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.mobile.length !== 10) {
            setError('Please enter a valid 10-digit mobile number');
            return;
        }

        setLoading(true);

        const result = await register(
            formData.name,
            formData.email,
            formData.mobile,
            formData.password
        );

        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="signup-page" style={{
            background: 'linear-gradient(135deg, #151370 0%, #1e1b4b 50%, #312e81 100%)',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px'
        }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-8">
                        <div className="card shadow-lg border-0" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                            {/* Header with Logo */}
                            <div className="text-center py-4" style={{ background: 'linear-gradient(135deg, #151370, #1e1b4b)' }}>
                                <img src="/images/logo.jpeg" alt="FirstAttempt" style={{ width: '70px', borderRadius: '50%', marginBottom: '10px' }} />
                                <h2 className="text-white mb-1">Welcome to FirstAttempt!</h2>
                                <p className="text-white-50 mb-0">
                                    <span style={{ color: '#ffd700' }}>एक कदम CA की ओर</span> - Your Success Journey Starts Here
                                </p>
                            </div>

                            <div className="card-body p-5">
                                <h4 className="text-center mb-4" style={{ color: '#151370' }}>
                                    <i className="fa fa-user-plus me-2"></i>Create Your Account
                                </h4>

                                {error && (
                                    <div className="alert alert-danger d-flex align-items-center" role="alert">
                                        <i className="fa fa-exclamation-triangle me-2"></i>
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-bold" htmlFor="name">
                                                <i className="fa fa-user text-primary me-2"></i>Full Name
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="Your full name"
                                                style={{ borderRadius: '10px', border: '2px solid #e5e7eb' }}
                                                required
                                            />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-bold" htmlFor="mobile">
                                                <i className="fa fa-phone text-primary me-2"></i>Mobile Number
                                            </label>
                                            <input
                                                type="tel"
                                                className="form-control form-control-lg"
                                                id="mobile"
                                                name="mobile"
                                                value={formData.mobile}
                                                onChange={handleChange}
                                                placeholder="10-digit mobile"
                                                pattern="[0-9]{10}"
                                                style={{ borderRadius: '10px', border: '2px solid #e5e7eb' }}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-bold" htmlFor="email">
                                            <i className="fa fa-envelope text-primary me-2"></i>Email Address
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control form-control-lg"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="your.email@example.com"
                                            style={{ borderRadius: '10px', border: '2px solid #e5e7eb' }}
                                            required
                                        />
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-bold" htmlFor="password">
                                                <i className="fa fa-lock text-primary me-2"></i>Password
                                            </label>
                                            <input
                                                type="password"
                                                className="form-control form-control-lg"
                                                id="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="Min 6 characters"
                                                minLength="6"
                                                style={{ borderRadius: '10px', border: '2px solid #e5e7eb' }}
                                                required
                                            />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-bold" htmlFor="confirmPassword">
                                                <i className="fa fa-check-circle text-primary me-2"></i>Confirm Password
                                            </label>
                                            <input
                                                type="password"
                                                className="form-control form-control-lg"
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                placeholder="Confirm password"
                                                minLength="6"
                                                style={{ borderRadius: '10px', border: '2px solid #e5e7eb' }}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg w-100 mb-3 mt-2"
                                        disabled={loading}
                                        style={{ borderRadius: '10px', padding: '12px' }}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Creating Account...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fa fa-rocket me-2"></i>Start Your Journey
                                            </>
                                        )}
                                    </button>
                                </form>

                                <div className="text-center">
                                    <p className="mb-0" style={{ color: '#6b7280' }}>
                                        Already have an account?
                                        <Link to="/login" className="fw-bold ms-1" style={{ color: '#151370' }}>
                                            Login Here
                                        </Link>
                                    </p>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="text-center py-3" style={{ background: '#f8f9fa', borderTop: '1px solid #e5e7eb' }}>
                                <small className="text-muted">
                                    <i className="fa fa-graduation-cap me-1"></i>
                                    Join 1000+ CA aspirants on their success journey
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
