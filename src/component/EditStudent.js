import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "./common/Loader";
import "./css/Student.css";

const EditUser = () =>
{
    const [student, setStudent] = useState({ username: '', age: '', role: '', password: '', });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const getUserApi = "http://localhost:8080/api/v1/user";

    useEffect(() =>
    {
        getStudent();
    }, []);

    const getStudent = async () =>
    {
        const token = localStorage.getItem('token');
        try
        {
            const response = await axios.get(`${getUserApi}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setStudent(response.data.data);
        } catch (err)
        {
            console.error("Error fetching student:", err);
            setError('Error fetching student data');
        }
    };

    const handleInput = (e) =>
    {
        const { name, value } = e.target;
        setStudent(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try
        {
            const token = localStorage.getItem('token');
            const response = await fetch(`${getUserApi}/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(student),
            });

            if (!response.ok)
            {
                throw new Error('Network response was not ok');
            }
            navigate('/');
        } catch (error)
        {
            setError(error.message);
        } finally
        {
            setIsLoading(false);
        }
    };

    return (
        <div className="user-form">
            <div className="heading">
                {isLoading && <Loader />}
                {error && <p className="text-danger">Error: {error}</p>}
                <p>Edit Form</p>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                        Name
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        name="username"
                        value={student.username}
                        onChange={handleInput}
                    />
                </div>
                <div className="mb-3 mt-3">
                    <label htmlFor="age" className="form-label">
                        Age
                    </label>
                    <input
                        type="number"
                        className="form-control"
                        id="age"
                        name="age"
                        value={student.age}
                        onChange={handleInput}
                    />
                </div>
                <div className="mb-3 mt-3">
                    <label htmlFor="age" className="form-label">
                        Role
                    </label>
                    <input
                        type="string"
                        className="form-control"
                        id="role"
                        name="role"
                        value={student.role}
                        onChange={handleInput}
                    />
                </div>

                <button type="submit" className="btn btn-primary submit-btn">
                    EDIT
                </button>
            </form>
        </div>
    );
};

export default EditUser;
