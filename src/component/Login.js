

import React, { useState } from 'react';
import { MDBBtn, MDBContainer, MDBCard, MDBCardBody, MDBInput, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import './css/Student.css';

function Login()
{
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) =>
    {
        event.preventDefault();

        if (!username || !password)
        {
            setError('Please enter both username and password');
            return;
        }

        try
        {
            const response = await fetch('http://157.245.205.230:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            // Check if the response is successful
            if (response.ok)
            {
                const data = await response.json();
                const token = data.data.token;
                // const expiration = new Date().getTime() + 3600000; // Assuming 1 hour expiration
                localStorage.setItem('token', token);
                localStorage.setItem('username', username);
                console.log("TOKEN : " + token);
                // localStorage.setItem('tokenExpiration', expiration); // Store expiration time
                navigate('/');
            } else
            {
                const errorData = await response.json();
                setError(errorData.message || 'Login failed'); // Display error message from server
            }
        } catch (error)
        {
            if (error.response && error.response.status === 401)
            {
                setError('Unauthorized access - invalid token');
            } else
            {
                setError(error.message);
            }
        }
    };

    return (
        <MDBContainer fluid className='my-5'>
            <MDBRow className='g-0 align-items-center'>
                <MDBCol col='6'>
                    <MDBCard className='my-5 cascading-right' style={{ background: 'hsla(0, 0%, 100%, 0.55)', backdropFilter: 'blur(30px)' }}>
                        <MDBCardBody className='p-5 shadow-5 text-center'>
                            <h2 className="fw-bold mb-5">Login now</h2>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <MDBRow>
                                    <MDBCol col='6'>
                                        <MDBInput wrapperClass='mb-4' label='Username' id='form2' type='text' value={username} onChange={(e) => setUsername(e.target.value)} />
                                    </MDBCol>
                                </MDBRow>
                                <MDBInput wrapperClass='mb-4' label='Password' id='form4' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                                <button type="submit" className="btn btn-primary submit-login">
                                    Login
                                </button>
                            </form>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                <MDBCol col='6'>
                    <img src="https://www.acledabank.com.kh/kh/assets/layout/logo-white.png" className="w-100 rounded-4 shadow-4" alt="Logo" />
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
}

export default Login;
