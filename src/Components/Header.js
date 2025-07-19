import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';

function OffcanvasNavbar() {
  return (
    <>
      <Navbar expand="lg" className="bg-light mb-3 shadow-sm">
        <Container fluid>
          <Navbar.Brand href="#">E-COMMERCE</Navbar.Brand>
          <Navbar.Toggle aria-controls="offcanvasNavbar" />
          <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="offcanvasNavbarLabel">
                Menu
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/products">Products</Nav.Link>
                <Nav.Link href="/cart">Cart</Nav.Link>
                <Nav.Link href="/orders">Orders</Nav.Link>
                <Nav.Link href="/profile">Profile</Nav.Link>
              </Nav>
              <Form className="d-flex mt-3 mt-lg-0">
                <Form.Control
                  type="search"
                  placeholder="Search products..."
                  className="me-2"
                  aria-label="Search"
                />
                <Button variant="outline-primary">Search</Button>
              </Form>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
}

export default OffcanvasNavbar;
