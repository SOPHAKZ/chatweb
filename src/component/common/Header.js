import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Common.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

export default function Header()
{
    const navigate = useNavigate();

    const handleLogout = () =>
    {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#004466' }}>
            <div className="container-fluid">
                <Link to="/" className="navbar-brand d-flex align-items-center">
                    <img
                        src="https://www.acledabank.com.kh/kh/assets/layout/logo3.png"
                        alt="Acleda Logo"
                        className="logo-img"
                        style={{ height: '40px' }} // Adjust logo size as needed
                    />
                    <span className="ms-2 text-white">Student Management</span>
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    {/* For larger screens */}
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-none d-lg-flex">
                        <li className="nav-item">
                            <Link className="nav-link text-white" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-white" to="/chat">Chat</Link>
                        </li>
                        <li className="nav-item">
                            <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
                        </li>
                    </ul>
                    {/* For smaller screens */}
                    <ul className="navbar-nav ms-auto d-lg-none">
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle text-white" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Menu
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><Link className="dropdown-item" to="/">Home</Link></li>
                                <li><Link className="dropdown-item" to="/chat">Chat</Link></li>
                                <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
