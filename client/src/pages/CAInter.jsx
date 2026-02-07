import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import EnrollmentForm from '../components/EnrollmentForm';

const CAInter = () => {
    const [showEnrollForm, setShowEnrollForm] = useState(false);
    const [bannerImage, setBannerImage] = useState('/images/arambh-inter.png');

    useEffect(() => {
        const fetchBanner = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/banners');
                const interBanner = response.data.find(b => b.courseType === 'CA Inter');
                if (interBanner) {
                    setBannerImage(interBanner.imageUrl);
                }
            } catch (error) {
                console.log('Using default banner');
            }
        };
        fetchBanner();
    }, []);

    const group1Subjects = [
        {
            name: 'Advanced Accounting',
            icon: 'fa-book',
            description: 'Deep dive into complex accounting treatments and special transactions.',
            topics: ['Partnership Accounts', 'Company Accounts', 'Amalgamation', 'Consolidated Financial Statements']
        },
        {
            name: 'Corporate & Other Laws',
            icon: 'fa-gavel',
            description: 'Comprehensive coverage of company law and other relevant legislations.',
            topics: ['Companies Act 2013', 'SEBI Regulations', 'FEMA', 'Competition Act', 'Insolvency Code']
        },
        {
            name: 'Cost & Management Accounting',
            icon: 'fa-chart-pie',
            description: 'Master cost accounting concepts and management decision-making tools.',
            topics: ['Cost Ascertainment', 'Marginal Costing', 'Standard Costing', 'Budget & Control']
        },
        {
            name: 'Taxation (Direct & Indirect)',
            icon: 'fa-landmark',
            description: 'Complete understanding of Income Tax and GST provisions.',
            topics: ['Income Tax', 'GST', 'Tax Planning', 'Advance Tax', 'TDS']
        }
    ];

    const group2Subjects = [
        {
            name: 'Auditing & Ethics',
            icon: 'fa-search-dollar',
            description: 'Learn audit techniques, procedures, and professional ethics.',
            topics: ['Audit Planning', 'Internal Control', 'Company Audit', 'Professional Ethics']
        },
        {
            name: 'Financial Management & Economics',
            icon: 'fa-money-bill-wave',
            description: 'Financial decision-making and economic analysis for business.',
            topics: ['Financial Decisions', 'Capital Budgeting', 'Working Capital', 'Indian Economy']
        },
        {
            name: 'Strategic Management',
            icon: 'fa-chess',
            description: 'Strategic thinking and business planning concepts.',
            topics: ['Strategy Formulation', 'SWOT Analysis', 'Competitive Advantage', 'Implementation']
        },
        {
            name: 'Enterprise Information Systems',
            icon: 'fa-server',
            description: 'Information systems and their application in business.',
            topics: ['IS Framework', 'IT Environment', 'E-Commerce', 'Security & Control']
        }
    ];

    const features = [
        { icon: 'fa-chalkboard-teacher', title: 'Expert Faculty', desc: 'Learn from CA toppers and experienced mentors' },
        { icon: 'fa-tasks', title: 'Structured Approach', desc: 'Systematic preparation for both groups' },
        { icon: 'fa-file-alt', title: 'RTP & MTP Coverage', desc: 'Complete coverage of exam-oriented materials' },
        { icon: 'fa-question-circle', title: 'MCQ Practice', desc: 'Extensive MCQ practice for objective portion' }
    ];

    return (
        <>
            {showEnrollForm && (
                <EnrollmentForm
                    course="CA Inter"
                    onClose={() => setShowEnrollForm(false)}
                />
            )}

            {/* Hero Section */}
            <div className="position-relative" style={{ background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 50%, #1976d2 100%)', padding: '80px 0' }}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 text-white">
                            <span className="badge bg-warning text-dark mb-3 px-3 py-2">
                                <i className="fa fa-star me-1"></i>Intermediate Level
                            </span>
                            <h1 className="display-4 fw-bold mb-4">CA Intermediate</h1>
                            <p className="lead mb-4">
                                Take your CA journey to the next level. Master advanced concepts across
                                8 subjects with our comprehensive Group 1 & Group 2 programs.
                            </p>
                            <div className="d-flex gap-3 flex-wrap mb-4">
                                <div className="d-flex align-items-center">
                                    <i className="fa fa-layer-group me-2"></i>
                                    <span>2 Groups</span>
                                </div>
                                <div className="d-flex align-items-center">
                                    <i className="fa fa-book me-2"></i>
                                    <span>8 Papers</span>
                                </div>
                                <div className="d-flex align-items-center">
                                    <i className="fa fa-calendar me-2"></i>
                                    <span>8 Months Program</span>
                                </div>
                            </div>
                            <div className="d-flex gap-3">
                                <button onClick={() => setShowEnrollForm(true)} className="btn btn-warning btn-lg px-4">
                                    <i className="fa fa-rocket me-2"></i>Enroll Now
                                </button>
                                <Link to="/contact" className="btn btn-outline-light btn-lg px-4">
                                    <i className="fa fa-phone me-2"></i>Contact Us
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-6 text-center mt-5 mt-lg-0">
                            <img
                                src={bannerImage}
                                alt="CA Intermediate"
                                className="img-fluid rounded-4 shadow-lg"
                                style={{ maxHeight: '400px', objectFit: 'cover' }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-5" style={{ background: '#f8f9fa' }}>
                <div className="container">
                    <div className="row g-4 justify-content-center">
                        {features.map((feature, index) => (
                            <div key={index} className="col-lg-3 col-md-6">
                                <div className="card h-100 border-0 shadow-sm text-center p-4" style={{ borderRadius: '15px' }}>
                                    <div
                                        className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                                        style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, #0d47a1, #1976d2)' }}
                                    >
                                        <i className={`fa ${feature.icon} text-white`}></i>
                                    </div>
                                    <h6>{feature.title}</h6>
                                    <small className="text-muted">{feature.desc}</small>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Group 1 Section */}
            <div className="py-5">
                <div className="container">
                    <div className="d-flex align-items-center mb-4">
                        <div
                            className="rounded-3 me-3 d-flex align-items-center justify-content-center"
                            style={{ width: '60px', height: '60px', backgroundColor: '#0d47a1' }}
                        >
                            <span className="text-white fw-bold fs-4">G1</span>
                        </div>
                        <div>
                            <h6 className="text-primary mb-0">Papers 1-4</h6>
                            <h3 className="mb-0">Group 1 Subjects</h3>
                        </div>
                    </div>
                    <div className="row g-4">
                        {group1Subjects.map((subject, index) => (
                            <div key={index} className="col-lg-6">
                                <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '15px', borderLeft: '4px solid #0d47a1' }}>
                                    <div className="card-body p-4">
                                        <div className="d-flex align-items-center mb-3">
                                            <div
                                                className="rounded-circle me-3 d-flex align-items-center justify-content-center"
                                                style={{ width: '45px', height: '45px', backgroundColor: '#e3f2fd' }}
                                            >
                                                <i className={`fa ${subject.icon} text-primary`}></i>
                                            </div>
                                            <h5 className="mb-0">{subject.name}</h5>
                                        </div>
                                        <p className="text-muted small">{subject.description}</p>
                                        <div className="d-flex flex-wrap gap-2">
                                            {subject.topics.map((topic, i) => (
                                                <span key={i} className="badge bg-light text-primary border px-2 py-1" style={{ fontSize: '11px' }}>
                                                    {topic}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Group 2 Section */}
            <div className="py-5" style={{ background: '#f8f9fa' }}>
                <div className="container">
                    <div className="d-flex align-items-center mb-4">
                        <div
                            className="rounded-3 me-3 d-flex align-items-center justify-content-center"
                            style={{ width: '60px', height: '60px', backgroundColor: '#1565c0' }}
                        >
                            <span className="text-white fw-bold fs-4">G2</span>
                        </div>
                        <div>
                            <h6 className="text-primary mb-0">Papers 5-8</h6>
                            <h3 className="mb-0">Group 2 Subjects</h3>
                        </div>
                    </div>
                    <div className="row g-4">
                        {group2Subjects.map((subject, index) => (
                            <div key={index} className="col-lg-6">
                                <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '15px', borderLeft: '4px solid #1565c0' }}>
                                    <div className="card-body p-4">
                                        <div className="d-flex align-items-center mb-3">
                                            <div
                                                className="rounded-circle me-3 d-flex align-items-center justify-content-center"
                                                style={{ width: '45px', height: '45px', backgroundColor: '#e3f2fd' }}
                                            >
                                                <i className={`fa ${subject.icon} text-primary`}></i>
                                            </div>
                                            <h5 className="mb-0">{subject.name}</h5>
                                        </div>
                                        <p className="text-muted small">{subject.description}</p>
                                        <div className="d-flex flex-wrap gap-2">
                                            {subject.topics.map((topic, i) => (
                                                <span key={i} className="badge bg-light text-primary border px-2 py-1" style={{ fontSize: '11px' }}>
                                                    {topic}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-5" style={{ background: 'linear-gradient(135deg, #0d47a1, #1565c0)' }}>
                <div className="container text-center">
                    <h2 className="text-white mb-3">Ready to Conquer CA Inter?</h2>
                    <p className="text-white-50 mb-4">Join our proven program with 80%+ success rate</p>
                    <button onClick={() => setShowEnrollForm(true)} className="btn btn-warning btn-lg px-5">
                        <i className="fa fa-graduation-cap me-2"></i>Start Your Journey Today!
                    </button>
                </div>
            </div>
        </>
    );
};

export default CAInter;
