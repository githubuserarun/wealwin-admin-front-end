import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import AdminHeader from './AdminHeader';

const AdminAddProducts = () => {

    const [categoryData, setCategoryData] = useState([])
    const [subCategoryData, setSubCategoryData] = useState([])
    const [categoryId, setCategoryId] = useState('')
    const [productName, setProductName] = useState('');
    const [category, setCategory] = useState('');
    const [subcategory, setSubcategory] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(null)
    const [quantity, setQuantity] = useState(1);
    const [image, setImage] = useState('');


    // Define categories and subcategories as nested objects

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('productName', productName);
        formData.append('category', category);
        formData.append('subcategory', subcategory);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('quantity', quantity);
        formData.append('image', image);


        try {

            const response = await axios.post('http://localhost:5000/api/product/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 201) {

                toast.success('Product added successfully!');
                setProductName('');
                setCategory('');
                setSubcategory('');
                setDescription('');
                setPrice(0)
                setQuantity(1);
                setImage(null);

            } else {
                toast.error("Failed to add product!")
            }

        } catch (error) {
            console.error(error);
            toast.error("Failed to add product!")
        }
    };


    // Function to handle quantity changes
    const handleQuantityChange = (type) => {
        if (type === 'increment') {
            setQuantity(quantity + 1);
        } else if (type === 'decrement' && quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/product/view-cat');
            if (response.data.status) {
                setCategoryData(response.data.data);
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
                // console.log("res subcat", response.data)
                setSubCategoryData(response.data.data);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error);
        }
    };

    let filteredProducts = subCategoryData.filter(cat => cat.categoryId._id === categoryId)


    console.log(filteredProducts)
    
    const onchangeCategory = (e) => {

        const selectedValue = JSON.parse(e.target.value);
        setCategoryId(selectedValue.id); // Accessing category._id
        setCategory(selectedValue.name); // Accessing category.category
       

    }

    useEffect(() => {
        fetchSubCategories();
        fetchCategories();
    }, []);

    return (

        <div>
            <AdminHeader />
            <Container className='d-flex flex-column justify-content-center'>
                <Link to='/admin-products' className='mt-2  align-self-end '>
                    <button type='button '>Back</button>
                </Link>
                <Form onSubmit={handleSubmit} className="card p-3 border-primary mt-4 gap-3">
                    <Form.Group controlId="productName">
                        <Form.Label>Product Name</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Enter product name"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="category">
                        <Form.Label>Category</Form.Label>
                        <Form.Control

                            required
                            as="select"
                            // value={category}
                            onChange={onchangeCategory}
                        >

                            <option disabled selected>
                                select a category
                            </option>
                            {categoryData.map((category) => (
                                <option key={category._id} value={JSON.stringify({ id: category._id, name: category.category })} >
                                    {category.category}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="subcategory">
                        <Form.Label>Subcategory</Form.Label>
                        <Form.Control
                            required
                            as="select"
                            value={subcategory}
                            onChange={(e) => setSubcategory(e.target.value)}

                        >
                            {filteredProducts.map((category) => (
                                <option key={category._id} >
                                    {category.subcategory}
                                </option>
                            ))}
                            {/* {subCategoryData.filter(subcat=>subcat.categoryId===categoryId)
                            .map((subcat) => (
                                <option key={subcat._id} value={subcat._id} >
                                    {subcat.subcategory}
                                </option>
                            ))} */}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            required
                            as="textarea"
                            rows={3}
                            placeholder="Enter product description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="price">
                        <Form.Label>price</Form.Label>
                        <div className="input-group">
                            <Form.Control
                                required
                                type="number"
                                pattern="[0-9]*[.]?[0-9]*"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>
                    </Form.Group>

                    <Form.Group controlId="quantity">
                        <Form.Label>Quantity</Form.Label>
                        <div className="input-group">
                            <Button
                                className="quantity-btn"
                                variant="outline-secondary"
                                onClick={() => handleQuantityChange('decrement')}
                            >
                                -
                            </Button>
                            <Form.Control
                                required
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value))}
                            />
                            <Button
                                className="quantity-btn"
                                variant="outline-secondary"
                                onClick={() => handleQuantityChange('increment')}
                            >
                                +
                            </Button>
                        </div>
                    </Form.Group>

                    <Form.Group controlId="image">
                        <Form.Label>Select Image</Form.Label>
                        <Form.Control
                            required
                            type="file"
                            accept="image/*"
                            placeholder="Enter image URL"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                    </Form.Group>

                    <div className="d-flex justify-content-center">
                        <Button variant="primary" type="submit">
                            Add Product
                        </Button>
                    </div>
                </Form>
            </Container>
        </div>
    );
};

export default AdminAddProducts;
