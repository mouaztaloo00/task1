import React, { useEffect, useState } from 'react';
import axios from "axios";
import DataTable from 'react-data-table-component';
import { Modal, Box, TextField, Button , LinearProgress} from '@mui/material';

export default function Hometest() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [runUseEffect, setRun] = useState(0);
    const [username, setusername] = useState('');
    const [registerDate, setregisterDate] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
   // const [search, setSearch] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
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
            console.log("Error fetching data", error);
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
            }
        } catch {
            console.log("Deletion failed");
        }
    }

    async function deleteUsersByDateRange() {
        try {
            console.log(`Sending request to delete users from ${startDate} to ${endDate}`);
            const res = await axios.delete(`${url}/registered-between?startDate=${startDate}&endDate=${endDate}`);
            if (res.status === 200) {
                setRun((prev) => prev + 1);
            }
        } catch {
            console.log("Bulk deletion failed");
        }
    }

    async function updateUser() {
        try {
            console.log(`Sending request to update user with ID: ${editingUser.id}`);
            const res = await axios.put(`${url}/${editingUser.id}`, editingUser);
            if (res.status === 200) {
                setRun((prev) => prev + 1);
                setEditingUser(null); // إغلاق المودال بعد التحديث
            }
        } catch {
            console.log("Update failed");
        }
    }

    const handleSearch = (e) => {
        setusername(e.target.value);
    };

    const handleregisterDate= (e) => {
        setregisterDate(e.target.value);
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
                console.log(`Searching users between dates ${response}`);

                // http://localhost:8080/users/registered-between?startDate=01-01-2024&endDate=01-28-2024
            } else {
                console.log("Fetching all users");
                response = await axios.get(url);
            }

            setData(response.data);
        } catch (error) {
            console.log("Search failed", error);
        } finally {
            setLoading(false);
        }
    };

    const openEditModal = (user) => {
        setEditingUser(user);
    };

<<<<<<< HEAD
    if (loading) return <p>Loading...</p>;
=======
    let filteredData = data;
    if (search) {
        filteredData = data.filter(users => {
            const formattedDate = users.registerDate?.split('T')[0]; // التأكد من تنسيق التاريخ ليكون YYYY-MM-DD فقط
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

    if (loading) return <LinearProgress />
>>>>>>> 4523fc5990ac618c47a08fa90c6d4b669ff4d971

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
                <div className='buttonrow'>
                    <button className='btn' onClick={() => openEditModal(row)}>Edit</button>
                    <button className='btn' onClick={() => deleteUser(row.id)}>Delete</button>
                </div>
            ),
        },
    ];
    // const columns = [
    //     {
    //         name: 'Username',
    //         selector: row => row.username || 'No Name Available',
    //         sortable: true,
    //     },
    //     {
    //         name: 'Email',
    //         selector: row => row.email || 'No Email Available',
    //         sortable: true,
    //     },
    //     {
    //         name: 'Registration Date',
    //         selector: row => {
    //             // استخراج التاريخ بصيغة YYYY-MM-DD
    //             const formattedDate = row.registerDate?.split('T')[0];
    
    //             // إذا كان التاريخ موجودًا، قم بتحويله إلى صيغة "DD-MM-YYYY" للعرض فقط
    //             if (formattedDate) {
    //                 // تقسيم التاريخ إلى سنة، شهر، يوم
    //                 const [year, month, day] = formattedDate.split('-');
                    
    //                 // إعادة ترتيب التاريخ إلى صيغة "DD-MM-YYYY"
    //                 return `${day}-${month}-${year}`;
    //             } else {
    //                 return 'No Date Available';
    //             }
    //         },
    //         sortable: true,
    //     },
    //     {
    //         name: 'Action',
    //         cell: row => (
    //             <div className='buttonrow'>
    //                 <button className='btn' onClick={() => openEditModal(row)}>Edit</button>
    //                 <button className='btn' onClick={() => deleteUser(row.id)}>Delete</button>
    //             </div>
    //         ),
    //     },
    // ];
    
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
                        onChange={handleregisterDate}
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
                            borderRadius: 2,  // تنسيق لتدوير حواف المودال
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
                    </Box>
                </Modal>
            )}
        </div>
    );
}
