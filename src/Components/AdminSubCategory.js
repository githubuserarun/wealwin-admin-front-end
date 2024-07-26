import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Table, Alert, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap';
import AdminHeader from './AdminHeader';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MdDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import Modal from 'react-bootstrap/Modal';

const AdminSubCategories = () => {

    const [dropShow, setDropShow] = useState(false);
    const [categoryList, setCategoryList] = useState([]);
    const [subCategoryList, setSubCategoryList] = useState([])
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [subcategory, setSubCategory] = useState('')
    const [show, setShow] = useState(false)
    const [editCategory, setEditCategory] = useState('');
    const [editCategoryId, setEditCategoryId] = useState('');
    const [editSubCategory, setEditSubCategory] = useState('');
    const [editSubCategoryId, setEditSubCategoryId] = useState('');



    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/category/view-cat');
            if (response.data.status) {
                setCategoryList(response.data.data);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error);
        }
    };

    const fetchSubCategories = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/category/view-subcat');
            if (response.data.status) {
                setSubCategoryList(response.data.data);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error);
        }
    };

    const addSubcategory = async (e) => {
        e.preventDefault();
        const body = {
            categoryId: selectedCategory._id,
            subCategory: subcategory
        }
        console.log(body)
        try {
            const response = await axios.post('http://localhost:5000/api/category/add-subcat', body);
            if (response.data.status) {
                toast.success(response.data.message);
                setSubCategory('')
                fetchSubCategories();
            } else {
                toast.error(response.data.error);
            }
        } catch (error) {
            toast.error(error);
        }
    }

    const body = {
        categoryId: editCategoryId,
        subcategoryName: editSubCategory,
        subcategoryId: editSubCategoryId,
    }

    const fetctToEditSubCat = async () => {
        const body = {
            categoryId: editCategoryId,
            subcategoryName: editSubCategory,
            subcategoryId: editSubCategoryId,
        }

        console.log(body)

        try {
            const response = await axios.put('http://localhost:5000/api/category/update-subcat', body);
            console.log('response', response.data)
            if (response.data.status) {
                toast.success(response.data.message);
                setShow(false);
                fetchSubCategories()
            }
            else {
                toast.success(response.data.error)
            }
        } catch (err) {
            toast.error(err)
        }


    }

    const handleSelect = (eventKey) => {
        const selectedObject = JSON.parse(eventKey);
        setSelectedCategory(selectedObject)
    };

    const selectFromSubcatModal = (eventdata)=>{
        console.log("resch")
        const selectedObject = JSON.parse(eventdata);
        setEditCategory(selectedObject.category);
        setEditCategoryId(selectedObject._id)
        setDropShow(false)
        

    }


    useEffect(() => {
        fetchCategories();
        fetchSubCategories();
    }, []);


    return (
        <div>
            <div>
                <AdminHeader />
            </div>
            <div className='d-flex flex-column justify-content-center align-items-center'>
                <div className='d-flex flex-row justify-content-center align-items-start mt-3 border border-light p-2 max-vw-70'>
                    <Dropdown onSelect={handleSelect} required >

                        <Dropdown.Toggle variant="light" id="dropdown-basic" >
                            {selectedCategory.category || 'Select Category'}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {categoryList.map((category) => (
                                <Dropdown.Item key={category._id.$oid} eventKey={JSON.stringify(category)}>
                                    {category.category}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Container>
                        <Form className='d-flex flex-column justify-content-center' onSubmit={addSubcategory}>
                            <div>
                                <Form.Group >
                                    <Form.Control
                                        style={{ width: '400px' }}
                                        value={subcategory}
                                        onChange={(e) => {
                                            setSubCategory(e.target.value)
                                        }}
                                        type="text"
                                        placeholder="Enter subcategory name"
                                        required
                                    />
                                </Form.Group>
                            </div>
                            <div>
                                <Button variant="success" style={{ width: '200px' }} type="submit">
                                    Add Sub Category
                                </Button>
                            </div>

                        </Form>
                    </Container>

                </div>

            </div>
            <hr />
            <div className='mt-2'>
                <div>
                    <h2>
                        Subcategory List
                    </h2>
                </div>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>N0.</th>
                            <th>Category ID</th>
                            <th>Subcategory</th>

                        </tr>
                    </thead>
                    <tbody>
                        {subCategoryList.map((item, index) => (
                            <tr key={item._id}>
                                <td>{index + 1}</td>
                                <td>{item.categoryId ? item.categoryId.category : 'Unknown'}</td>
                                <td>{item.subcategory}</td>
                                <td style={{ width: '100px' }}>
                                    <Button variant='danger' >
                                        <MdDeleteOutline />
                                    </Button>

                                </td>
                                <td>
                                    <Button variant='secondary' onClick={() => {
                                        setShow(true);
                                        setEditCategory(item.categoryId.category);
                                        setEditSubCategory(item.subcategory)
                                        setEditCategoryId(item.categoryId._id)
                                        setEditSubCategoryId(item._id)
                                    }}>
                                        <CiEdit />
                                    </Button>

                                </td>

                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Modal show={show} onHide={() => setShow(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit subCategory</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <div className='d-flex flex-row justify-content-start align-items-end border p-1 '>
                            <div>
                                <label>category name</label>
                            </div>
                            <div>
                                <Dropdown show={dropShow} onSelect={selectFromSubcatModal} required  >

                                    <Dropdown.Toggle variant="light" id="dropdown-basic" onClick={() => setDropShow(true)}>
                                        {editCategory}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        {categoryList.map((category, index) => (
                                            <Dropdown.Item key={index} eventKey={JSON.stringify(category)}>
                                                {category.category}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>

                            {/* <DropdownButton id="dropdown-basic-button" title="Select Category">
                                {categoryList.map((category, index) => (
                                    <Dropdown.Item key={index} onClick={() => setEditCategory(category.category)}>
                                        {category.category}
                                    </Dropdown.Item>
                                ))}
                            </DropdownButton> */}


                        </div>
                        <div>
                            <label>subCategory name</label>
                            <input type='text' value={editSubCategory} onChange={(e) => {
                                setEditSubCategory(e.target.value)
                            }} />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShow(false)} >
                            Close
                        </Button>
                        <Button variant="primary" onClick={fetctToEditSubCat} >
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>


        </div>
    )
}
export default AdminSubCategories