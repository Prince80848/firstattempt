import { useState } from 'react';
import axios from 'axios';

const EnrollmentForm = ({ course, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState({ type: '', message: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult({ type: '', message: '' });

        try {
            const response = await axios.post('http://localhost:5000/api/enrollments', {
                ...formData,
                course
            });
            setResult({ type: 'success', message: response.data.message });
            setFormData({ name: '', email: '', mobile: '', message: '' });
        } catch (error) {
            setResult({
                type: 'error',
                message: error.response?.data?.message || 'Something went wrong. Please try again.'
            });
        }
        setLoading(false);
    };

    return (
        <div
            className="modal show d-block"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
            onClick={onClose}
        >
            <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
                <div className="modal-content" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                    <div
                        className="modal-header border-0 text-white py-4"
                        style={{ background: 'linear-gradient(135deg, #151370, #312e81)' }}
                    >
                        <div>
                            <h4 className="modal-title mb-1">Enroll Now</h4>
                            <small className="opacity-75">{course}</small>
                        </div>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            onClick={onClose}
                        ></button>
                    </div>
                    <div className="modal-body p-4">
                        {result.message && (
                            <div className={`alert ${result.type === 'success' ? 'alert-success' : 'alert-danger'} d-flex align-items-center`}>
                                <i className={`fa ${result.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} me-2`}></i>
                                {result.message}
                            </div>
                        )}

                        {result.type !== 'success' && (
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-bold small text-muted">
                                        <i className="fa fa-user text-primary me-2"></i>Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control form-control-lg"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        style={{ borderRadius: '10px' }}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold small text-muted">
                                        <i className="fa fa-envelope text-primary me-2"></i>Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control form-control-lg"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        style={{ borderRadius: '10px' }}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold small text-muted">
                                        <i className="fa fa-phone text-primary me-2"></i>Mobile Number *
                                    </label>
                                    <input
                                        type="tel"
                                        className="form-control form-control-lg"
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        placeholder="10-digit mobile number"
                                        pattern="[0-9]{10}"
                                        style={{ borderRadius: '10px' }}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label fw-bold small text-muted">
                                        <i className="fa fa-comment text-primary me-2"></i>Message (Optional)
                                    </label>
                                    <textarea
                                        className="form-control"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Any questions or requirements?"
                                        rows="3"
                                        style={{ borderRadius: '10px' }}
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 py-3"
                                    disabled={loading}
                                    style={{ borderRadius: '10px', fontWeight: 'bold' }}
                                >
                                    {loading ? (
                                        <><span className="spinner-border spinner-border-sm me-2"></span>Submitting...</>
                                    ) : (
                                        <><i className="fa fa-paper-plane me-2"></i>Submit Enrollment</>
                                    )}
                                </button>
                            </form>
                        )}

                        {result.type === 'success' && (
                            <div className="text-center py-3">
                                <div className="mb-3">
                                    <i className="fa fa-check-circle text-success" style={{ fontSize: '60px' }}></i>
                                </div>
                                <h5 className="mb-3">Thank You!</h5>
                                <p className="text-muted">Our team will contact you within 24 hours.</p>
                                <button
                                    className="btn btn-outline-primary"
                                    onClick={onClose}
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnrollmentForm;
