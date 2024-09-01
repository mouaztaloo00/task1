import React, { useEffect, useState } from 'react';
import axios from "axios";
import DataTable from 'react-data-table-component';
import { Modal, Box, TextField, Button } from '@mui/material';

export default function Home() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [runUseEffect, setRun] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchDate, setSearchDate] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [search, setSearch] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const url = `${process.env.REACT_APP_API_BASE_URL}/users`;
    useEffect(() => {
        fetch( url )
            .then(response => response.json())
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, [runUseEffect,url]);

    async function deleteUser(id) {
        try {
            const res = await axios.delete(`${url}/${id}`);
            if (res.status === 200) {
                setRun((prev) => prev + 1);
            }
        } catch {
            console.log("Deletion failed");
        }
    }

    async function updateUser() {
        try {
            const res = await axios.put(`${url}/${editingUser.id}`, editingUser);
            if (res.status === 200) {
                setRun((prev) => prev + 1);
                setEditingUser(null); // اغلاق المودال بعد التحديث
            }
        } catch {
            console.log("Update failed");
        }
    }

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchDate = (e) => {
        setSearchDate(e.target.value);
    };

    const handleStartDate = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDate = (e) => {
        setEndDate(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearch(true);
    };

    const openEditModal = (user) => {
        setEditingUser(user);
    };

    let filteredData = data;
    if (search) {
        filteredData = data.filter(users => {
            const formattedDate = users.registerDate?.split('T')[0]; // التأكد من تنسيق التاريخ ليكون YYYY-MM-DD فقط// التأكد من تنسيق التاريخ ليكون YYYY-MM-DD فقط
            if (searchTerm) {
                return users.username?.toLowerCase().includes(searchTerm.toLowerCase());
            } else if (searchDate) {
                return formattedDate === searchDate;
            } else if (startDate && endDate) {
                return formattedDate >= startDate && formattedDate <= endDate;
            }
            return true;
        });
    }

    if (loading) return <p>Loading...</p>;

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
            selector: row => row.registerDate?.split('T')[0] || 'No Date Available', // عرض التاريخ بصيغة YYYY-MM-DD فقط
            sortable: true,
        },
        {
            name: 'Action',
            cell: row => (
                <div className=' buttonrow'>
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
                        value={searchTerm}
                        onChange={handleSearch}
                        className="form-input"
                    />
                    <input
                        type="date"
                        placeholder="Search by date..."
                        value={searchDate}
                        onChange={handleSearchDate}
                        className="form-input"
                    />
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
                    <button type="submit" className="btn">Search</button>
                </form>
            </div>

            <DataTable
                columns={columns}
                data={filteredData}
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
                        {/* <TextField
                            label="Registration Date"
                            variant="outlined"
                            type="date"
                            fullWidth
                            value={editingUser.date?.split('T')[0]} // التأكد من تنسيق التاريخ ليكون YYYY-MM-DD
                            onChange={(e) => setEditingUser({ ...editingUser, date: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                            sx={{ mb: 2 }}
                        /> */}
                        <Button variant="contained" onClick={updateUser} color="primary">
                            Save
                        </Button>
                        <Button variant="outlined" onClick={() => setEditingUser(null)} color="secondary" sx={{ ml: 1 }}>
                            Cancel
                        </Button>
                    </Box>
                </Modal>
            )}
        </div>
    );
}
