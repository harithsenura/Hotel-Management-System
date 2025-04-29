import React, { useState, useEffect } from 'react';
import './User.css';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch user data without sending an Authorization token
        fetch('http://localhost:5000/api/users/allusers', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            return response.json();
        })
        .then((data) => {
            setUsers(data); // Set the users state with the fetched data
        })
        .catch((err) => {
            setError('Error fetching user data'); // Handle any fetch errors
            console.error('Error:', err);
        });
    }, []); // Empty dependency array means it runs only once on mount

    return (
        <div className="user-list-container">
            <h1>User List</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <table className="user-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Admin Status</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan="4">No users found</td>
                        </tr>
                    ) : (
                        users.map((user) => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.address}</td>
                                <td>{user.isAdmin ? 'Yes' : 'No'}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;
