import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "./common/Loader";
import "./css/Student.css";

const StudentView = () =>
{
    const [student, setStudent] = useState({ name: '', age: '' });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Start loading state
    const { id } = useParams();
    const navigate = useNavigate();
    const getUserApi = "http://157.245.205.230:8080/api/v1/user"; // Corrected API endpoint

    useEffect(() =>
    {
        const fetchStudent = async () =>
        {
            try
            {
                const token = localStorage.getItem('token');
                console.log("LIST :" + token)
                if (!token)
                {
                    navigate('/')
                }
                const response = await axios.get(`${getUserApi}/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                setStudent(response.data.data);
            } catch (err)
            {
                setError('Error fetching student data.');
                console.error('Error fetching student data:', err);
            } finally
            {
                setIsLoading(false); // End loading state
            }
        };

        fetchStudent();
    }, [id]);

    return (
        <div className="user-form">
            <div className="heading">
                {isLoading && <Loader />}
                {error && <p className="text-danger">Error: {error}</p>}
                <h2>View Student</h2>
            </div>
            <form>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                        Name
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={student.username}
                        readOnly
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
                        readOnly
                    />
                </div>

                <button
                    type="button"
                    className="btn btn-primary submit-btn"
                    onClick={() => navigate('/')} // Redirect on button click
                >
                    Back to List
                </button>
            </form>
        </div>
    );
};

export default StudentView;
