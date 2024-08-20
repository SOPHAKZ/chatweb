import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Loader from './common/Loader'; // Ensure you have this component

const AddStudent = () =>
{
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        setIsLoading(true); // Start loading state
        setError(''); // Clear any previous errors
        try
        {
            const username = localStorage.getItem('username');
            const password = localStorage.getItem('password');
            await axios.post(
                'http://157.245.205.230:8080/api/v1/student/',
                { name, age },
                {
                    auth: {
                        username: username,
                        password: password,
                    }
                }
            );
            navigate('/');
        } catch (error)
        {
            setError('Error adding student. Please try again.'); // Set error message
            console.error('Error adding student:', error);
        } finally
        {
            setIsLoading(false); // End loading state
        }
    };

    const handleInput = (e) =>
    {
        const { name, value } = e.target;
        if (name === 'name')
        {
            setName(value);
        } else if (name === 'age')
        {
            setAge(value);
        }
    };

    return (
        <div className="user-form">
            <div className="heading mb-4 text-center">
                {isLoading && <Loader />}
                {error && <div className="alert alert-danger">{error}</div>}
                <h2>Add Student</h2>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                        Name
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={name}
                        onChange={handleInput}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="age" className="form-label">
                        Age
                    </label>
                    <input
                        type="number"
                        className="form-control"
                        id="age"
                        name="age"
                        value={age}
                        onChange={handleInput}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary submit-btn" disabled={isLoading}>
                    {isLoading ? 'Adding...' : 'Add Student'}
                </button>
            </form>
        </div>
    );
};

export default AddStudent;
