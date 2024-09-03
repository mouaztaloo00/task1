import React, { useEffect, useState } from 'react';
import axios from "axios";
import {
    Modal, Box, TextField, Button, LinearProgress, Snackbar,
    IconButton, Card, CardContent, CardActions, Typography, Pagination
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function Home() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [runUseEffect, setRun] = useState(0);
    const [username, setUsername] = useState('');
    const [registerDate, setRegisterDate] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [snackbarMessage, setSnackbarMessage] = useState({ text: '', type: '' });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [deleteUserId, setDeleteUserId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const url = `${process.env.REACT_APP_API_BASE_URL}/users`;

    useEffect(() => {
        fetchData();
    }, [runUseEffect]);

    const showSnackbar = (text, type) => {
        setSnackbarMessage({ text, type });
        setSnackbarOpen(true);
        setTimeout(() => setSnackbarOpen(false), 3000);
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(url);
            setData(response.data);
        } catch (error) {
            showSnackbar('Failed to fetch data.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = (id) => {
        setDeleteUserId(id);
    };

    const confirmDeleteUser = async () => {
        try {
            const res = await axios.delete(`${url}/${deleteUserId}`);
            if (res.status === 200) {
                setRun((prev) => prev + 1);
                showSnackbar('User deleted successfully.', 'success');
            }
        } catch (error) {
            showSnackbar('Failed to delete user.', 'error');
        } finally {
            setDeleteUserId(null);
        }
    };

    const cancelDeleteUser = () => {
        setDeleteUserId(null);
    };

    async function deleteUsersByDateRange() {
        try {
            const res = await axios.delete(`${url}/registered-between?startDate=${startDate}&endDate=${endDate}`);
            if (res.status === 200) {
                setRun((prev) => prev + 1);
                showSnackbar('Users deleted successfully within the date range.', 'success');
            }
        } catch (error) {
            showSnackbar('Failed to delete users within the date range.', 'error');
        }
    }

    async function updateUser() {
        try {
            const res = await axios.put(`${url}/${editingUser.id}`, {
                username: editingUser.username,
                email: editingUser.email,
            });

            if (res.status === 200) {
                setRun((prev) => prev + 1);
                showSnackbar('User updated successfully.', 'success');
                setEditingUser(null);
            }
        } catch (error) {
            showSnackbar('Failed to update user.', 'error');
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
                response = await axios.get(`${url}/username/${username}`);
            } else if (registerDate) {
                response = await axios.get(`${url}/${registerDate}`);
            } else if (startDate && endDate) {
                response = await axios.get(`${url}/registered-between?startDate=${startDate}&endDate=${endDate}`);
            } else {
                response = await axios.get(url);
            }

            if (response.data.length === 0) {
                showSnackbar('No users found.', 'error');
            } else {
                setData(response.data);
                showSnackbar('Search completed successfully.', 'success');
            }
        } catch (error) {
            showSnackbar('Search failed.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const openEditModal = (user) => {
        setEditingUser(user);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    if (loading) return <LinearProgress />;

    return (
        <div className="search-table-container">
            <Typography variant="h4" gutterBottom>Administrator</Typography>

            <div className="search-container">
            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <Box component="form" onSubmit={handleSearchSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                    <TextField
                        label="Search by Username"
                        variant="outlined"
                        value={username}
                        onChange={handleSearch}
                        fullWidth
                        sx={{ maxWidth: 400 }}
                    />
                    <TextField
                        label="Search by Registration Date"
                        type="date"
                        variant="outlined"
                        value={registerDate}
                        onChange={handleRegisterDate}
                        fullWidth
                        sx={{ maxWidth: 400 }}
                        InputLabelProps={{ shrink: true }}
                    />
                    <Button sx={{ maxWidth: 400 }} variant="contained" type="submit" color="primary">Search</Button>
                </Box>
                <Box component="form" onSubmit={handleSearchSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                    <TextField
                        label="From"
                        type="date"
                        variant="outlined"
                        value={startDate}
                        onChange={handleStartDate}
                        sx={{ maxWidth: 320 }}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="To"
                        type="date"
                        variant="outlined"
                        value={endDate}
                        onChange={handleEndDate}
                        sx={{ maxWidth: 320 }}
                        InputLabelProps={{ shrink: true }}
                    />
                     <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button variant="contained" type="submit" color="primary">
                            Search by Date
                        </Button>
                        <Button variant="outlined" color="error" onClick={deleteUsersByDateRange}>
                            Delete by Date
                        </Button>
                    </Box>
                </Box>
            </Box>
        </div>

            <Pagination
                count={Math.ceil(data.length / itemsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                sx={{ margin: '20px 0', display: 'flex', justifyContent: 'center' }}
            />

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                {currentItems.map((user) => (
                    <Card key={user.id} sx={{ maxWidth: 345 }}>
                        <CardContent>
                            <Typography variant="h6">{user.username || 'No Name Available'}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {user.email || 'No Email Available'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Registered: {user.registerDate?.split('T')[0] || 'No Date Available'}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={() => openEditModal(user)}>Edit</Button>
                            <Button size="small" color="error" onClick={() => handleDeleteUser(user.id)}>Delete</Button>
                        </CardActions>
                    </Card>
                ))}
            </div>

            <Modal open={Boolean(deleteUserId)} onClose={cancelDeleteUser}>
                <Box 
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 300,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                        textAlign: 'center'
                    }}
                >
                    <Typography variant="h6">Confirm Deletion</Typography>
                    <Typography variant="body1">Are you sure you want to delete this user?</Typography>
                    <Box sx={{ mt: 2 }}>
                        <Button variant="contained" onClick={confirmDeleteUser} color="error" sx={{ mr: 1 }}>
                            Delete
                        </Button>
                        <Button variant="outlined" onClick={cancelDeleteUser}>
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {editingUser && (
                <Modal open={Boolean(editingUser)} onClose={() => setEditingUser(null)}>
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
                        <Typography variant="h6">Edit User</Typography>
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
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button variant="contained" onClick={updateUser} color="primary">Save</Button>
                            <Button variant="outlined" onClick={() => setEditingUser(null)} color="secondary">Cancel</Button>
                        </Box>
                    </Box>
                </Modal>
            )}

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                action={
                    <IconButton size="small" aria-label="close" color="inherit" onClick={() => setSnackbarOpen(false)}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            >
                <Box
                    sx={{
                        backgroundColor: snackbarMessage.type === 'success' ? 'green' : 'red',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '20px',
                    }}
                >
                    {snackbarMessage.text}
                </Box>
            </Snackbar>
        </div>
    );
}
