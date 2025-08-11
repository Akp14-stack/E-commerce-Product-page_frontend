import React from 'react';
import {
  Button,
  Container,
  Form,
  Nav,
  Navbar,
  Offcanvas,
  NavDropdown,
} from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaBoxOpen } from 'react-icons/fa';

function Header() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [role, setRole] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    setIsLoggedIn(!!token);
    setRole(storedRole);
  }, []);

  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate('/login');
  };

  const expand = 'lg';
  const isActive = (path) => (location.pathname === path ? 'active-link' : '');

  // 🔍 Only navigate with search term
  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <>
      <Navbar expand={expand} className="bg-white shadow-lg py-3">
        <Container fluid>
          <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 text-primary">
            🛍️ E-COMMERCE
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="offcanvasNavbar" />
          <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="offcanvasNavbarLabel">
                Navigation Menu
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3 gap-2">

                {role === 'user' && (
                  <>
                    <Nav.Link as={Link} to="/" className={isActive('/')}>
                      Home
                    </Nav.Link>
                    <Nav.Link as={Link} to="/products" className={isActive('/products')}>
                      Products
                    </Nav.Link>
                    <Nav.Link as={Link} to="/cart" className={isActive('/cart')}>
                      <FaShoppingCart className="me-1" /> Cart
                    </Nav.Link>
                    <Nav.Link as={Link} to="/my-orders" className={isActive('/my-orders')}>
                      <FaBoxOpen className="me-1" /> My Orders
                    </Nav.Link>
                  </>
                )}

                {role === 'admin' && (
                  <>
                    <Nav.Link as={Link} to="/admin/products" className={isActive('/admin/products')}>
                      All Products
                    </Nav.Link>
                    <Nav.Link as={Link} to="/admin/add-product" className={isActive('/admin/add-product')}>
                      Add Product
                    </Nav.Link>
                    <Nav.Link as={Link} to="/admin/orders" className={isActive('/admin/orders')}>
                      Orders
                    </Nav.Link>
                  </>
                )}

                <NavDropdown
                  title={<span><FaUser className="me-1" /> Profile</span>}
                  id={`offcanvasNavbarDropdown-expand-${expand}`}
                >
                  {isLoggedIn ? (
                    <>
                      <NavDropdown.Item as={Link} to="/profile">
                        My Profile
                      </NavDropdown.Item>
                      <NavDropdown.Item onClick={logout}>
                        Logout
                      </NavDropdown.Item>
                    </>
                  ) : (
                    <>
                      <NavDropdown.Item as={Link} to="/login">
                        Login
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/sign-up">
                        Sign Up
                      </NavDropdown.Item>
                    </>
                  )}
                </NavDropdown>
              </Nav>

              {/* 🔍 Search Box */}
              <Form
                className="d-flex mt-4 mt-lg-0 ms-lg-3"
                role="search"
                onSubmit={handleSearch}
              >
                <Form.Control
                  type="search"
                  placeholder="Search products..."
                  className="me-2 rounded-pill px-3 border-secondary"
                  style={{ maxWidth: '250px' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button
                  variant="outline-primary"
                  className="rounded-pill px-4"
                  type="submit"
                >
                  Search
                </Button>
              </Form>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>

      <style>{`
        .active-link {
          font-weight: bold;
          color: #0d6efd !important;
          text-decoration: underline;
        }
        .navbar-nav .nav-link {
          transition: all 0.2s ease-in-out;
        }
        .navbar-nav .nav-link:hover {
          color: #0d6efd;
        }
      `}</style>
    </>
  );
}

export default Header;
