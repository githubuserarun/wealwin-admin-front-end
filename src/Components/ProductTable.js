import React from 'react';
import { Table } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { useEffect, useState } from 'react';
import { useNavigate} from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Modal.css';



const ProductTable = ({ products ,updateProducts}) => {

  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [modelData, setModelData] = useState([])

  const [categoryData, setCategoryData] = useState([])
  const [subCategoryData, setSubCategoryData] = useState([])
  const [categoryId, setCategoryId] = useState('')
  const [productId, setProductId] = useState('')
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(null)
  const [quantity, setQuantity] = useState(1);
  const [image, setImage] = useState('');


  const [selectedImage, setSelectedImage] = useState(null)
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

      const response = await axios.put(`http://localhost:5000/api/product/update/${productId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data.status) {

        toast.success(response.data.message);
        setProductName('');
        setCategory('');
        setSubcategory('');
        setDescription('');
        setPrice(0)
        setQuantity(1);
        setImage(null);
        setShow(false)
        updateProducts();

      } else {
        toast.error(response.data.error)
      }

    } catch (error) {
      console.error(error);
      toast.error(error)
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
      const response = await axios.get('http://localhost:5000/api/category/view-cat');
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

  const onchangeCategory = (e) => {

    const selectedValue = JSON.parse(e.target.value);
    setCategoryId(selectedValue.id); // Accessing category._id
    setCategory(selectedValue.name); // Accessing category.category
    // setCategoryId(e.target.value);

  }


  const handleClose = () => setShow(false);

  const openModal = (data) => {
    setShow(true)
    setProductId(data._id)
    setProductName(data.productName);
    setCategory(data.category);
    setSubcategory(data.subcategory);
    setDescription(data.description);
    setPrice(data.price)
    setQuantity(data.quantity);
    setImage(data.image);
    console.log(data);


  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    fetchSubCategories();
    fetchCategories();
  }, []);
  console.log('cat',category)
  console.log('subcat',subcategory)

  return (
    <div>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Product Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Subcategory</th>
            <th>Quantity</th>
            <th>Image</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product._id}>
              <td>{index + 1}</td>
              <td>{product.productName}</td>
              <td>{product.description}</td>
              <td>Rs {product.price}/-</td>
              <td>{product.category}</td>
              <td>{product.subcategory}</td>
              <td>{product.quantity}</td>
              <td>
                <img src={`http://localhost:5000/${product.image}`} alt={product.productName} style={{ maxWidth: '100px' }} />
              </td>
              <td><button type='button' onClick={() => openModal(product)}>Edit</button></td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal show={show} onHide={handleClose}    >
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
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
                  value={category.name}
                  onChange={onchangeCategory}
                >

                  {/* <option disabled selected defaultValue={category}>
                    select category
                  </option> */}
                  {categoryData.map((category) => (
                    <option key={category._id} value={JSON.stringify({ id: category._id, name: category.category })} >
                      {category.category}
                    </option>
                  ))}
                  {/* {categoryData.map((category) => (
                    <option key={category._id} value={category._id} >
                      {category.category}
                    </option>
                  ))} */}
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
                  <Form.Control className='w-100'
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
                <div className="input-group d-flex flex-row ">
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
                  // value={image}
                  onChange={(e) => handleImageChange(e)}
                />
                {selectedImage !== null ?
                  <div>
                    <img src={selectedImage} alt="Selected" style={{ maxWidth: '100px' }} />
                  </div>
                  :
                  <div>
                    <img src={`http://localhost:5000/${image}`} alt={productName} style={{ maxWidth: '100px' }} />
                  </div>


                }

              </Form.Group>



            </Form>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)} >
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductTable;


