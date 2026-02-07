import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer style={{
            background: 'linear-gradient(135deg, #0f0c29 0%, #151370 50%, #24243e 100%)',
            color: '#ffffff',
            marginTop: '0'
        }}>
            {/* Main Footer Content */}
            <div className="container py-5">
                <div className="row g-5">
                    {/* Brand Section */}
                    <div className="col-lg-4 col-md-6">
                        <div className="d-flex align-items-center mb-4">
                            <img
                                src="/images/logo.jpeg"
                                alt="FirstAttempt Logo"
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                    marginRight: '15px',
                                    border: '3px solid #ffd700'
                                }}
                            />
                            <div>
                                <h4 className="mb-0" style={{ color: '#ffd700', fontWeight: '700' }}>FirstAttempt</h4>
                                <small style={{ color: '#a5b4fc' }}>एक कदम CA की ओर</small>
                            </div>
                        </div>
                        <p style={{ color: '#cbd5e1', lineHeight: '1.8' }}>
                            Your trusted partner in CA journey. We provide expert mentorship,
                            comprehensive test series, and personalized guidance to help you
                            clear your CA exams in the first attempt.
                        </p>

                        {/* Social Icons */}
                        <div className="d-flex gap-2 mt-4">
                            <a href="https://www.instagram.com/firstattempt.24"
                                className="d-flex align-items-center justify-content-center"
                                style={{
                                    width: '45px',
                                    height: '45px',
                                    background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
                                    borderRadius: '12px',
                                    color: '#fff',
                                    fontSize: '20px',
                                    transition: 'transform 0.3s'
                                }}>
                                <i className="fab fa-instagram"></i>
                            </a>
                            <a href="https://www.youtube.com/@FirstAttempt24"
                                className="d-flex align-items-center justify-content-center"
                                style={{
                                    width: '45px',
                                    height: '45px',
                                    background: '#FF0000',
                                    borderRadius: '12px',
                                    color: '#fff',
                                    fontSize: '20px'
                                }}>
                                <i className="fab fa-youtube"></i>
                            </a>
                            <a href="https://lnkd.in/g36qfjsZ"
                                className="d-flex align-items-center justify-content-center"
                                style={{
                                    width: '45px',
                                    height: '45px',
                                    background: '#0088cc',
                                    borderRadius: '12px',
                                    color: '#fff',
                                    fontSize: '20px'
                                }}>
                                <i className="fab fa-telegram"></i>
                            </a>
                            <a href="https://www.linkedin.com/company/firstattempt24/"
                                className="d-flex align-items-center justify-content-center"
                                style={{
                                    width: '45px',
                                    height: '45px',
                                    background: '#0077B5',
                                    borderRadius: '12px',
                                    color: '#fff',
                                    fontSize: '20px'
                                }}>
                                <i className="fab fa-linkedin-in"></i>
                            </a>
                            <a href="https://chat.whatsapp.com/IZN2HIylyYG93hqpyJ2pMI"
                                className="d-flex align-items-center justify-content-center"
                                style={{
                                    width: '45px',
                                    height: '45px',
                                    background: '#25D366',
                                    borderRadius: '12px',
                                    color: '#fff',
                                    fontSize: '20px'
                                }}>
                                <i className="fab fa-whatsapp"></i>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="col-lg-2 col-md-6">
                        <h5 style={{ color: '#ffd700', marginBottom: '25px', fontWeight: '600' }}>
                            <i className="fa fa-link me-2"></i>Quick Links
                        </h5>
                        <ul className="list-unstyled" style={{ lineHeight: '2.5' }}>
                            <li>
                                <Link to="/" style={{ color: '#cbd5e1', textDecoration: 'none', transition: 'color 0.3s' }}>
                                    <i className="fa fa-chevron-right me-2" style={{ fontSize: '12px', color: '#06BBCC' }}></i>Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
                                    <i className="fa fa-chevron-right me-2" style={{ fontSize: '12px', color: '#06BBCC' }}></i>About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/test-series" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
                                    <i className="fa fa-chevron-right me-2" style={{ fontSize: '12px', color: '#06BBCC' }}></i>Test Series
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
                                    <i className="fa fa-chevron-right me-2" style={{ fontSize: '12px', color: '#06BBCC' }}></i>Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Courses */}
                    <div className="col-lg-2 col-md-6">
                        <h5 style={{ color: '#ffd700', marginBottom: '25px', fontWeight: '600' }}>
                            <i className="fa fa-graduation-cap me-2"></i>Courses
                        </h5>
                        <ul className="list-unstyled" style={{ lineHeight: '2.5' }}>
                            <li>
                                <Link to="/ca-foundation" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
                                    <i className="fa fa-chevron-right me-2" style={{ fontSize: '12px', color: '#06BBCC' }}></i>CA Foundation
                                </Link>
                            </li>
                            <li>
                                <Link to="/ca-inter" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
                                    <i className="fa fa-chevron-right me-2" style={{ fontSize: '12px', color: '#06BBCC' }}></i>CA Intermediate
                                </Link>
                            </li>
                            <li>
                                <Link to="/ca-final" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
                                    <i className="fa fa-chevron-right me-2" style={{ fontSize: '12px', color: '#06BBCC' }}></i>CA Final
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="col-lg-4 col-md-6">
                        <h5 style={{ color: '#ffd700', marginBottom: '25px', fontWeight: '600' }}>
                            <i className="fa fa-envelope me-2"></i>Get In Touch
                        </h5>

                        <div className="d-flex align-items-center mb-4">
                            <div style={{
                                width: '50px',
                                height: '50px',
                                background: 'rgba(6, 187, 204, 0.2)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '15px'
                            }}>
                                <i className="fa fa-phone-alt" style={{ color: '#06BBCC', fontSize: '20px' }}></i>
                            </div>
                            <div>
                                <small style={{ color: '#a5b4fc' }}>Call Us</small>
                                <p className="mb-0" style={{ color: '#ffffff', fontWeight: '500' }}>+91 9931278403</p>
                            </div>
                        </div>

                        <div className="d-flex align-items-center mb-4">
                            <div style={{
                                width: '50px',
                                height: '50px',
                                background: 'rgba(6, 187, 204, 0.2)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '15px'
                            }}>
                                <i className="fa fa-envelope" style={{ color: '#06BBCC', fontSize: '20px' }}></i>
                            </div>
                            <div>
                                <small style={{ color: '#a5b4fc' }}>Email Us</small>
                                <p className="mb-0" style={{ color: '#ffffff', fontWeight: '500' }}>firstattempthelp@gmail.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright Section */}
            <div style={{
                background: 'rgba(0,0,0,0.3)',
                borderTop: '1px solid rgba(255,255,255,0.1)'
            }}>
                <div className="container py-4">
                    <div className="row align-items-center">
                        <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                            <p className="mb-0" style={{ color: '#a5b4fc', fontSize: '14px' }}>
                                © {currentYear} <span style={{ color: '#ffd700', fontWeight: '600' }}>FirstAttempt</span>.
                                All Rights Reserved.
                            </p>
                        </div>
                        <div className="col-md-6 text-center text-md-end">
                            <div className="d-flex justify-content-center justify-content-md-end gap-4">
                                <Link to="/" style={{ color: '#a5b4fc', textDecoration: 'none', fontSize: '14px' }}>
                                    Privacy Policy
                                </Link>
                                <Link to="/" style={{ color: '#a5b4fc', textDecoration: 'none', fontSize: '14px' }}>
                                    Terms of Service
                                </Link>
                                <Link to="/contact" style={{ color: '#a5b4fc', textDecoration: 'none', fontSize: '14px' }}>
                                    Support
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
