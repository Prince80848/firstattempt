import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import EnrollmentForm from '../components/EnrollmentForm';

const Home = () => {
    const [banners, setBanners] = useState([
        { courseType: 'CA Foundation', imageUrl: '/images/arambh-foundation.png', link: '/ca-foundation' },
        { courseType: 'CA Inter', imageUrl: '/images/arambh-inter.png', link: '/ca-inter' },
        { courseType: 'CA Final', imageUrl: '/images/arambh-final.jpg', link: '/ca-final' }
    ]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [showEnrollForm, setShowEnrollForm] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState('');

    useEffect(() => {
        // Fetch banners from API
        const fetchBanners = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/banners');
                console.log('Banners received:', response.data);
                if (response.data && response.data.length > 0) {
                    const updatedBanners = response.data.map(b => ({
                        ...b,
                        link: b.courseType === 'CA Foundation' ? '/ca-foundation' :
                            b.courseType === 'CA Inter' ? '/ca-inter' : '/ca-final'
                    }));
                    setBanners(updatedBanners);
                }
            } catch (error) {
                console.log('Using default banners:', error);
            }
        };
        fetchBanners();
    }, []);

    useEffect(() => {
        // Auto-slide every 4 seconds
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % banners.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [banners.length]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    };

    const handleEnroll = (course) => {
        setSelectedCourse(course);
        setShowEnrollForm(true);
    };

    return (
        <>
            {showEnrollForm && (
                <EnrollmentForm
                    course={selectedCourse}
                    onClose={() => setShowEnrollForm(false)}
                />
            )}

            {/* Carousel Section - Full Flyer Display, No Gap on Mobile */}
            <div className="carousel-wrapper">
                <style>{`
                    .carousel-wrapper {
                        background: linear-gradient(135deg, #151370 0%, #1e1b4b 100%);
                        padding: 0;
                        margin: 0;
                    }
                    @media (min-width: 768px) {
                        .carousel-wrapper {
                            padding: 30px 40px;
                        }
                        .carousel-inner-container {
                            border-radius: 20px;
                            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                        }
                    }
                    .carousel-image {
                        width: 100%;
                        height: auto;
                        display: block;
                        object-fit: contain;
                    }
                `}</style>
                <div
                    className="position-relative carousel-inner-container"
                    style={{ overflow: 'hidden' }}
                >
                    {/* Slides Container */}
                    <div
                        style={{
                            display: 'flex',
                            transform: `translateX(-${currentSlide * 100}%)`,
                            transition: 'transform 0.5s ease-in-out',
                            width: '100%'
                        }}
                    >
                        {banners.map((banner, index) => (
                            <Link
                                key={index}
                                to={banner.link}
                                style={{
                                    minWidth: '100%',
                                    width: '100%',
                                    flexShrink: 0,
                                    display: 'block'
                                }}
                            >
                                <img
                                    src={banner.imageUrl}
                                    alt={banner.courseType}
                                    className="carousel-image"
                                    onError={(e) => {
                                        console.log('Image load error for:', banner.imageUrl);
                                        // Fallback to default image based on course type
                                        if (banner.courseType === 'CA Foundation') {
                                            e.target.src = '/images/arambh-foundation.png';
                                        } else if (banner.courseType === 'CA Inter') {
                                            e.target.src = '/images/arambh-inter.png';
                                        } else {
                                            e.target.src = '/images/arambh-final.jpg';
                                        }
                                    }}
                                />
                            </Link>
                        ))}
                    </div>

                    {/* Indicators */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '20px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'flex',
                            gap: '10px',
                            zIndex: 10
                        }}
                    >
                        {banners.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                style={{
                                    width: '14px',
                                    height: '14px',
                                    borderRadius: '50%',
                                    border: 'none',
                                    background: currentSlide === index ? '#06BBCC' : 'rgba(255,255,255,0.7)',
                                    cursor: 'pointer',
                                    transition: 'background 0.3s'
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* View Details & Enroll Section Below Carousel */}
                <div
                    className="d-flex justify-content-center align-items-center gap-3 flex-wrap py-3"
                    style={{ background: 'rgba(0,0,0,0.2)' }}
                >
                    <span style={{ color: '#ffd700', fontWeight: '600', fontSize: '16px' }}>
                        <i className="fa fa-graduation-cap me-2"></i>
                        {banners[currentSlide]?.courseType || 'CA Course'}
                    </span>
                    <Link
                        to={banners[currentSlide]?.link || '/ca-foundation'}
                        className="btn btn-outline-light btn-sm px-4"
                        style={{ borderRadius: '20px' }}
                    >
                        <i className="fa fa-info-circle me-2"></i>View Details
                    </Link>
                    <button
                        onClick={() => handleEnroll(banners[currentSlide]?.courseType || 'CA Foundation')}
                        className="btn btn-warning btn-sm px-4"
                        style={{ borderRadius: '20px', fontWeight: '600' }}
                    >
                        <i className="fa fa-rocket me-2"></i>Enroll Now
                    </button>
                </div>
            </div>
            {/* Services Section */}
            <div className="container-xxl py-5">
                <div className="container">
                    <div className="row g-4">
                        <div className="col-lg-3 col-sm-6">
                            <div className="service-item text-center pt-3">
                                <div className="p-4">
                                    <i className="fa fa-3x fa-graduation-cap text-primary mb-4"></i>
                                    <h5 className="mb-3">Skilled Mentors</h5>
                                    <p>Access expert guidance anytime with our convenient online sessions.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-sm-6">
                            <div className="service-item text-center pt-3">
                                <div className="p-4">
                                    <i className="fa fa-3x fa-globe text-primary mb-4"></i>
                                    <h5 className="mb-3">Test Series</h5>
                                    <p>Practice with our comprehensive test series to simulate real exam conditions.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-sm-6">
                            <div className="service-item text-center pt-3">
                                <div className="p-4">
                                    <i className="fa fa-3x fa-home text-primary mb-4"></i>
                                    <h5 className="mb-3">Doubt Solving</h5>
                                    <p>Get timely answers to your questions and clear your doubts effectively.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-sm-6">
                            <div className="service-item text-center pt-3">
                                <div className="p-4">
                                    <i className="fa fa-3x fa-book-open text-primary mb-4"></i>
                                    <h5 className="mb-3">1:1 Mentorship</h5>
                                    <p>Get personalized guidance to address your unique strengths and weaknesses.</p>
                                </div>
                            </div>
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
                            <Link to="/about" className="btn btn-primary py-3 px-5 mt-2">Read More</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Courses Section - Buttons Below Image, Not Overlapping */}
            <div id="popularcourses">
                <div className="container-xxl py-5">
                    <div className="container">
                        <div className="text-center">
                            <h6 className="section-title bg-white text-center text-primary px-3">Courses</h6>
                            <h1 className="mb-5">Popular Courses</h1>
                        </div>
                        <div className="row g-4 justify-content-center">
                            {/* CA Foundation */}
                            <div className="col-lg-4 col-md-6">
                                <div className="course-item bg-light rounded-3 overflow-hidden shadow-sm h-100">
                                    <div className="overflow-hidden">
                                        <img
                                            className="img-fluid w-100"
                                            src="/images/arambh-foundation.png"
                                            alt="CA Foundation"
                                            style={{ height: '220px', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div className="p-4 text-center">
                                        <h5 className="mb-3">CA Foundation</h5>
                                        <p className="text-muted mb-4">
                                            The CA Foundation Course, the entry-level exam for aspiring chartered accountants under ICAI.
                                        </p>
                                        <div className="d-flex justify-content-center gap-2">
                                            <Link to="/ca-foundation" className="btn btn-outline-primary px-4">
                                                <i className="fa fa-info-circle me-2"></i>View Details
                                            </Link>
                                            <button
                                                onClick={() => handleEnroll('CA Foundation')}
                                                className="btn btn-primary px-4"
                                            >
                                                <i className="fa fa-rocket me-2"></i>Enroll
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* CA Inter */}
                            <div className="col-lg-4 col-md-6">
                                <div className="course-item bg-light rounded-3 overflow-hidden shadow-sm h-100">
                                    <div className="overflow-hidden">
                                        <img
                                            className="img-fluid w-100"
                                            src="/images/arambh-inter.png"
                                            alt="CA Inter"
                                            style={{ height: '220px', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div className="p-4 text-center">
                                        <h5 className="mb-3">CA Intermediate</h5>
                                        <p className="text-muted mb-4">
                                            CA Intermediate is the second level exam in India's Chartered Accountancy course.
                                        </p>
                                        <div className="d-flex justify-content-center gap-2">
                                            <Link to="/ca-inter" className="btn btn-outline-primary px-4">
                                                <i className="fa fa-info-circle me-2"></i>View Details
                                            </Link>
                                            <button
                                                onClick={() => handleEnroll('CA Inter')}
                                                className="btn btn-primary px-4"
                                            >
                                                <i className="fa fa-rocket me-2"></i>Enroll
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* CA Final */}
                            <div className="col-lg-4 col-md-6">
                                <div className="course-item bg-light rounded-3 overflow-hidden shadow-sm h-100">
                                    <div className="overflow-hidden">
                                        <img
                                            className="img-fluid w-100"
                                            src="/images/arambh-final.jpg"
                                            alt="CA Final"
                                            style={{ height: '220px', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div className="p-4 text-center">
                                        <h5 className="mb-3">CA Final</h5>
                                        <p className="text-muted mb-4">
                                            The CA Final is the concluding phase of the Chartered Accountancy journey.
                                        </p>
                                        <div className="d-flex justify-content-center gap-2">
                                            <Link to="/ca-final" className="btn btn-outline-primary px-4">
                                                <i className="fa fa-info-circle me-2"></i>View Details
                                            </Link>
                                            <button
                                                onClick={() => handleEnroll('CA Final')}
                                                className="btn btn-primary px-4"
                                            >
                                                <i className="fa fa-rocket me-2"></i>Enroll
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonials Section */}
            <div className="container-xxl py-5">
                <div className="container">
                    <div className="text-center">
                        <h6 className="section-title bg-white text-center text-primary px-3">Testimonial</h6>
                        <h1 className="mb-5">Our Mentees Say!</h1>
                    </div>
                    <div className="row g-4">
                        <div className="col-lg-4">
                            <div className="testimonial-item text-center">
                                <img className="border rounded-circle p-2 mx-auto mb-3" src="/images/user.png" style={{ width: '80px', height: '80px' }} alt="Testimonial" />
                                <h5 className="mb-0">Ankush</h5>
                                <p>CA Foundation</p>
                                <div className="testimonial-text bg-light text-center p-4">
                                    <p className="mb-0">
                                        I was about to give up, but after talking to the mentors, I cleared CA Foundation in my 5th attempt.
                                        These sessions helped me a lot. Overall, it was my best decision to join their batch!
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="testimonial-item text-center">
                                <img className="border rounded-circle p-2 mx-auto mb-3" src="/images/user.png" style={{ width: '80px', height: '80px' }} alt="Testimonial" />
                                <h5 className="mb-0">Gagan Raiker</h5>
                                <p>CA Foundation</p>
                                <div className="testimonial-text bg-light text-center p-4">
                                    <p className="mb-0">
                                        This mentorship program was really helpful. Awantika's advice on daily writing practice and tips
                                        from CA toppers were invaluable. The free test series was great!
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="testimonial-item text-center">
                                <img className="border rounded-circle p-2 mx-auto mb-3" src="/images/user.png" style={{ width: '80px', height: '80px' }} alt="Testimonial" />
                                <h5 className="mb-0">Palak Agrawal</h5>
                                <p>CA Foundation</p>
                                <div className="testimonial-text bg-light text-center p-4">
                                    <p className="mb-0">
                                        Yes the session was very helpful and it was motivating. It provided many important points which
                                        will help in acing our exams. Thank you so much!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
