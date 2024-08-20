import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "./common/Loader";
import { Link, Navigate } from "react-router-dom";
const ListStudent = () =>
{

    const showUserApi = 'http://157.245.205.230:8080/api/v1/user/all-users'; // API endpoint
    const [students, setStudents] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1); // Start from page 1
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize] = useState(10);
    const [redirect, setRedirect] = useState(false); // State to handle redirection

    useEffect(() =>
    {
        const fetchStudents = async () =>
        {
            setIsLoading(true);
            try
            {
                const token = localStorage.getItem('token');
                console.log("LIST :" + token)
                if (!token)
                {
                    setRedirect(true);
                    return;
                }

                const response = await axios.get(showUserApi, {
                    params: {
                        page: currentPage - 1,
                        size: pageSize,
                        sortBy: 'id',
                        sortDir: 'DESC'
                    },
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }

                });
                // Log the full response to debug
                console.log("Full Response:", response);

                const { data } = response;
                if (data && data.data)
                {
                    const { content, pagination } = data.data;
                    if (content && pagination)
                    {
                        setStudents(content);
                        setTotalPages(pagination.totalPages);
                    } else
                    {
                        setError('Content or pagination is missing in the response');
                    }
                } else
                {
                    setError('Data field is missing in the response');
                }
            } catch (error)
            {
                setError(error.message);
            } finally
            {
                setIsLoading(false);
            }
        };

        fetchStudents();
    }, [currentPage, pageSize]);

    const handleDelete = async (id) =>
    {
        setIsLoading(true);
        try
        {
            const isConfirmed = window.confirm("Are you sure you want to delete this student?");
            if (isConfirmed)
            {
                const token = localStorage.getItem('token');
                const response = await fetch(`${'http://157.245.205.230:8080/api/v1/user/delete'}${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                });
                console.log(response);

                if (!response)
                {
                    throw new Error('Failed to delete student');
                }
                setStudents(students.filter((student) => student.id !== id));
            }
        } catch (error)
        {
            setError(error.message);
            console.error('Error deleting student:', error);
        } finally
        {
            setIsLoading(false);
        }
    };

    const handlePageChange = (newPage) =>
    {
        if (newPage >= 1 && newPage <= totalPages)
        {
            setCurrentPage(newPage); // Update current page
        }
    };

    if (redirect)
    {
        return <Navigate to="/login" />;
    }

    if (isLoading)
    {
        return <div className="text-center"><Loader /></div>;
    }

    if (error)
    {
        return <div className="text-center alert alert-danger" role="alert">{error}</div>;
    }

    return (
        <div className="container mt-5">
            {isLoading && <Loader />}
            <div className="d-flex justify-content-between align-items-center mb-4" style={{ maxWidth: '700px', margin: 'auto' }}>
                <h2 className="mb-0">List of Students</h2>
                <Link to="/add" className="btn btn-primary">
                    Add Student
                </Link>
            </div>
            <div className="table-responsive">
                <table className="table table-striped mx-auto" style={{ maxWidth: '700px' }}>
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Age</th>
                            <th scope="col">Role</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student.id}>
                                <th scope="row">{student.id}</th>
                                <td>{student.username}</td>
                                <td>{student.age}</td>
                                <td>{student.role}</td>

                                <td>
                                    <Link to={`/view/${student.id}`} className="btn btn-primary btn-sm me-2">
                                        <i aria-hidden="true"></i> View
                                    </Link>
                                    <Link to={`/edit/${student.id}`} className="btn btn-warning btn-sm me-2">
                                        <i aria-hidden="true"></i> Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(student.id)}
                                        className="btn btn-danger btn-sm"
                                    >
                                        <i className="" aria-hidden="true"></i> Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-4" style={{ maxWidth: '700px', margin: 'auto' }}>
                <button
                    className="btn btn-primary"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                    className="btn btn-primary"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ListStudent;
