import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

const EnrollmentModal = ({ isOpen, onClose, testSeries }) => {
    const { user } = useAuth();
    const [step, setStep] = useState(1); // 1: Form, 2: Payment, 3: Success
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        studentName: '',
        studentEmail: '',
        studentMobile: '',
        utrNumber: '',
        paymentProof: null
    });

    // Pre-fill form if user is logged in
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                studentName: user.name || '',
                studentEmail: user.email || '',
                studentMobile: user.mobile || ''
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setError('File size must be less than 2MB');
                return;
            }
            setFormData(prev => ({ ...prev, paymentProof: file }));
            setError('');
        }
    };

    const validateStep1 = () => {
        if (!formData.studentName.trim()) {
            setError('Please enter your name');
            return false;
        }
        if (!formData.studentEmail.trim() || !/\S+@\S+\.\S+/.test(formData.studentEmail)) {
            setError('Please enter a valid email');
            return false;
        }
        if (!formData.studentMobile.trim() || formData.studentMobile.length < 10) {
            setError('Please enter a valid 10-digit mobile number');
            return false;
        }
        setError('');
        return true;
    };

    const handleNext = () => {
        if (validateStep1()) {
            setStep(2);
        }
    };

    const handleSubmit = async () => {
        if (!formData.paymentProof && !formData.utrNumber) {
            setError('Please upload payment screenshot or enter UTR number');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const submitData = new FormData();
            submitData.append('testSeriesId', testSeries._id);
            submitData.append('studentName', formData.studentName);
            submitData.append('studentEmail', formData.studentEmail);
            submitData.append('studentMobile', formData.studentMobile);
            submitData.append('utrNumber', formData.utrNumber);
            submitData.append('userId', user._id);
            if (formData.paymentProof) {
                submitData.append('paymentProof', formData.paymentProof);
            }

            await axios.post('http://localhost:5000/api/test-series-enrollments', submitData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setStep(3);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit enrollment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setStep(1);
        setError('');
        setFormData({
            studentName: user?.name || '',
            studentEmail: user?.email || '',
            studentMobile: user?.mobile || '',
            utrNumber: '',
            paymentProof: null
        });
        onClose();
    };

    if (!isOpen || !testSeries) return null;

    // If user is not logged in, show login prompt
    if (!user) {
        return (
            <div
                className="modal fade show d-block"
                style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                        <div style={{
                            background: 'linear-gradient(135deg, #151370 0%, #312e81 100%)',
                            padding: '30px',
                            color: 'white',
                            textAlign: 'center'
                        }}>
                            <i className="fa fa-lock fa-3x mb-3" style={{ opacity: 0.8 }}></i>
                            <h4 className="mb-2">Login Required</h4>
                            <p className="mb-0 opacity-75">Please login to enroll in this test series</p>
                        </div>
                        <div className="modal-body p-4 text-center">
                            <div className="mb-4">
                                <h5 className="mb-2">{testSeries.title}</h5>
                                <span className="badge bg-primary me-2">{testSeries.category}</span>
                                <span className="badge bg-success">₹{testSeries.price}</span>
                            </div>
                            <p className="text-muted">Login to your account to complete your enrollment and access the test series.</p>
                            <div className="d-flex gap-3 justify-content-center mt-4">
                                <Link to="/login" className="btn btn-primary px-4" onClick={onClose}>
                                    <i className="fa fa-sign-in-alt me-2"></i>Login
                                </Link>
                                <Link to="/signup" className="btn btn-outline-primary px-4" onClick={onClose}>
                                    <i className="fa fa-user-plus me-2"></i>Sign Up
                                </Link>
                            </div>
                            <p className="text-muted small mt-3 mb-0">
                                Don't have an account? <Link to="/signup" onClick={onClose}>Create one for free</Link>
                            </p>
                        </div>
                        <div className="modal-footer border-0 justify-content-center pb-4">
                            <button className="btn btn-link text-muted" onClick={onClose}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="modal fade show d-block"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
            onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                    {/* Header */}
                    <div style={{
                        background: 'linear-gradient(135deg, #151370 0%, #312e81 100%)',
                        padding: '25px 30px',
                        color: 'white'
                    }}>
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h4 className="mb-1">Enroll in {testSeries.title}</h4>
                                <p className="mb-0 opacity-75">
                                    <span className="badge bg-light text-primary me-2">{testSeries.category}</span>
                                    {testSeries.duration}
                                </p>
                            </div>
                            <button
                                className="btn btn-light btn-sm rounded-circle"
                                onClick={handleClose}
                                style={{ width: '36px', height: '36px' }}
                            >
                                <i className="fa fa-times"></i>
                            </button>
                        </div>

                        {/* Price Badge */}
                        <div className="mt-3 d-flex align-items-center gap-3">
                            <span style={{
                                background: 'rgba(255,215,0,0.2)',
                                color: '#ffd700',
                                padding: '8px 20px',
                                borderRadius: '30px',
                                fontWeight: '700',
                                fontSize: '20px'
                            }}>
                                ₹{testSeries.price}
                            </span>
                            <span className="text-white-50">
                                <i className="fa fa-file-alt me-1"></i>
                                {testSeries.totalTests || 10} Mock Tests
                            </span>
                        </div>
                    </div>

                    {/* Progress Steps */}
                    <div className="px-4 py-3 bg-light">
                        <div className="d-flex justify-content-center gap-4">
                            {[1, 2, 3].map(s => (
                                <div key={s} className="d-flex align-items-center">
                                    <div style={{
                                        width: '30px',
                                        height: '30px',
                                        borderRadius: '50%',
                                        background: step >= s ? '#151370' : '#e5e7eb',
                                        color: step >= s ? '#fff' : '#9ca3af',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: '600',
                                        fontSize: '14px'
                                    }}>
                                        {step > s ? <i className="fa fa-check"></i> : s}
                                    </div>
                                    <span className={`ms-2 ${step >= s ? 'text-dark' : 'text-muted'}`} style={{ fontSize: '14px' }}>
                                        {s === 1 ? 'Details' : s === 2 ? 'Payment' : 'Done'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Body */}
                    <div className="modal-body p-4">
                        {error && (
                            <div className="alert alert-danger py-2 mb-3">
                                <i className="fa fa-exclamation-circle me-2"></i>{error}
                            </div>
                        )}

                        {/* Step 1: Student Details */}
                        {step === 1 && (
                            <div>
                                <h5 className="mb-3"><i className="fa fa-user-edit text-primary me-2"></i>Your Details</h5>
                                <div className="row g-3">
                                    <div className="col-12">
                                        <label className="form-label">Full Name *</label>
                                        <input
                                            type="text"
                                            name="studentName"
                                            className="form-control form-control-lg"
                                            placeholder="Enter your full name"
                                            value={formData.studentName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Email Address *</label>
                                        <input
                                            type="email"
                                            name="studentEmail"
                                            className="form-control form-control-lg"
                                            placeholder="your@email.com"
                                            value={formData.studentEmail}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Mobile Number *</label>
                                        <input
                                            type="tel"
                                            name="studentMobile"
                                            className="form-control form-control-lg"
                                            placeholder="10-digit mobile number"
                                            value={formData.studentMobile}
                                            onChange={handleChange}
                                            maxLength="10"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="alert alert-info mt-4 mb-0">
                                    <i className="fa fa-info-circle me-2"></i>
                                    We'll send confirmation and access details to your email.
                                </div>
                            </div>
                        )}

                        {/* Step 2: Payment */}
                        {step === 2 && (
                            <div>
                                <div className="row">
                                    <div className="col-md-6 mb-4 mb-md-0">
                                        <h5 className="mb-3"><i className="fa fa-qrcode text-primary me-2"></i>Scan & Pay</h5>
                                        <div className="text-center p-3 bg-white border rounded-3">
                                            <img
                                                src="/images/QR CODE payment.jpeg"
                                                alt="Payment QR Code"
                                                style={{
                                                    maxWidth: '200px',
                                                    width: '100%',
                                                    borderRadius: '10px'
                                                }}
                                            />
                                            <div className="mt-3">
                                                <p className="mb-1 text-muted">Amount to Pay</p>
                                                <h3 className="text-primary mb-2">₹{testSeries.price}</h3>
                                            </div>
                                        </div>
                                        <div className="mt-3 text-center text-muted" style={{ fontSize: '13px' }}>
                                            <p className="mb-1">Scan with any UPI app:</p>
                                            <div className="d-flex justify-content-center gap-2">
                                                <span>GPay</span>•<span>PhonePe</span>•<span>Paytm</span>•<span>BHIM</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <h5 className="mb-3"><i className="fa fa-upload text-primary me-2"></i>Upload Proof</h5>

                                        <div className="mb-3">
                                            <label className="form-label">Payment Screenshot *</label>
                                            <div
                                                className="border rounded-3 p-4 text-center"
                                                style={{
                                                    borderStyle: 'dashed',
                                                    cursor: 'pointer',
                                                    background: formData.paymentProof ? '#e8f5e9' : '#fafafa'
                                                }}
                                                onClick={() => document.getElementById('paymentProof').click()}
                                            >
                                                <input
                                                    type="file"
                                                    id="paymentProof"
                                                    className="d-none"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                />
                                                {formData.paymentProof ? (
                                                    <div>
                                                        <i className="fa fa-check-circle text-success fa-2x mb-2"></i>
                                                        <p className="mb-0 text-success">{formData.paymentProof.name}</p>
                                                        <small className="text-muted">Click to change</small>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <i className="fa fa-cloud-upload-alt fa-2x text-muted mb-2"></i>
                                                        <p className="mb-0">Click to upload screenshot</p>
                                                        <small className="text-muted">Max 2MB (JPG, PNG)</small>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">UTR/Transaction Number (Optional)</label>
                                            <input
                                                type="text"
                                                name="utrNumber"
                                                className="form-control"
                                                placeholder="Enter 12-digit UTR number"
                                                value={formData.utrNumber}
                                                onChange={handleChange}
                                            />
                                            <small className="text-muted">Found in your UPI app's transaction history</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Success */}
                        {step === 3 && (
                            <div className="text-center py-4">
                                <div style={{
                                    width: '100px',
                                    height: '100px',
                                    background: 'linear-gradient(135deg, #10b981, #059669)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 20px'
                                }}>
                                    <i className="fa fa-check fa-3x text-white"></i>
                                </div>
                                <h3 className="text-success mb-2">Enrollment Submitted!</h3>
                                <p className="text-muted mb-4" style={{ maxWidth: '400px', margin: '0 auto' }}>
                                    Thank you, <strong>{formData.studentName}</strong>!
                                    Your enrollment for <strong>{testSeries.title}</strong> has been received.
                                </p>

                                <div className="bg-light p-4 rounded-3 mb-4" style={{ maxWidth: '450px', margin: '0 auto' }}>
                                    <h6 className="mb-3"><i className="fa fa-clock text-warning me-2"></i>What's Next?</h6>
                                    <ul className="list-unstyled text-start mb-0">
                                        <li className="mb-2">
                                            <i className="fa fa-check-circle text-success me-2"></i>
                                            Our team will verify your payment within 24 hours
                                        </li>
                                        <li className="mb-2">
                                            <i className="fa fa-envelope text-primary me-2"></i>
                                            Confirmation email will be sent to {formData.studentEmail}
                                        </li>
                                        <li>
                                            <i className="fa fa-graduation-cap text-info me-2"></i>
                                            Access details will be shared after verification
                                        </li>
                                    </ul>
                                </div>

                                <p className="text-muted small">
                                    Need help? Contact us at <a href="mailto:firstattempthelp@gmail.com">firstattempthelp@gmail.com</a>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {step < 3 && (
                        <div className="modal-footer border-0 px-4 pb-4">
                            {step === 1 ? (
                                <>
                                    <button className="btn btn-outline-secondary" onClick={handleClose}>
                                        Cancel
                                    </button>
                                    <button className="btn btn-primary px-4" onClick={handleNext}>
                                        Next: Payment <i className="fa fa-arrow-right ms-2"></i>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button className="btn btn-outline-secondary" onClick={() => setStep(1)}>
                                        <i className="fa fa-arrow-left me-2"></i>Back
                                    </button>
                                    <button
                                        className="btn btn-success px-4"
                                        onClick={handleSubmit}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fa fa-check me-2"></i>Submit Enrollment
                                            </>
                                        )}
                                    </button>
                                </>
                            )}
                        </div>
                    )}

                    {step === 3 && (
                        <div className="modal-footer border-0 px-4 pb-4 justify-content-center">
                            <button className="btn btn-primary px-5" onClick={handleClose}>
                                <i className="fa fa-home me-2"></i>Done
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EnrollmentModal;
