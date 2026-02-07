import { Link } from 'react-router-dom';

const About = () => {
    return (
        <>
            {/* Header */}
            <div className="container-fluid bg-primary py-5 mb-5 page-header">
                <div className="container py-5">
                    <div className="row justify-content-center">
                        <div className="col-lg-10 text-center">
                            <h1 className="display-3 text-white">About Us</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* About Section */}
            <div className="container-xxl py-5">
                <div className="container">
                    <div className="row g-5">
                        <div className="col-lg-6" style={{ minHeight: '400px' }}>
                            <div className="position-relative h-100">
                                <img
                                    className="img-fluid position-absolute w-100 h-100"
                                    src="/images/about-us.png"
                                    alt="About FirstAttempt"
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <h6 className="section-title bg-white text-start text-primary pe-3">About Us</h6>
                            <h1 className="mb-4">Welcome to FirstAttempt</h1>
                            <p className="mb-4">
                                Welcome to First Attempt! We help CA Foundation and CA Inter students succeed. Our
                                mentoring sessions feature top rankers and experienced seniors who provide one-on-one guidance
                                and group discussions. We also offer test series to prepare you for exams.
                            </p>
                            <p className="mb-4">
                                Our goal is to create a supportive, family-like environment. We believe that proper
                                planning, along with academic knowledge, is essential for success. Let us guide you with
                                effective planning and continuous support.
                            </p>
                            <div className="row gy-2 gx-4 mb-4">
                                <div className="col-sm-6">
                                    <p className="mb-0"><i className="fa fa-arrow-right text-primary me-2"></i>Skilled Instructors</p>
                                </div>
                                <div className="col-sm-6">
                                    <p className="mb-0"><i className="fa fa-arrow-right text-primary me-2"></i>Online Sessions</p>
                                </div>
                                <div className="col-sm-6">
                                    <p className="mb-0"><i className="fa fa-arrow-right text-primary me-2"></i>Group discussions</p>
                                </div>
                                <div className="col-sm-6">
                                    <p className="mb-0"><i className="fa fa-arrow-right text-primary me-2"></i>Friendly Environment</p>
                                </div>
                                <div className="col-sm-6">
                                    <p className="mb-0"><i className="fa fa-arrow-right text-primary me-2"></i>1:1 mentorship</p>
                                </div>
                                <div className="col-sm-6">
                                    <p className="mb-0"><i className="fa fa-arrow-right text-primary me-2"></i>24×7 doubt solving</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Services Section */}
            <div className="container-xxl py-5">
                <div className="container">
                    <div className="text-center">
                        <h6 className="section-title bg-white text-center text-primary px-3">Services</h6>
                        <h1 className="mb-5">OUR SERVICES</h1>
                    </div>
                    <div className="row g-4">
                        <div className="col-lg-3 col-sm-6">
                            <div className="service-item text-center pt-3">
                                <div className="p-4">
                                    <i className="fa fa-3x fa-graduation-cap text-primary mb-4"></i>
                                    <h5 className="mb-3">Expert Mentorship</h5>
                                    <p>Learn from top CA rankers with personalized guidance and proven strategies.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-sm-6">
                            <div className="service-item text-center pt-3">
                                <div className="p-4">
                                    <i className="fa fa-3x fa-globe text-primary mb-4"></i>
                                    <h5 className="mb-3">Test Series</h5>
                                    <p>Comprehensive test series that simulates real exam environment.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-sm-6">
                            <div className="service-item text-center pt-3">
                                <div className="p-4">
                                    <i className="fa fa-3x fa-users text-primary mb-4"></i>
                                    <h5 className="mb-3">Supportive Community</h5>
                                    <p>A nurturing environment that feels like a close-knit family.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-sm-6">
                            <div className="service-item text-center pt-3">
                                <div className="p-4">
                                    <i className="fa fa-3x fa-book-open text-primary mb-4"></i>
                                    <h5 className="mb-3">Personalized Plans</h5>
                                    <p>Study plans tailored to your strengths and weaknesses.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div className="container-xxl py-5">
                <div className="container">
                    <div className="text-center">
                        <h6 className="section-title bg-white text-center text-primary px-3">TEAM</h6>
                        <h1 className="mb-5">OUR TEAMS</h1>
                    </div>
                    <div className="row g-4">
                        <div className="col-lg-3 col-md-6">
                            <div className="team-item bg-light">
                                <div className="overflow-hidden">
                                    <img className="img-fluid" src="/images/rajlaxmi.jpeg" alt="Raj Laxmi" />
                                </div>
                                <div className="text-center p-4">
                                    <h5 className="mb-0">RAJ LAXMI</h5>
                                    <span className="badge bg-primary">Founder</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="team-item bg-light">
                                <div className="overflow-hidden">
                                    <img className="img-fluid" src="/images/awantika.jpg" alt="Awantika" />
                                </div>
                                <div className="text-center p-4">
                                    <h5 className="mb-0">AWANTIKA</h5>
                                    <span className="badge bg-primary">Co-founder</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="team-item bg-light">
                                <div className="overflow-hidden">
                                    <img className="img-fluid" src="/images/abhijeet.jpg" alt="Abhijeet" />
                                </div>
                                <div className="text-center p-4">
                                    <h5 className="mb-0">ABHIJEET KUMAR</h5>
                                    <span className="badge bg-primary">Developer</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="team-item bg-light">
                                <div className="overflow-hidden">
                                    <img className="img-fluid" src="/images/prince.jpg" alt="Prince" />
                                </div>
                                <div className="text-center p-4">
                                    <h5 className="mb-0">PRINCE RAJ</h5>
                                    <span className="badge bg-primary">Developer</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="container-xxl py-5">
                <div className="container">
                    <div className="text-center">
                        <h6 className="section-title bg-white text-center text-primary px-3">FAQs</h6>
                        <h1 className="mb-5">Frequently Asked Questions</h1>
                    </div>
                    <div className="accordion" id="faqAccordion">
                        <div className="accordion-item">
                            <h2 className="accordion-header">
                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                                    Why should I choose FirstAttempt for my CA exam preparation?
                                </button>
                            </h2>
                            <div id="faq1" className="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                                <div className="accordion-body">
                                    FirstAttempt offers expert-led mentoring, personalized study plans, and a supportive community that ensures comprehensive preparation and success in CA exams.
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                                    How does FirstAttempt provide personalized guidance?
                                </button>
                            </h2>
                            <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                <div className="accordion-body">
                                    We offer 1:1 mentoring sessions with experienced CA professionals who tailor study plans to your strengths and weaknesses, ensuring effective preparation.
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                                    Do you provide regular feedback on my progress?
                                </button>
                            </h2>
                            <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                <div className="accordion-body">
                                    Yes, we offer regular feedback through mock exams and assessments to track your progress and improve your performance.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default About;
