import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Table, Alert, Row, Col } from 'react-bootstrap';
import AdminHeader from './AdminHeader';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MdDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import Modal from 'react-bootstrap/Modal';



const AdminCatogory = () => {

    const [category, setCategory] = useState([])
    const [newCategory, setNewCategory] = useState('');
    const [show, setShow] = useState(false);
    const [updatedCategoryId, setUpdateCategoryId] = useState([])
    const[updatedCategoryName, setUpdateCategoryName] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/category/add-cat', { category: newCategory });
            console.log(response)
            if (response.data.status) {
                toast.success("Category added successfully!")
                setNewCategory('');
                fetchCategories();
            } else {
                toast.success("Failed to add category.")
            }
        } catch (error) {
            toast.success("Server error.")
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/category/view-cat');
            if (response.data.status) {
                setCategory(response.data.data);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error);
        }
    };

    const handledelCategories = (catId) => {
        if (window.confirm("Are you sure you want to remove the user?")) {
            delCategories(catId);  
        }
    };

    const delCategories = async (catId) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/category/del-cat/${catId}`);
            if (response.data.status) {
                toast.success(response.data.message)
                fetchCategories();
            } else {
                toast.error(response.data.message)
            }
        } catch (err) {
            toast.error(err)
        }
    }

    const updateCategories = async () => {
        try {
            const response = await axios.put('http://localhost:5000/api/category/update-cat',{id:updatedCategoryId,category:updatedCategoryName});
            if (response.data.status) {
                toast.success(response.data.message)
                fetchCategories();
                setShow(false)
            } else {
                toast.error(response.data.message)
            }
        } catch (err) {
            toast.error(err)
        }
    }

    useEffect(() => {


        fetchCategories();
    }, []);

    return (
        <div >
            <div>
                <AdminHeader />
            </div>
            <div className=' mt-3 '>
                <Container>
                    <Form onSubmit={handleSubmit} className='d-flex flex-column justify-content-center'>
                        <div>
                            <Form.Group controlId="formCategory">
                                <Form.Control
                                    style={{ width: '400px' }}
                                    type="text"
                                    placeholder="Enter category name"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    required
                                />
                            </Form.Group>
                        </div>
                        <div>
                            <Button variant="success" style={{ width: '200px' }} type="submit">
                                Add Category
                            </Button>
                        </div>

                    </Form>
                </Container>
            </div>
            <div >
                <Container>
                    <h2>Category List</h2>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Category</th>

                            </tr>
                        </thead>
                        <tbody>
                            {category.map((category,index) => (
                                <tr key={category._id}>
                                    <td>{index + 1}</td>
                                    <td>{category.category}</td>
                                    <td style={{width:'100px'}}>
                                        <Button variant='danger' onClick={() => handledelCategories(category._id)}>
                                            <MdDeleteOutline />
                                        </Button>

                                    </td>
                                    <td>
                                        <Button variant='secondary' onClick={()=>{setUpdateCategoryId(category._id); setUpdateCategoryName(category.category);setShow(true)}}>
                                            <CiEdit />
                                        </Button>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Container>
            </div>
            <Modal show={show} onHide={()=>setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit user</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <label>category id</label>
                        <input type='text' value={updatedCategoryId} disabled />
                    </div>
                    <div>
                        <label>category name</label>
                        <input type='text' value={updatedCategoryName} onChange={(e)=>setUpdateCategoryName(e.target.value)} />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)} >
                        Close
                    </Button>
                    <Button variant="primary" onClick={()=>updateCategories()} >
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>

    )
}
export default AdminCatogory;