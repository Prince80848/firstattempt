import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="login-page" style={{
            background: 'linear-gradient(135deg, #151370 0%, #1e1b4b 50%, #312e81 100%)',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px'
        }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-5 col-md-7">
                        <div className="card shadow-lg border-0" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                            {/* Header with Logo */}
                            <div className="text-center py-5" style={{ background: 'linear-gradient(135deg, #151370, #1e1b4b)' }}>
                                <img src="/images/logo.jpeg" alt="FirstAttempt" style={{ width: '80px', borderRadius: '50%', marginBottom: '15px' }} />
                                <h2 className="text-white mb-2">Welcome Back!</h2>
                                <p className="text-white-50 mb-0">
                                    <span style={{ color: '#ffd700' }}>FirstAttempt</span> - एक कदम CA की ओर
                                </p>
                            </div>

                            <div className="card-body p-5">
                                <h4 className="text-center mb-4" style={{ color: '#151370' }}>
                                    <i className="fa fa-sign-in-alt me-2"></i>Login to Your Account
                                </h4>

                                {error && (
                                    <div className="alert alert-danger d-flex align-items-center" role="alert">
                                        <i className="fa fa-exclamation-triangle me-2"></i>
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <label className="form-label fw-bold" htmlFor="email">
                                            <i className="fa fa-envelope text-primary me-2"></i>Email Address
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control form-control-lg"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email"
                                            style={{ borderRadius: '10px', border: '2px solid #e5e7eb' }}
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label fw-bold" htmlFor="password">
                                            <i className="fa fa-lock text-primary me-2"></i>Password
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control form-control-lg"
                                            id="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter your password"
                                            style={{ borderRadius: '10px', border: '2px solid #e5e7eb' }}
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg w-100 mb-4"
                                        disabled={loading}
                                        style={{ borderRadius: '10px', padding: '12px' }}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Logging in...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fa fa-sign-in-alt me-2"></i>Login
                                            </>
                                        )}
                                    </button>
                                </form>

                                <div className="text-center mb-3">
                                    <Link to="/forgot-password" className="text-muted">
                                        <i className="fa fa-key me-1"></i>Forgot Password?
                                    </Link>
                                </div>

                                <div className="text-center">
                                    <p className="mb-0" style={{ color: '#6b7280' }}>
                                        New to FirstAttempt?
                                        <Link to="/signup" className="fw-bold ms-1" style={{ color: '#151370' }}>
                                            Create Account
                                        </Link>
                                    </p>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="text-center py-3" style={{ background: '#f8f9fa', borderTop: '1px solid #e5e7eb' }}>
                                <small className="text-muted">
                                    <i className="fa fa-shield-alt me-1"></i>
                                    Your data is safe with us
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
