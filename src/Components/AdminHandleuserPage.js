import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import AdminHeader from './AdminHeader';
import { useNavigate } from 'react-router-dom';
import { validateUsername, validateEmail } from './validators';


const AdminHandleuserPage = () => {
    const [userData, setUserData] = useState([])
    const [err, setErr] = useState(null);
    const [show, setShow] = useState(false);
    const [editName, setEditName] = useState(null)
    const [editEmail, setEditEmail] = useState(null)
    const [userId, setUserId] = useState(null)

    const navigate = useNavigate();
    const token = Cookies.get('jwtAdminToken');

    const handleRemove = (id) => {
        if (window.confirm("Are you sure you want to remove the user?")) {
            onRemoveUser(id);  
        }
    };

    const handleClose = () => setShow(false);

    const checkName = validateUsername(editName);
    const checkEmail = validateEmail(editEmail);
    console.log(checkEmail, checkName)

    const handleUpdate = async () => {
        const url = "http://localhost:5000/api/auth/update"
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                userName: editName,
                userEmail: editEmail
            })
        }


        if (checkName === null && checkEmail === null) {
            try {
                const response = await fetch(url, options);
                if (!response.ok) {
                    toast.error("Somthing wrong");
                } else {
                    fetchData();
                    toast.success("user successfully updated");
                    setShow(false);
                }
            } catch (err) {
                toast.error(err)
            }

        } else {
            toast.error("The username must be longer than 3 characters and must be a valid Gmail address")
        }


    }

    const handleShow = (name, email, id) => {
        setShow(true);
        setEditName(name);
        setEditEmail(email);
        setUserId(id);


    }

    const handleNameEdit = (e) => {
        setEditName(e.target.value)
    }

    const handleEmailEdit = (e) => {
        setEditEmail(e.target.value)
    }

    async function fetchData() {
        try {
            const response = await fetch('http://localhost:5000/api/auth/users');
            if (!response.ok) {
                const errorData = await response.json();
                setErr(errorData.msg);
                return;
            }
            const { data } = await response.json();
            setUserData(data)
        } catch (error) {
            console.error('retrive data failed:', error.message);
        }

    }

    const onRemoveUser = async (UserId) => {

        try {
            const response = await axios.delete(`http://localhost:5000/api/auth/remove/${UserId}`);
            console.log("remove response:", response)
            if (response.status !== 200) {
                toast.error(response.data.error || "user not found!")
            } else {
                fetchData();
                toast.success(response.data.message || "User successfully removed!");
            }
        } catch (err) {
            console.log("catchErr :", err)
        }
    }

    useEffect(() => {
        if (token === undefined) {
            navigate('/admin-login');
        }
        fetchData();
    }, [navigate, token]);

    return (
        <div>
            <div>
                <AdminHeader />
            </div>
            <div className=" container d-flex flex-column justify-content-start mt-4 align-items-center">

                <div>
                    <h2>User's Data</h2>
                    {userData.length > 0 ?
                        <table className="table table-striped table-bordered">
                            <thead className="thead-dark">
                                <tr>
                                    <th>Username</th>
                                    <th>Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userData.map((user, index) => (
                                    <tr key={index}>                                       
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td><button className='bg-danger' onClick={() => handleRemove(user._id)}>remove</button></td>
                                        <td><button className='bg-warning text-dark' onClick={() => handleShow(user.username, user.email, user._id)}>edit</button></td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        : <p>Users not found!...</p>
                    }
                </div>

                {err !== null && <p>{err}</p>}
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit user</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <label>user Name</label>
                            <input type='text' value={editName} onChange={handleNameEdit} />
                        </div>
                        <div>
                            <label>user Email</label>
                            <input type='text' value={editEmail} onChange={handleEmailEdit} />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleUpdate}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>


    );
}

export default AdminHandleuserPage;
