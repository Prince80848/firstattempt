import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Enter email, 2: Enter code & new password
    const [email, setEmail] = useState('');
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);
    const [generatedCode, setGeneratedCode] = useState(''); // For demo purposes

    const [emailSent, setEmailSent] = useState(false); // Track if email was actually sent

    const navigate = useNavigate();

    const handleSendCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
            setMessage({ type: 'success', text: response.data.message });

            if (response.data.emailSent) {
                setEmailSent(true);
                setGeneratedCode(''); // Don't show code if email was sent
            } else {
                setEmailSent(false);
                setGeneratedCode(response.data.resetToken); // Show code for demo mode
            }
            setStep(2);
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to send reset code'
            });
        }
        setLoading(false);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        if (newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await axios.post('http://localhost:5000/api/auth/reset-password', {
                email,
                resetToken: resetCode,
                newPassword
            });
            setMessage({ type: 'success', text: response.data.message });

            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to reset password'
            });
        }
        setLoading(false);
    };

    return (
        <div className="forgot-password-page" style={{
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
                            {/* Header */}
                            <div className="text-center py-5" style={{ background: 'linear-gradient(135deg, #151370, #1e1b4b)' }}>
                                <div className="mb-3">
                                    <i className="fa fa-key text-white" style={{ fontSize: '50px' }}></i>
                                </div>
                                <h2 className="text-white mb-2">Forgot Password?</h2>
                                <p className="text-white-50 mb-0">
                                    {step === 1 ? "Enter your email to receive reset code" : "Enter the code and new password"}
                                </p>
                            </div>

                            <div className="card-body p-5">
                                {/* Message Alert */}
                                {message.text && (
                                    <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'} d-flex align-items-center`}>
                                        <i className={`fa ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2`}></i>
                                        {message.text}
                                    </div>
                                )}

                                {/* Email Sent Confirmation */}
                                {emailSent && step === 2 && (
                                    <div className="alert alert-success">
                                        <i className="fa fa-envelope me-2"></i>
                                        <strong>Email Sent!</strong> Check your inbox for the 6-digit OTP code.
                                        <br /><small className="text-muted">Also check your spam folder if you don't see it.</small>
                                    </div>
                                )}

                                {/* Demo Code Display (only when email fails) */}
                                {generatedCode && step === 2 && !emailSent && (
                                    <div className="alert alert-warning">
                                        <i className="fa fa-info-circle me-2"></i>
                                        <strong>Demo Mode:</strong> Your reset code is <code className="fw-bold">{generatedCode}</code>
                                        <br /><small className="text-muted">(Email service not configured. Please set up EMAIL_USER and EMAIL_PASS in .env)</small>
                                    </div>
                                )}

                                {/* Step 1: Enter Email */}
                                {step === 1 && (
                                    <form onSubmit={handleSendCode}>
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
                                                placeholder="Enter your registered email"
                                                style={{ borderRadius: '10px', border: '2px solid #e5e7eb' }}
                                                required
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-lg w-100 mb-3"
                                            disabled={loading}
                                            style={{ borderRadius: '10px', padding: '12px' }}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fa fa-paper-plane me-2"></i>Send Reset Code
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}

                                {/* Step 2: Enter Code & New Password */}
                                {step === 2 && (
                                    <form onSubmit={handleResetPassword}>
                                        <div className="mb-3">
                                            <label className="form-label fw-bold" htmlFor="resetCode">
                                                <i className="fa fa-hashtag text-primary me-2"></i>Reset Code
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg text-center"
                                                id="resetCode"
                                                value={resetCode}
                                                onChange={(e) => setResetCode(e.target.value)}
                                                placeholder="Enter 6-digit code"
                                                style={{ borderRadius: '10px', border: '2px solid #e5e7eb', letterSpacing: '8px', fontSize: '24px' }}
                                                maxLength="6"
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label fw-bold" htmlFor="newPassword">
                                                <i className="fa fa-lock text-primary me-2"></i>New Password
                                            </label>
                                            <input
                                                type="password"
                                                className="form-control form-control-lg"
                                                id="newPassword"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="Enter new password"
                                                style={{ borderRadius: '10px', border: '2px solid #e5e7eb' }}
                                                minLength="6"
                                                required
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label fw-bold" htmlFor="confirmPassword">
                                                <i className="fa fa-lock text-primary me-2"></i>Confirm Password
                                            </label>
                                            <input
                                                type="password"
                                                className="form-control form-control-lg"
                                                id="confirmPassword"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="Confirm new password"
                                                style={{ borderRadius: '10px', border: '2px solid #e5e7eb' }}
                                                minLength="6"
                                                required
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn btn-success btn-lg w-100 mb-3"
                                            disabled={loading}
                                            style={{ borderRadius: '10px', padding: '12px' }}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                                    Resetting...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fa fa-check-circle me-2"></i>Reset Password
                                                </>
                                            )}
                                        </button>

                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary w-100"
                                            onClick={() => { setStep(1); setMessage({ type: '', text: '' }); }}
                                            style={{ borderRadius: '10px' }}
                                        >
                                            <i className="fa fa-arrow-left me-2"></i>Back to Email
                                        </button>
                                    </form>
                                )}

                                <div className="text-center mt-4">
                                    <p className="mb-0" style={{ color: '#6b7280' }}>
                                        Remember your password?
                                        <Link to="/login" className="fw-bold ms-1" style={{ color: '#151370' }}>
                                            Back to Login
                                        </Link>
                                    </p>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="text-center py-3" style={{ background: '#f8f9fa', borderTop: '1px solid #e5e7eb' }}>
                                <small className="text-muted">
                                    <i className="fa fa-shield-alt me-1"></i>
                                    Secure password reset
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
