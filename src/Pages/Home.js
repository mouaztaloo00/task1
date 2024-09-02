import React, { useEffect, useState } from 'react';
import axios from "axios";
import DataTable from 'react-data-table-component';
import { Modal, Box, TextField, Button, LinearProgress, Alert } from '@mui/material';

export default function Home() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [runUseEffect, setRun] = useState(0);
    const [username, setUsername] = useState('');
    const [registerDate, setRegisterDate] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const url = `${process.env.REACT_APP_API_BASE_URL}/users`;

    useEffect(() => {
        fetchData();
    }, [runUseEffect]);

    const fetchData = async () => {
        setLoading(true);
        try {
            console.log("Fetching data from API...");
            const response = await axios.get(url);
            setData(response.data);
        } catch (error) {
            console.error("Error fetching data", error);
            setErrorMessage('Failed to fetch data.');
        } finally {
            setLoading(false);
        }
    };

    async function deleteUser(id) {
        try {
            console.log(`Sending request to delete user with ID: ${id}`);
            const res = await axios.delete(`${url}/${id}`);
            if (res.status === 200) {
                setRun((prev) => prev + 1);
                setSuccessMessage('User deleted successfully.');
                setErrorMessage('');
            }
        } catch (error) {
            console.error("Deletion failed", error);
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('Failed to delete user.');
            }
            setSuccessMessage('');
        }
    }

    async function deleteUsersByDateRange() {
        try {
            console.log(`Sending request to delete users from ${startDate} to ${endDate}`);
            const res = await axios.delete(`${url}/registered-between?startDate=${startDate}&endDate=${endDate}`);
            if (res.status === 200) {
                setRun((prev) => prev + 1);
                setSuccessMessage('Users deleted successfully within the date range.');
                setErrorMessage('');
            }
        } catch (error) {
            console.error("Bulk deletion failed", error);
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('Failed to delete users within the date range.');
            }
            setSuccessMessage('');
        }
    }

    async function updateUser() {
        try {
            console.log(`Sending request to update user with ID: ${editingUser.id}`);
            const res = await axios.put(`${url}/${editingUser.id}`, {
                username: editingUser.username,
                email: editingUser.email,
            });

            if (res.status === 200) {
                setRun((prev) => prev + 1);
                setSuccessMessage('User updated successfully.');
                setErrorMessage('');
                setEditingUser(null);
            }
        } catch (error) {
            console.error("Update failed", error);
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('Failed to update user.');
            }
            setSuccessMessage('');
        }
    }

    const handleSearch = (e) => {
        setUsername(e.target.value);
    };

    const handleRegisterDate = (e) => {
        setRegisterDate(e.target.value);
    };

    const handleStartDate = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDate = (e) => {
        setEndDate(e.target.value);
    };

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            let response;

            if (username) {
                console.log(`Searching users by username: ${username}`);
                response = await axios.get(`${url}/username/${username}`);
            } else if (registerDate) {
                console.log(`Searching users by registration date: ${registerDate}`);
                response = await axios.get(`${url}/${registerDate}`);
            } else if (startDate && endDate) {
                response = await axios.get(`${url}/registered-between?startDate=${startDate}&endDate=${endDate}`);
                console.log(`Searching users between dates ${startDate} and ${endDate}`);
            } else {
                console.log("Fetching all users");
                response = await axios.get(url);
            }

            setData(response.data);
        } catch (error) {
            console.error("Search failed", error);
            setErrorMessage('Search failed.');
        } finally {
            setLoading(false);
        }
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        setSuccessMessage('');
        setErrorMessage('');
    };

    if (loading) return <LinearProgress />;

    const columns = [
        {
            name: 'Username',
            selector: row => row.username || 'No Name Available',
            sortable: true,
        },
        {
            name: 'Email',
            selector: row => row.email || 'No Email Available',
            sortable: true,
        },
        {
            name: 'Registration Date',
            selector: row => row.registerDate?.split('T')[0] || 'No Date Available',
            sortable: true,
        },
        {
            name: 'Action',
            cell: row => (
                <div className='buttonrow'>
                    <button className='btn' onClick={() => openEditModal(row)}>Edit</button>
                    <button className='btn' onClick={() => deleteUser(row.id)}>Delete</button>
                </div>
            ),
        },
    ];

    return (
        <div className="search-table-container">
            <h1>Search Page</h1>
            <div className="search-container">
                <form className='form-home' onSubmit={handleSearchSubmit}>
                    <input
                        type="text"
                        placeholder="Search by username..."
                        value={username}
                        onChange={handleSearch}
                        className="form-input"
                    />
                    <input
                        type="date"
                        placeholder="Search by date..."
                        value={registerDate}
                        onChange={handleRegisterDate}
                        className="form-input"
                    />
                    <button className='btn' type="submit">Search</button>
                </form>
                <form className='form-home' onSubmit={handleSearchSubmit}>
                    From <input
                        type="date"
                        placeholder="Start date..."
                        value={startDate}
                        onChange={handleStartDate}
                        className="form-input"
                    />
                    to <input
                        type="date"
                        placeholder="End date..."
                        value={endDate}
                        onChange={handleEndDate}
                        className="form-input"
                    />
                    <button className='btn' type="submit">Search by Date Range</button>
                    <button className='btn' onClick={deleteUsersByDateRange}>Delete Users by Date Range</button>
                </form>
            </div>

            <DataTable
                columns={columns}
                data={data}
                pagination
                highlightOnHover
            />

            {editingUser && (
                <Modal
                    open={Boolean(editingUser)}
                    onClose={() => setEditingUser(null)}
                >
                    <Box 
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 4,
                            borderRadius: 2,
                        }}
                    >
                        <h2>Edit User</h2>
                        <TextField
                            label="Username"
                            variant="outlined"
                            fullWidth
                            value={editingUser.username}
                            onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            value={editingUser.email}
                            onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <Button variant="contained" onClick={updateUser} color="primary">
                            Save
                        </Button>
                        <Button variant="outlined" onClick={() => setEditingUser(null)} color="secondary" sx={{ ml: 1 }}>
                            Cancel
                        </Button>
                        {successMessage && <Alert severity="success">{successMessage}</Alert>}
                        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                    </Box>
                </Modal>
            )}
        </div>
    );
}
