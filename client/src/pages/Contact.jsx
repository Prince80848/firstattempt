import { Link } from 'react-router-dom';

const Contact = () => {
    return (
        <>
            {/* Header */}
            <div className="container-fluid bg-primary py-5 mb-5 page-header">
                <div className="container py-5">
                    <div className="row justify-content-center">
                        <div className="col-lg-10 text-center">
                            <h1 className="display-3 text-white">Contact Us</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Section */}
            <div className="container-xxl py-5">
                <div className="container">
                    <div className="row g-5">
                        <div className="col-lg-5">
                            <div className="bg-primary text-white rounded p-5 h-100">
                                <h3 className="mb-4">Contact Information</h3>
                                <p className="mb-4">For any query, feel free to reach out to us!</p>

                                <div className="mb-4">
                                    <i className="fa fa-phone-alt me-3"></i>
                                    <span>9931278403</span>
                                </div>

                                <div className="mb-4">
                                    <i className="fa fa-envelope me-3"></i>
                                    <span>firstattempthelp@gmail.com</span>
                                </div>

                                <div className="d-flex pt-4">
                                    <a className="btn btn-outline-light btn-social me-2" href="https://www.instagram.com/firstattempt.24">
                                        <i className="fab fa-instagram"></i>
                                    </a>
                                    <a className="btn btn-outline-light btn-social me-2" href="https://lnkd.in/g36qfjsZ">
                                        <i className="fab fa-telegram"></i>
                                    </a>
                                    <a className="btn btn-outline-light btn-social me-2" href="https://www.youtube.com/@FirstAttempt24">
                                        <i className="fab fa-youtube"></i>
                                    </a>
                                    <a className="btn btn-outline-light btn-social me-2" href="https://www.linkedin.com/company/firstattempt24/">
                                        <i className="fab fa-linkedin-in"></i>
                                    </a>
                                    <a className="btn btn-outline-light btn-social" href="https://chat.whatsapp.com/IZN2HIylyYG93hqpyJ2pMI">
                                        <i className="fab fa-whatsapp"></i>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-7">
                            <div className="bg-light rounded p-5">
                                <h3 className="mb-4">Send us a Message</h3>
                                <form>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <div className="form-floating">
                                                <input type="text" className="form-control" id="name" placeholder="Your Name" />
                                                <label htmlFor="name">Your Name</label>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-floating">
                                                <input type="email" className="form-control" id="email" placeholder="Your Email" />
                                                <label htmlFor="email">Your Email</label>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-floating">
                                                <input type="tel" className="form-control" id="phone" placeholder="Phone Number" />
                                                <label htmlFor="phone">Phone Number</label>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-floating">
                                                <textarea className="form-control" placeholder="Message" id="message" style={{ height: '150px' }}></textarea>
                                                <label htmlFor="message">Message</label>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <button className="btn btn-primary w-100 py-3" type="submit">
                                                <i className="fa fa-paper-plane me-2"></i>Send Message
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Contact;
