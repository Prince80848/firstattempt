import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import EnrollmentForm from '../components/EnrollmentForm';

const CAFinal = () => {
    const [showEnrollForm, setShowEnrollForm] = useState(false);
    const [bannerImage, setBannerImage] = useState('/images/arambh-final.jpg');

    useEffect(() => {
        const fetchBanner = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/banners');
                const finalBanner = response.data.find(b => b.courseType === 'CA Final');
                if (finalBanner) {
                    setBannerImage(finalBanner.imageUrl);
                }
            } catch (error) {
                console.log('Using default banner');
            }
        };
        fetchBanner();
    }, []);

    const group1Subjects = [
        {
            name: 'Financial Reporting',
            icon: 'fa-file-invoice-dollar',
            description: 'Advanced financial reporting as per Ind AS and global standards.',
            topics: ['Ind AS', 'IFRS', 'Consolidated Statements', 'Business Combinations', 'Fair Value']
        },
        {
            name: 'Advanced Financial Management',
            icon: 'fa-chart-line',
            description: 'Strategic financial management and complex decision-making.',
            topics: ['Risk Management', 'Mergers & Acquisitions', 'Derivatives', 'Forex', 'Portfolio Management']
        },
        {
            name: 'Advanced Auditing & Professional Ethics',
            icon: 'fa-user-shield',
            description: 'Specialized audits and advanced professional standards.',
            topics: ['Special Audits', 'Due Diligence', 'Forensic Audit', 'Standards on Auditing', 'Ethics']
        },
        {
            name: 'Direct Tax Laws & International Taxation',
            icon: 'fa-globe',
            description: 'Complex tax provisions and cross-border taxation.',
            topics: ['Corporate Tax', 'International Tax', 'Transfer Pricing', 'DTAA', 'GAAR']
        }
    ];

    const group2Subjects = [
        {
            name: 'Strategic Cost Management & Performance',
            icon: 'fa-bullseye',
            description: 'Strategic cost management and decision analysis.',
            topics: ['Strategic Cost Analysis', 'Performance Management', 'Decision Making', 'Cost Control']
        },
        {
            name: 'Elective Paper',
            icon: 'fa-cog',
            description: 'Choose from 6 specialized elective options.',
            topics: ['Risk Management', 'Financial Services', 'Global Financial Reporting', 'Multidisciplinary Case Study', 'Economic Laws', 'Forensic Audit']
        }
    ];

    const electives = [
        { name: 'Risk Management', icon: 'fa-shield-alt' },
        { name: 'Financial Services & Capital Markets', icon: 'fa-chart-area' },
        { name: 'International Taxation', icon: 'fa-globe-americas' },
        { name: 'Economic Laws', icon: 'fa-balance-scale' },
        { name: 'Global Financial Reporting Standards', icon: 'fa-file-alt' },
        { name: 'Multidisciplinary Case Study', icon: 'fa-puzzle-piece' }
    ];

    const features = [
        { icon: 'fa-crown', title: 'Expert CA Mentors', desc: 'Learn from practicing CAs and rank holders' },
        { icon: 'fa-file-contract', title: 'Case Study Approach', desc: 'Real-world case studies for practical learning' },
        { icon: 'fa-sync', title: 'Amendment Updates', desc: 'Latest amendments and circular coverage' },
        { icon: 'fa-trophy', title: 'All India Mock', desc: 'National level mock tests for benchmarking' }
    ];

    return (
        <>
            {showEnrollForm && (
                <EnrollmentForm
                    course="CA Final"
                    onClose={() => setShowEnrollForm(false)}
                />
            )}

            {/* Hero Section */}
            <div className="position-relative" style={{ background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #43a047 100%)', padding: '80px 0' }}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 text-white">
                            <span className="badge bg-warning text-dark mb-3 px-3 py-2">
                                <i className="fa fa-crown me-1"></i>Final Level
                            </span>
                            <h1 className="display-4 fw-bold mb-4">CA Final</h1>
                            <p className="lead mb-4">
                                The ultimate challenge in your CA journey. Master advanced concepts
                                and become a Chartered Accountant with our comprehensive guidance.
                            </p>
                            <div className="d-flex gap-3 flex-wrap mb-4">
                                <div className="d-flex align-items-center">
                                    <i className="fa fa-layer-group me-2"></i>
                                    <span>2 Groups</span>
                                </div>
                                <div className="d-flex align-items-center">
                                    <i className="fa fa-book me-2"></i>
                                    <span>6 Papers</span>
                                </div>
                                <div className="d-flex align-items-center">
                                    <i className="fa fa-cog me-2"></i>
                                    <span>1 Elective</span>
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
                                alt="CA Final"
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
                                        style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, #1b5e20, #43a047)' }}
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
                            style={{ width: '60px', height: '60px', backgroundColor: '#1b5e20' }}
                        >
                            <span className="text-white fw-bold fs-4">G1</span>
                        </div>
                        <div>
                            <h6 className="text-success mb-0">Papers 1-4</h6>
                            <h3 className="mb-0">Group 1 Subjects</h3>
                        </div>
                    </div>
                    <div className="row g-4">
                        {group1Subjects.map((subject, index) => (
                            <div key={index} className="col-lg-6">
                                <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '15px', borderLeft: '4px solid #1b5e20' }}>
                                    <div className="card-body p-4">
                                        <div className="d-flex align-items-center mb-3">
                                            <div
                                                className="rounded-circle me-3 d-flex align-items-center justify-content-center"
                                                style={{ width: '45px', height: '45px', backgroundColor: '#e8f5e9' }}
                                            >
                                                <i className={`fa ${subject.icon} text-success`}></i>
                                            </div>
                                            <h5 className="mb-0">{subject.name}</h5>
                                        </div>
                                        <p className="text-muted small">{subject.description}</p>
                                        <div className="d-flex flex-wrap gap-2">
                                            {subject.topics.map((topic, i) => (
                                                <span key={i} className="badge bg-light text-success border px-2 py-1" style={{ fontSize: '11px' }}>
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
                            style={{ width: '60px', height: '60px', backgroundColor: '#2e7d32' }}
                        >
                            <span className="text-white fw-bold fs-4">G2</span>
                        </div>
                        <div>
                            <h6 className="text-success mb-0">Papers 5-6</h6>
                            <h3 className="mb-0">Group 2 Subjects</h3>
                        </div>
                    </div>
                    <div className="row g-4">
                        {group2Subjects.map((subject, index) => (
                            <div key={index} className="col-lg-6">
                                <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '15px', borderLeft: '4px solid #2e7d32' }}>
                                    <div className="card-body p-4">
                                        <div className="d-flex align-items-center mb-3">
                                            <div
                                                className="rounded-circle me-3 d-flex align-items-center justify-content-center"
                                                style={{ width: '45px', height: '45px', backgroundColor: '#e8f5e9' }}
                                            >
                                                <i className={`fa ${subject.icon} text-success`}></i>
                                            </div>
                                            <h5 className="mb-0">{subject.name}</h5>
                                        </div>
                                        <p className="text-muted small">{subject.description}</p>
                                        <div className="d-flex flex-wrap gap-2">
                                            {subject.topics.map((topic, i) => (
                                                <span key={i} className="badge bg-light text-success border px-2 py-1" style={{ fontSize: '11px' }}>
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

            {/* Elective Options */}
            <div className="py-5">
                <div className="container">
                    <div className="text-center mb-5">
                        <h6 className="text-success text-uppercase">Paper 6</h6>
                        <h2>Choose Your Elective</h2>
                        <p className="text-muted">Select one elective paper based on your career goals</p>
                    </div>
                    <div className="row g-4 justify-content-center">
                        {electives.map((elective, index) => (
                            <div key={index} className="col-lg-4 col-md-6">
                                <div className="card h-100 border-0 shadow-sm text-center p-4" style={{ borderRadius: '15px' }}>
                                    <div
                                        className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                                        style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, #1b5e20, #43a047)' }}
                                    >
                                        <i className={`fa ${elective.icon} text-white`}></i>
                                    </div>
                                    <h6 className="mb-0">{elective.name}</h6>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-5" style={{ background: 'linear-gradient(135deg, #1b5e20, #2e7d32)' }}>
                <div className="container text-center">
                    <h2 className="text-white mb-3">Ready to Become a Chartered Accountant?</h2>
                    <p className="text-white-50 mb-4">Join the elite group of CAs with FirstAttempt's proven methodology</p>
                    <button onClick={() => setShowEnrollForm(true)} className="btn btn-warning btn-lg px-5">
                        <i className="fa fa-graduation-cap me-2"></i>Start Your Final Journey!
                    </button>
                </div>
            </div>
        </>
    );
};

export default CAFinal;
