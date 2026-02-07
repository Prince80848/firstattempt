import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useRef } from 'react';

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const navbarCollapseRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Close hamburger menu when clicking on a nav link
    const closeNavbar = () => {
        const navbarCollapse = navbarCollapseRef.current;
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            navbarCollapse.classList.remove('show');
        }
    };

    // Close navbar when route changes
    useEffect(() => {
        closeNavbar();
    }, [location]);

    return (
        <>
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg bg-white navbar-light shadow sticky-top p-0">
                <Link to="/" className="navbar-brand d-flex align-items-center px-4 px-lg-5">
                    <img width="70" src="/images/logo.jpeg" alt="FirstAttempt Logo" />
                    <h2 style={{ color: '#151370' }}><small>FirstAttempt</small></h2>
                </Link>

                <button
                    type="button"
                    className="navbar-toggler me-4"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarCollapse"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarCollapse" ref={navbarCollapseRef}>
                    <div className="navbar-nav ms-auto p-4 p-lg-0">
                        <Link to="/" className="nav-item nav-link" onClick={closeNavbar}>Home</Link>
                        <Link to="/about" className="nav-item nav-link" onClick={closeNavbar}>About</Link>

                        <div className="nav-item dropdown">
                            <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                                Courses
                            </a>
                            <div className="dropdown-menu fade-down m-0">
                                <Link to="/ca-foundation" className="dropdown-item" onClick={closeNavbar}>CA Foundation</Link>
                                <Link to="/ca-inter" className="dropdown-item" onClick={closeNavbar}>CA Inter</Link>
                                <Link to="/ca-final" className="dropdown-item" onClick={closeNavbar}>CA Final</Link>
                            </div>
                        </div>

                        <Link to="/test-series" className="nav-item nav-link" onClick={closeNavbar}>Test Series</Link>
                        <Link to="/contact" className="nav-item nav-link" onClick={closeNavbar}>Contact</Link>

                        {user && isAdmin && (
                            <Link to="/dashboard" className="nav-item nav-link" onClick={closeNavbar}>Dashboard</Link>
                        )}
                    </div>

                    {user ? (
                        <div className="dropdown d-none d-lg-block">
                            <button
                                className="btn py-4 px-lg-4 d-flex align-items-center gap-2"
                                type="button"
                                data-bs-toggle="dropdown"
                                style={{ backgroundColor: '#151370', color: 'white' }}
                            >
                                <div
                                    className="rounded-circle bg-white d-flex align-items-center justify-content-center overflow-hidden"
                                    style={{ width: '35px', height: '35px', color: '#151370' }}
                                >
                                    {user.profilePic ? (
                                        <img src={user.profilePic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <i className="fa fa-user"></i>
                                    )}
                                </div>
                                <span>{user.name}</span>
                                <i className="fa fa-chevron-down ms-1" style={{ fontSize: '12px' }}></i>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end shadow" style={{ borderRadius: '10px', border: 'none', marginTop: '0' }}>
                                <li className="px-3 py-2 border-bottom">
                                    <div className="d-flex align-items-center">
                                        <div
                                            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2 overflow-hidden"
                                            style={{ width: '40px', height: '40px' }}
                                        >
                                            {user.profilePic ? (
                                                <img src={user.profilePic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <i className="fa fa-user"></i>
                                            )}
                                        </div>
                                        <div>
                                            <strong className="d-block">{user.name}</strong>
                                            <small className="text-muted">{user.email}</small>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <Link className="dropdown-item py-2" to="/profile">
                                        <i className="fa fa-user-circle text-primary me-2"></i>My Profile
                                    </Link>
                                </li>
                                {isAdmin && (
                                    <li>
                                        <Link className="dropdown-item py-2" to="/dashboard">
                                            <i className="fa fa-tachometer-alt text-success me-2"></i>Dashboard
                                        </Link>
                                    </li>
                                )}
                                {(user.role === 'mentor' || isAdmin) && (
                                    <li>
                                        <Link className="dropdown-item py-2" to="/mentor">
                                            <i className="fa fa-chalkboard-teacher text-info me-2"></i>Mentor Panel
                                        </Link>
                                    </li>
                                )}
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <button className="dropdown-item py-2 text-danger" onClick={handleLogout}>
                                        <i className="fa fa-sign-out-alt me-2"></i>Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <Link to="/login" className="btn btn-primary py-4 px-lg-5 d-none d-lg-block">
                            Login<i className="fa fa-arrow-right ms-3"></i>
                        </Link>
                    )}

                    {/* Mobile User Menu */}
                    {user && (
                        <div className="d-lg-none p-4 pt-0">
                            <div className="d-flex align-items-center mb-3 p-3 bg-light rounded">
                                <div
                                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3 overflow-hidden"
                                    style={{ width: '50px', height: '50px' }}
                                >
                                    {user.profilePic ? (
                                        <img src={user.profilePic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <i className="fa fa-user fa-lg"></i>
                                    )}
                                </div>
                                <div>
                                    <strong className="d-block">{user.name}</strong>
                                    <small className="text-muted">{user.email}</small>
                                </div>
                            </div>
                            <Link to="/profile" className="btn btn-outline-primary w-100 mb-2" onClick={closeNavbar}>
                                <i className="fa fa-user-circle me-2"></i>My Profile
                            </Link>
                            {(user.role === 'mentor' || isAdmin) && (
                                <Link to="/mentor" className="btn btn-outline-info w-100 mb-2" onClick={closeNavbar}>
                                    <i className="fa fa-chalkboard-teacher me-2"></i>Mentor Panel
                                </Link>
                            )}
                            <button onClick={() => { handleLogout(); closeNavbar(); }} className="btn btn-outline-danger w-100">
                                <i className="fa fa-sign-out-alt me-2"></i>Logout
                            </button>
                        </div>
                    )}

                    {!user && (
                        <div className="d-lg-none p-4 pt-0">
                            <Link to="/login" className="btn btn-primary w-100" onClick={closeNavbar}>
                                <i className="fa fa-sign-in-alt me-2"></i>Login
                            </Link>
                        </div>
                    )}
                </div>
            </nav>
        </>
    );
};

export default Navbar;
