import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductTable from './ProductTable';
import AdminHeader from './AdminHeader';

const AdminViewProducts = () => {

    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/product/view');
            if (response.data.status) {
                const data = response.data.data;
                //const {data} = await response.data
                setProducts(data);

            } else {
                console.log(response.data.error)
            }

        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const updateProducts = ()=>{
        fetchProducts();
    }

    useEffect(() => {
        fetchProducts();
    }, []);



    return (
        <div>
            <div>
                <AdminHeader />
            </div>
            <div>
                <Container className='d-flex flex-column justify-content-center'>
                    <div className='d-flex flex-row justify-content-end gap-2 mt-2 mb-2'>
                        <Link to='/admin-add-products' >
                            <button className='bg-success' type='button '>Add new product</button>
                        </Link>
                        

                    </div>

                    <ProductTable products={products} updateProducts={updateProducts} />
                </Container>
            </div>
        </div>
    )
}
export default AdminViewProducts;