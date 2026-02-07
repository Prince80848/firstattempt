import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import EnrollmentForm from '../components/EnrollmentForm';

const CAFoundation = () => {
    const [showEnrollForm, setShowEnrollForm] = useState(false);
    const [bannerImage, setBannerImage] = useState('/images/arambh-foundation.png');

    useEffect(() => {
        const fetchBanner = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/banners');
                const foundationBanner = response.data.find(b => b.courseType === 'CA Foundation');
                if (foundationBanner) {
                    setBannerImage(foundationBanner.imageUrl);
                }
            } catch (error) {
                console.log('Using default banner');
            }
        };
        fetchBanner();
    }, []);

    const subjects = [
        {
            name: 'Principles and Practice of Accounting',
            icon: 'fa-calculator',
            description: 'Learn fundamental accounting principles, journal entries, ledger accounts, and final accounts preparation.',
            topics: ['Accounting Standards', 'Depreciation', 'Bank Reconciliation', 'Rectification of Errors', 'Final Accounts']
        },
        {
            name: 'Business Laws & Business Correspondence',
            icon: 'fa-balance-scale',
            description: 'Understand essential business laws and develop professional communication skills.',
            topics: ['Indian Contract Act', 'Sale of Goods Act', 'LLP Act', 'Business Correspondence', 'Company Law Basics']
        },
        {
            name: 'Business Mathematics & Statistics',
            icon: 'fa-chart-line',
            description: 'Master mathematical concepts and statistical tools essential for business decision-making.',
            topics: ['Ratio & Proportion', 'Indices', 'Permutation & Combination', 'Measures of Central Tendency', 'Probability']
        },
        {
            name: 'Business Economics',
            icon: 'fa-coins',
            description: 'Grasp economic theories and their application in business environments.',
            topics: ['Demand & Supply', 'Money & Banking', 'Business Cycles', 'Indian Economy', 'Public Finance']
        }
    ];

    const features = [
        { icon: 'fa-video', title: 'Live Classes', desc: 'Interactive sessions with expert mentors' },
        { icon: 'fa-book-reader', title: 'Study Material', desc: 'Comprehensive notes and summaries' },
        { icon: 'fa-clipboard-check', title: 'Mock Tests', desc: 'Regular practice tests with analysis' },
        { icon: 'fa-comments', title: 'Doubt Sessions', desc: '24/7 doubt solving support' },
        { icon: 'fa-users', title: 'Group Study', desc: 'Collaborative learning environment' },
        { icon: 'fa-chart-bar', title: 'Progress Tracking', desc: 'Detailed performance analytics' }
    ];

    return (
        <>
            {showEnrollForm && (
                <EnrollmentForm
                    course="CA Foundation"
                    onClose={() => setShowEnrollForm(false)}
                />
            )}

            {/* Hero Section */}
            <div className="position-relative" style={{ background: 'linear-gradient(135deg, #151370 0%, #1e1b4b 50%, #312e81 100%)', padding: '80px 0' }}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 text-white">
                            <span className="badge bg-warning text-dark mb-3 px-3 py-2">
                                <i className="fa fa-star me-1"></i>Entry Level
                            </span>
                            <h1 className="display-4 fw-bold mb-4">CA Foundation</h1>
                            <p className="lead mb-4">
                                Begin your Chartered Accountancy journey with a strong foundation.
                                Our comprehensive program covers all four papers with expert guidance.
                            </p>
                            <div className="d-flex gap-3 flex-wrap mb-4">
                                <div className="d-flex align-items-center">
                                    <i className="fa fa-clock me-2"></i>
                                    <span>4 Papers</span>
                                </div>
                                <div className="d-flex align-items-center">
                                    <i className="fa fa-calendar me-2"></i>
                                    <span>4 Months Program</span>
                                </div>
                                <div className="d-flex align-items-center">
                                    <i className="fa fa-users me-2"></i>
                                    <span>1000+ Students</span>
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
                                alt="CA Foundation"
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
                    <div className="text-center mb-5">
                        <h6 className="text-primary text-uppercase">What We Offer</h6>
                        <h2>Why Choose FirstAttempt?</h2>
                    </div>
                    <div className="row g-4">
                        {features.map((feature, index) => (
                            <div key={index} className="col-lg-4 col-md-6">
                                <div className="card h-100 border-0 shadow-sm text-center p-4" style={{ borderRadius: '15px' }}>
                                    <div
                                        className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                                        style={{ width: '70px', height: '70px', background: 'linear-gradient(135deg, #151370, #312e81)' }}
                                    >
                                        <i className={`fa ${feature.icon} text-white fa-lg`}></i>
                                    </div>
                                    <h5>{feature.title}</h5>
                                    <p className="text-muted mb-0">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Subjects Section */}
            <div className="py-5">
                <div className="container">
                    <div className="text-center mb-5">
                        <h6 className="text-primary text-uppercase">Curriculum</h6>
                        <h2>Four Papers to Master</h2>
                    </div>
                    <div className="row g-4">
                        {subjects.map((subject, index) => (
                            <div key={index} className="col-lg-6">
                                <div className="card h-100 border-0 shadow" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                                    <div className="card-body p-4">
                                        <div className="d-flex align-items-center mb-3">
                                            <div
                                                className="rounded-circle me-3 d-flex align-items-center justify-content-center"
                                                style={{ width: '50px', height: '50px', backgroundColor: '#151370' }}
                                            >
                                                <i className={`fa ${subject.icon} text-white`}></i>
                                            </div>
                                            <div>
                                                <span className="badge bg-primary mb-1">Paper {index + 1}</span>
                                                <h5 className="mb-0">{subject.name}</h5>
                                            </div>
                                        </div>
                                        <p className="text-muted">{subject.description}</p>
                                        <div className="d-flex flex-wrap gap-2">
                                            {subject.topics.map((topic, i) => (
                                                <span key={i} className="badge bg-light text-dark px-3 py-2">
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
            <div className="py-5" style={{ background: 'linear-gradient(135deg, #151370, #1e1b4b)' }}>
                <div className="container text-center">
                    <h2 className="text-white mb-3">Ready to Start Your CA Journey?</h2>
                    <p className="text-white-50 mb-4">Join thousands of students who cleared CA Foundation with FirstAttempt</p>
                    <button onClick={() => setShowEnrollForm(true)} className="btn btn-warning btn-lg px-5">
                        <i className="fa fa-graduation-cap me-2"></i>Join Now - It's Free to Start!
                    </button>
                </div>
            </div>
        </>
    );
};

export default CAFoundation;
