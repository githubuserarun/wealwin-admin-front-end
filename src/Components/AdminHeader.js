import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';

function AdminHeader() {
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            Cookies.remove('jwtAdminToken');
            navigate('/admin-login');
        }
    };
    return (
        <>
            <Navbar bg="primary" data-bs-theme="light">
                <Container>
                    <Navbar.Brand href="/">Adminpanel</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="/">Dashboard</Nav.Link>
                        <Nav.Link href="/admin-handle-users">Users</Nav.Link>
                        <NavDropdown title="Products" id="navbarScrollingDropdown">
                            <NavDropdown.Item href="/admin-products">View Products</NavDropdown.Item>
                            <NavDropdown.Item href="/admin-catogory">view category</NavDropdown.Item>
                            <NavDropdown.Item href="/admin-subCatogory">view subcategories</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action5">
                                <Button type='button ' className=' border- align-center' onClick={handleLogout}>Logout</Button>
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Container>
            </Navbar>
        </>
    );
}

export default AdminHeader;