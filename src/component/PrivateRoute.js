import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element }) =>
{
    const authToken = localStorage.getItem('token');

    const isAuthenticated = authToken; // Check if token exists and is not expired

    if (!isAuthenticated)
    {
        return <Navigate to="/login" />;
    }

    return element;
};

export default PrivateRoute;
