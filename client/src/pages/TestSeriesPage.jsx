import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import EnrollmentModal from '../components/EnrollmentModal';

const TestSeriesPage = () => {
    const [testSeries, setTestSeries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchParams] = useSearchParams();
    const [showEnrollModal, setShowEnrollModal] = useState(false);
    const [selectedTestSeries, setSelectedTestSeries] = useState(null);

    const handleEnroll = (series) => {
        setSelectedTestSeries(series);
        setShowEnrollModal(true);
    };

    const categories = [
        { id: 'all', label: 'All Courses', icon: 'fa-layer-group' },
        { id: 'CA Foundation', label: 'CA Foundation', icon: 'fa-seedling' },
        { id: 'CA Inter', label: 'CA Inter', icon: 'fa-chart-line' },
        { id: 'CA Final', label: 'CA Final', icon: 'fa-trophy' }
    ];

    useEffect(() => {
        const fetchTestSeries = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/test-series');
                setTestSeries(response.data);
            } catch (error) {
                console.error('Error fetching test series:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTestSeries();

        const categoryParam = searchParams.get('category');
        if (categoryParam && categories.some(c => c.id === categoryParam)) {
            setActiveCategory(categoryParam);
        }
    }, [searchParams]);

    const filteredSeries = activeCategory === 'all'
        ? testSeries
        : testSeries.filter(ts => ts.category === activeCategory);

    const getLevelColor = (level) => {
        switch (level?.toLowerCase()) {
            case 'beginner': return '#10b981';
            case 'intermediate': return '#f59e0b';
            case 'advanced': return '#ef4444';
            default: return '#06BBCC';
        }
    };

    return (
        <>
            {/* Hero Header */}
            <div style={{
                background: 'linear-gradient(135deg, #151370 0%, #1e1b4b 50%, #312e81 100%)',
                padding: '80px 0 100px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Animated Background Elements */}
                <div style={{
                    position: 'absolute',
                    top: '20%',
                    right: '10%',
                    width: '200px',
                    height: '200px',
                    background: 'rgba(255,215,0,0.1)',
                    borderRadius: '50%',
                    filter: 'blur(40px)'
                }}></div>
                <div style={{
                    position: 'absolute',
                    bottom: '10%',
                    left: '5%',
                    width: '150px',
                    height: '150px',
                    background: 'rgba(6,187,204,0.15)',
                    borderRadius: '50%',
                    filter: 'blur(30px)'
                }}></div>

                <div className="container text-center position-relative">
                    <span className="badge mb-3 px-4 py-2" style={{
                        background: 'rgba(255,215,0,0.2)',
                        color: '#ffd700',
                        fontSize: '14px',
                        borderRadius: '30px'
                    }}>
                        <i className="fa fa-star me-2"></i>Premium Test Series
                    </span>
                    <h1 className="display-4 text-white fw-bold mb-3">
                        Ace Your <span style={{ color: '#ffd700' }}>CA Exams</span>
                    </h1>
                    <p className="text-white-50 fs-5 mb-4" style={{ maxWidth: '600px', margin: '0 auto' }}>
                        Practice with our comprehensive test series designed by CA toppers.
                        Get detailed analysis and improve your performance.
                    </p>
                    <div className="d-flex justify-content-center gap-4 flex-wrap">
                        <div className="text-center">
                            <h3 className="text-white mb-0">500+</h3>
                            <small style={{ color: '#a5b4fc' }}>Questions</small>
                        </div>
                        <div style={{ width: '1px', background: 'rgba(255,255,255,0.2)' }}></div>
                        <div className="text-center">
                            <h3 className="text-white mb-0">50+</h3>
                            <small style={{ color: '#a5b4fc' }}>Mock Tests</small>
                        </div>
                        <div style={{ width: '1px', background: 'rgba(255,255,255,0.2)' }}></div>
                        <div className="text-center">
                            <h3 className="text-white mb-0">1000+</h3>
                            <small style={{ color: '#a5b4fc' }}>Students</small>
                        </div>
                    </div>
                </div>

                {/* Wave Divider */}
                <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%' }} viewBox="0 0 1440 100" fill="none">
                    <path d="M0,50 C360,100 1080,0 1440,50 L1440,100 L0,100 Z" fill="#f8fafc" />
                </svg>
            </div>

            {/* Category Filter */}
            <div style={{ background: '#f8fafc', paddingTop: '40px', paddingBottom: '20px' }}>
                <div className="container">
                    <div className="d-flex justify-content-center flex-wrap gap-3">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className="d-flex align-items-center gap-2"
                                style={{
                                    padding: '12px 24px',
                                    borderRadius: '50px',
                                    border: 'none',
                                    background: activeCategory === category.id
                                        ? 'linear-gradient(135deg, #151370, #312e81)'
                                        : '#ffffff',
                                    color: activeCategory === category.id ? '#ffffff' : '#4b5563',
                                    fontWeight: '500',
                                    boxShadow: activeCategory === category.id
                                        ? '0 4px 15px rgba(21,19,112,0.3)'
                                        : '0 2px 10px rgba(0,0,0,0.08)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <i className={`fa ${category.icon}`}></i>
                                {category.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Test Series Cards */}
            <div style={{ background: '#f8fafc', paddingTop: '40px', paddingBottom: '80px' }}>
                <div className="container">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}>
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="text-muted mt-3">Loading test series...</p>
                        </div>
                    ) : filteredSeries.length === 0 ? (
                        <div className="text-center py-5">
                            <div style={{
                                width: '120px',
                                height: '120px',
                                background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 20px'
                            }}>
                                <i className="fa fa-clipboard-list fa-3x" style={{ color: '#151370' }}></i>
                            </div>
                            <h3 style={{ color: '#1f2937' }}>No Test Series Available</h3>
                            <p className="text-muted">We're preparing new test series for you. Check back soon!</p>
                            <Link to="/contact" className="btn btn-primary mt-3">
                                <i className="fa fa-bell me-2"></i>Notify Me
                            </Link>
                        </div>
                    ) : (
                        <div className="row g-4">
                            {filteredSeries.map((series, index) => (
                                <div key={series._id} className="col-lg-4 col-md-6">
                                    <div
                                        className="h-100"
                                        style={{
                                            background: '#ffffff',
                                            borderRadius: '20px',
                                            overflow: 'hidden',
                                            boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                                            transition: 'transform 0.3s, box-shadow 0.3s',
                                            position: 'relative'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-10px)';
                                            e.currentTarget.style.boxShadow = '0 20px 50px rgba(21,19,112,0.15)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.08)';
                                        }}
                                    >
                                        {/* Popular Badge */}
                                        {index === 0 && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '15px',
                                                right: '15px',
                                                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                                color: '#fff',
                                                padding: '5px 15px',
                                                borderRadius: '20px',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                zIndex: 10
                                            }}>
                                                <i className="fa fa-fire me-1"></i>Popular
                                            </div>
                                        )}

                                        {/* Card Header */}
                                        <div style={{
                                            background: 'linear-gradient(135deg, #151370 0%, #312e81 100%)',
                                            padding: '30px',
                                            textAlign: 'center'
                                        }}>
                                            <span style={{
                                                display: 'inline-block',
                                                background: 'rgba(255,255,255,0.2)',
                                                color: '#fff',
                                                padding: '5px 15px',
                                                borderRadius: '20px',
                                                fontSize: '12px',
                                                marginBottom: '15px'
                                            }}>
                                                <i className="fa fa-graduation-cap me-2"></i>{series.category}
                                            </span>
                                            <h4 className="text-white mb-0">{series.title}</h4>
                                        </div>

                                        {/* Price Section */}
                                        <div style={{ padding: '30px', textAlign: 'center', borderBottom: '1px solid #f1f5f9' }}>
                                            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '5px' }}>
                                                <span style={{ color: '#6b7280', fontSize: '20px' }}>₹</span>
                                                <span style={{
                                                    fontSize: '48px',
                                                    fontWeight: '700',
                                                    background: 'linear-gradient(135deg, #151370, #06BBCC)',
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent'
                                                }}>
                                                    {series.price}
                                                </span>
                                            </div>
                                            <div className="d-flex justify-content-center gap-3 mt-2">
                                                <span className="text-muted">
                                                    <i className="fa fa-clock me-1"></i>{series.duration}
                                                </span>
                                                <span style={{
                                                    color: getLevelColor(series.level),
                                                    fontWeight: '500'
                                                }}>
                                                    <i className="fa fa-signal me-1"></i>{series.level || 'All Levels'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Description & Features */}
                                        <div style={{ padding: '25px' }}>
                                            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px' }}>
                                                {series.description}
                                            </p>

                                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                                {series.features && series.features.slice(0, 4).map((feature, idx) => (
                                                    <li key={idx} style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '10px',
                                                        marginBottom: '12px',
                                                        color: '#4b5563'
                                                    }}>
                                                        <span style={{
                                                            width: '20px',
                                                            height: '20px',
                                                            background: 'linear-gradient(135deg, #10b981, #059669)',
                                                            borderRadius: '50%',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}>
                                                            <i className="fa fa-check text-white" style={{ fontSize: '10px' }}></i>
                                                        </span>
                                                        {feature}
                                                    </li>
                                                ))}
                                                <li style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                    marginBottom: '12px',
                                                    color: '#4b5563'
                                                }}>
                                                    <span style={{
                                                        width: '20px',
                                                        height: '20px',
                                                        background: 'linear-gradient(135deg, #06BBCC, #0891b2)',
                                                        borderRadius: '50%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}>
                                                        <i className="fa fa-file-alt text-white" style={{ fontSize: '10px' }}></i>
                                                    </span>
                                                    {series.totalTests} Mock Tests Included
                                                </li>
                                            </ul>
                                        </div>

                                        {/* CTA Button */}
                                        <div style={{ padding: '0 25px 25px' }}>
                                            <button
                                                onClick={() => handleEnroll(series)}
                                                style={{
                                                    display: 'block',
                                                    width: '100%',
                                                    padding: '15px',
                                                    background: 'linear-gradient(135deg, #151370 0%, #312e81 100%)',
                                                    color: '#fff',
                                                    border: 'none',
                                                    borderRadius: '12px',
                                                    textAlign: 'center',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s'
                                                }}
                                            >
                                                <i className="fa fa-rocket me-2"></i>Enroll Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Why Choose Section */}
            <div className="container py-5">
                <div className="text-center mb-5">
                    <span className="badge bg-primary px-3 py-2 mb-3" style={{ borderRadius: '20px' }}>
                        Why FirstAttempt?
                    </span>
                    <h2 style={{ color: '#1f2937' }}>What Makes Our Test Series Special</h2>
                </div>
                <div className="row g-4">
                    {[
                        { icon: 'fa-brain', title: 'AI-Powered Analysis', desc: 'Get detailed insights on your performance' },
                        { icon: 'fa-chart-pie', title: 'Performance Tracking', desc: 'Track your progress over time' },
                        { icon: 'fa-comments', title: 'Expert Doubt Support', desc: '1:1 doubt resolution by CA toppers' },
                        { icon: 'fa-mobile-alt', title: 'Mobile Friendly', desc: 'Practice anytime, anywhere' }
                    ].map((item, idx) => (
                        <div key={idx} className="col-lg-3 col-md-6">
                            <div className="text-center p-4" style={{
                                background: '#fff',
                                borderRadius: '16px',
                                boxShadow: '0 5px 20px rgba(0,0,0,0.05)'
                            }}>
                                <div style={{
                                    width: '70px',
                                    height: '70px',
                                    background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 20px'
                                }}>
                                    <i className={`fa ${item.icon} fa-lg`} style={{ color: '#151370' }}></i>
                                </div>
                                <h5 style={{ color: '#1f2937' }}>{item.title}</h5>
                                <p className="text-muted mb-0" style={{ fontSize: '14px' }}>{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div style={{
                background: 'linear-gradient(135deg, #151370 0%, #1e1b4b 100%)',
                padding: '60px 0',
                marginTop: '40px'
            }}>
                <div className="container text-center">
                    <h2 className="text-white mb-3">Ready to Start Your CA Journey?</h2>
                    <p className="text-white-50 mb-4">Join thousands of successful CA aspirants who trust FirstAttempt</p>
                    <Link to="/contact" className="btn btn-warning btn-lg px-5" style={{ borderRadius: '30px', fontWeight: '600' }}>
                        <i className="fa fa-phone-alt me-2"></i>Contact Us
                    </Link>
                </div>
            </div>

            {/* Enrollment Modal */}
            <EnrollmentModal
                isOpen={showEnrollModal}
                onClose={() => setShowEnrollModal(false)}
                testSeries={selectedTestSeries}
            />
        </>
    );
};

export default TestSeriesPage;
